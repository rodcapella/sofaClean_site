import { timingSafeEqual } from 'node:crypto';
import { createRedisCache } from './cache.mjs';
import { createReviewsService } from './service.mjs';

function authorized(header, secret) {
  if (!secret || secret.length < 32 || typeof header !== 'string') return false;
  const actual = Buffer.from(header); const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function serviceFromEnv(env) {
  return createReviewsService({
    accountId: env.GOOGLE_REVIEWS_ACCOUNT_ID, locationId: env.GOOGLE_REVIEWS_LOCATION_ID,
    googleUrl: env.GOOGLE_REVIEWS_URL, namespace: env.GOOGLE_REVIEWS_NAMESPACE || 'default',
    cache: createRedisCache({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
    credentials: { clientId: env.GOOGLE_REVIEWS_CLIENT_ID, clientSecret: env.GOOGLE_REVIEWS_CLIENT_SECRET, refreshToken: env.GOOGLE_REVIEWS_REFRESH_TOKEN },
  });
}

/** Web Request/Response adapter. Public reads never contact Google or accept profile IDs. */
export function createReviewsHandler({ mode = 'read', env = process.env, getService = () => serviceFromEnv(env) } = {}) {
  if (!['read', 'refresh'].includes(mode)) throw new Error('invalid_handler_mode');
  return async request => {
    const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
      status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store',
        'x-content-type-options': 'nosniff', ...headers },
    });
    const allowed = mode === 'read' ? ['GET'] : ['GET', 'POST', 'DELETE'];
    if (!allowed.includes(request.method)) return json({ error: 'method_not_allowed' }, 405, { allow: allowed.join(', ') });
    if (mode === 'refresh' && !authorized(request.headers.get('authorization'), env.CRON_SECRET)) return json({ error: 'unauthorized' }, 401);
    if ([...new URL(request.url).searchParams].length) return json({ error: 'query_not_allowed' }, 400);
    try {
      const service = getService();
      if (mode === 'refresh' && request.method === 'DELETE') { await service.purge(); return json({ ok: true }); }
      if (mode === 'refresh') return json({ ok: true, ...await service.refresh() });
      // No CDN persistence: managed Redis is the only cache and expires after 24h.
      return json(await service.read());
    } catch (error) {
      return json({ error: error?.code === 'reviews_sync_busy' ? 'reviews_sync_busy' : 'reviews_unavailable' },
        error?.code === 'reviews_sync_busy' ? 409 : 503, { 'retry-after': '60' });
    }
  };
}

/** Vercel Node adapter, compatible with the existing Vite sites' api/*.ts functions. */
export function createVercelReviewsHandler(options) {
  const handler = createReviewsHandler(options);
  return async (req, res) => {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers ?? {})) {
      if (typeof value === 'string') headers.set(key, value);
    }
    const response = await handler(new Request(new URL(req.url || '/', 'https://reviews.local'), { method: req.method || 'GET', headers }));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };
}
