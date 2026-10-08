import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchGoogleReviews, validateProfile, validateGoogleUrl } from '../server/google-client.mjs';
import { createMemoryCache, createRedisCache } from '../server/cache.mjs';
import { createReviewsService } from '../server/service.mjs';
import { createReviewsHandler, createVercelReviewsHandler, serviceFromEnv } from '../server/http.mjs';

const profile = { accountId: '123', locationId: '456' };
const credentials = { clientId: 'CLIENT', clientSecret: 'SECRET', refreshToken: 'REFRESH' };
const googleUrl = 'https://share.google/example';
const date = '2026-10-08T12:00:00.000Z';
const review = (id, comment = `Review ${id}`) => ({ reviewId: id, reviewer: { displayName: `Author ${id}` },
  comment, starRating: 'FIVE', createTime: date, updateTime: date });
const page = (reviews, count = reviews.length, nextPageToken) => ({ reviews, totalReviewCount: count,
  averageRating: count ? 5 : undefined, ...(nextPageToken ? { nextPageToken } : {}) });
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers });
function fakeGoogle(responses) {
  const calls = [];
  return { calls, fetchImpl: async (url, init) => {
    calls.push({ url: String(url), init });
    if (calls.length === 1) return json({ access_token: 'ACCESS_TOKEN' });
    const next = responses.shift();
    assert.ok(next, 'Unexpected additional Google call');
    return next instanceof Response ? next : json(next);
  } };
}

test('one profile, two pages, correct endpoint, OAuth renewal, unaltered comments and Google aggregate', async () => {
  const mock = fakeGoogle([page([review('a', '<script>bad()</script>\nOlá')], 2, 'PAGE_2'), page([review('b')], 2)]);
  const result = await fetchGoogleReviews(profile, credentials, mock);
  assert.equal(result.reviews.length, 2);
  assert.equal(result.reviews[0].comment, '<script>bad()</script>\nOlá');
  assert.equal(result.averageRating, 5);
  assert.equal(mock.calls[0].url, 'https://oauth2.googleapis.com/token');
  assert.equal(mock.calls[0].init.body.get('refresh_token'), 'REFRESH');
  assert.equal(mock.calls[0].init.redirect, 'error');
  for (const call of mock.calls.slice(1)) {
    const url = new URL(call.url);
    assert.equal(url.origin, 'https://mybusiness.googleapis.com');
    assert.equal(url.pathname, '/v4/accounts/123/locations/456/reviews');
    assert.equal(url.searchParams.get('pageSize'), '50');
    assert.equal(url.searchParams.get('orderBy'), 'updateTime desc');
    assert.equal(call.init.headers.authorization, 'Bearer ACCESS_TOKEN');
  }
  assert.equal(new URL(mock.calls[2].url).searchParams.get('pageToken'), 'PAGE_2');
});

test('collects three pages and never lists accounts or locations', async () => {
  const mock = fakeGoogle([page([review('a')], 3, '2'), page([review('b')], 3, '3'), page([review('c')], 3)]);
  assert.equal((await fetchGoogleReviews(profile, credentials, mock)).reviews.length, 3);
  assert.equal(mock.calls.length, 4);
  assert.ok(mock.calls.slice(1).every(call => new URL(call.url).pathname.endsWith('/reviews')));
});

test('accepts a genuine empty profile', async () => {
  const mock = fakeGoogle([{ totalReviewCount: 0 }]);
  assert.deepEqual(await fetchGoogleReviews(profile, credentials, mock), { reviews: [], averageRating: null, totalReviewCount: 0 });
});

test('rejects injection in IDs and unsafe Google links before contacting Google', async () => {
  assert.throws(() => validateProfile({ accountId: '../other', locationId: '456' }), /invalid_profile/);
  assert.throws(() => validateProfile({ accountId: '123', locationId: '456?x=1' }), /invalid_profile/);
  for (const value of ['javascript:alert(1)', 'http://google.com', 'https://google.com.attacker.test', 'https://attacker@google.com']) {
    assert.throws(() => validateGoogleUrl(value), /invalid_google_url/);
  }
  await assert.rejects(fetchGoogleReviews(profile, { ...credentials, refreshToken: '' }), /missing_google_credentials/);
});

test('aborts cycles and page limits rather than publish partial results', async () => {
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([
    page([review('a')], 2, 'SAME'), page([review('b')], 2, 'SAME'),
  ])), /invalid_google_pagination/);
  await assert.rejects(fetchGoogleReviews(profile, credentials, { ...fakeGoogle([page([review('a')], 2, '2')]), maxPages: 1 }), /google_page_limit/);
});

test('rejects inconsistent or malformed snapshots', async () => {
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([page([review('a')], 2)])), /google_dataset_changed/);
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([
    page([review('a')], 2, '2'), page([review('b')], 3),
  ])), /google_dataset_changed/);
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([
    page([{ ...review('a'), starRating: 'UNKNOWN' }]),
  ])), /invalid_google_response/);
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([
    page([{ ...review('a'), reviewer: { displayName: {} } }]),
  ])), /invalid_google_response/);
});

test('retries transient failures and honors Retry-After, but refuses excessive waits', async () => {
  const sleeps = [];
  const mock = fakeGoogle([json({}, 429, { 'retry-after': '2' }), page([review('a')])]);
  await fetchGoogleReviews(profile, credentials, { ...mock, sleep: async ms => sleeps.push(ms) });
  assert.deepEqual(sleeps, [2000]);
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([json({}, 429, { 'retry-after': '60' })])), /google_rate_limited/);
});

test('denied access and request deadlines fail without disclosing tokens or upstream bodies', async () => {
  await assert.rejects(fetchGoogleReviews(profile, credentials, fakeGoogle([json({ error: 'SECRET' }, 403)])), error => {
    assert.equal(error.message, 'google_access_denied'); return true;
  });
  await assert.rejects(fetchGoogleReviews(profile, credentials, { timeoutMs: 5,
    fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('REFRESH')), { once: true })),
  }), /google_unavailable/);
});

function serviceFixture(overrides = {}) {
  let clock = Date.parse(date);
  let result = { reviews: [review('a'), review('b')], totalReviewCount: 2, averageRating: 5 };
  let fail = false;
  const cache = createMemoryCache(() => clock);
  const service = createReviewsService({ ...profile, googleUrl, credentials, cache, now: () => clock,
    collect: async () => { if (fail) throw new Error('failure'); return result; }, ...overrides });
  return { service, cache, setClock: value => { clock = value; }, setResult: value => { result = value; }, setFail: () => { fail = true; } };
}

test('successful full replacement updates edits, removes deleted reviews, and clears a now-empty profile', async () => {
  const fixture = serviceFixture();
  await fixture.service.refresh();
  fixture.setResult({ reviews: [review('b', 'Edited')], totalReviewCount: 1, averageRating: 5 });
  await fixture.service.refresh();
  const snapshot = await fixture.service.read();
  assert.deepEqual(snapshot.reviews.map(r => r.id), ['b']);
  assert.equal(snapshot.reviews[0].comment, 'Edited');
  fixture.setResult({ reviews: [], totalReviewCount: 0, averageRating: null });
  await fixture.service.refresh();
  assert.equal((await fixture.service.read()).totalReviewCount, 0);
});

test('failed sync retains last complete snapshot only until the original expiry', async () => {
  const fixture = serviceFixture();
  await fixture.service.refresh();
  fixture.setFail();
  await assert.rejects(fixture.service.refresh());
  assert.equal((await fixture.service.read()).reviews.length, 2);
  fixture.setClock(Date.parse(date) + 86400000);
  await assert.rejects(fixture.service.read(), /reviews_not_ready/);
});

test('separates profiles and namespaces, limits stored reviews, preserves Google average and anonymous attribution', async () => {
  const fixture = serviceFixture({ displayLimit: 1 });
  fixture.setResult({ reviews: [{ ...review('a'), reviewer: { isAnonymous: true, displayName: 'Hidden' } }, review('b')], totalReviewCount: 2, averageRating: 4.7 });
  await fixture.service.refresh();
  const data = await fixture.service.read();
  assert.equal(data.reviews.length, 1);
  assert.equal(data.totalReviewCount, 2);
  assert.equal(data.averageRating, 4.7);
  assert.equal(data.reviews[0].author, 'Utilizador do Google');
  assert.equal(JSON.stringify(data).includes('SECRET'), false);
  assert.equal(Object.hasOwn(data, 'accountId'), false);
  const other = createReviewsService({ ...profile, locationId: '789', credentials, googleUrl, cache: fixture.cache });
  await assert.rejects(other.read(), /reviews_not_ready/);
  const otherNamespace = createReviewsService({ ...profile, namespace: 'another', credentials, googleUrl, cache: fixture.cache });
  await assert.rejects(otherNamespace.read(), /reviews_not_ready/);
  await fixture.service.purge();
  await assert.rejects(fixture.service.read(), /reviews_not_ready/);
});

test('prevents concurrent refreshes for the same profile', async () => {
  let complete;
  const fixture = serviceFixture({ collect: () => new Promise(resolve => { complete = resolve; }) });
  const first = fixture.service.refresh();
  await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(fixture.service.refresh(), /reviews_sync_busy/);
  complete({ reviews: [], averageRating: null, totalReviewCount: 0 });
  await first;
});

test('Redis commands include TTL, conditional locks and ownership-safe release; errors are generic', async () => {
  const commands = [];
  const cache = createRedisCache({ url: 'https://cache.example', token: 'CACHE_SECRET', fetchImpl: async (_url, init) => {
    const args = JSON.parse(init.body); commands.push(args);
    return json({ result: args[0] === 'SET' ? 'OK' : args[0] === 'GET' ? '{"ok":true}' : 1 });
  } });
  await cache.set('key', { ok: true }, 3600);
  assert.deepEqual(commands[0], ['SET', 'key', '{"ok":true}', 'EX', 3600]);
  assert.deepEqual(await cache.get('key'), { ok: true });
  assert.equal(await cache.acquire('lock', 'owner', 120), true);
  assert.deepEqual(commands[2], ['SET', 'lock', 'owner', 'NX', 'EX', 120]);
  await cache.release('lock', 'owner');
  assert.equal(commands[3][0], 'EVAL');
  assert.match(commands[3][1], /ARGV\[1\]/);
  const broken = createRedisCache({ url: 'https://cache.example', token: 'SECRET', fetchImpl: async () => json({ error: 'SECRET' }, 500) });
  await assert.rejects(broken.get('key'), /reviews_cache_unavailable/);
});

test('HTTP reads never refresh and reject client-supplied IDs; refresh and purge require strong Bearer secret', async () => {
  const fixture = serviceFixture();
  const env = { CRON_SECRET: 'x'.repeat(40) };
  const read = createReviewsHandler({ getService: () => fixture.service });
  assert.equal((await read(new Request('https://site/api/google-reviews'))).status, 503);
  assert.equal((await read(new Request('https://site/api/google-reviews?accountId=other'))).status, 400);
  assert.equal((await read(new Request('https://site/api/google-reviews', { method: 'POST' }))).status, 405);
  const refresh = createReviewsHandler({ mode: 'refresh', env, getService: () => fixture.service });
  assert.equal((await refresh(new Request('https://site/api/refresh'))).status, 401);
  const request = method => new Request('https://site/api/refresh', { method, headers: { authorization: `Bearer ${env.CRON_SECRET}` } });
  assert.equal((await refresh(request('POST'))).status, 200);
  const response = await read(new Request('https://site/api/google-reviews'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).reviews.length, 2);
  assert.equal((await refresh(request('DELETE'))).status, 200);
  assert.equal((await read(new Request('https://site/api/google-reviews'))).status, 503);
});

test('HTTP failure response excludes internal errors and Vercel adapter preserves method and response', async () => {
  const handler = createVercelReviewsHandler({ getService: () => { throw new Error('SECRET'); } });
  const headers = {};
  const res = { statusCode: 0, setHeader: (key, value) => { headers[key] = value; }, end: body => { res.body = body; } };
  await handler({ method: 'GET', url: '/api/google-reviews', headers: {} }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body, '{"error":"reviews_unavailable"}');
  assert.equal(headers['cache-control'], 'no-store');
});

test('invalid server configuration fails closed; no implicit in-memory production cache', () => {
  assert.throws(() => serviceFromEnv({ ...profile }), /missing_reviews_cache/);
  assert.throws(() => createReviewsService({ ...profile, googleUrl, credentials, cache: createMemoryCache(), cacheTtlSeconds: 31 * 86400 }), /invalid_reviews_config/);
});
