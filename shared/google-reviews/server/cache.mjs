import { ReviewsError } from './google-client.mjs';

/** REST adapter: shared cache across Vercel functions; never fall back to RAM in production. */
export function createRedisCache({ url, token, fetchImpl = fetch }) {
  let endpoint;
  try { endpoint = new URL(url); if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error(); }
  catch { throw new ReviewsError('missing_reviews_cache'); }
  if (!token) throw new ReviewsError('missing_reviews_cache');
  async function command(args) {
    try {
      const response = await fetchImpl(endpoint, { method: 'POST', redirect: 'error',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify(args), signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error();
      const body = await response.json();
      if (body.error || !Object.hasOwn(body, 'result')) throw new Error();
      return body.result;
    } catch { throw new ReviewsError('reviews_cache_unavailable'); }
  }
  return {
    async get(key) { const result = await command(['GET', key]);
      if (result === null) return null;
      try { return JSON.parse(result); } catch { throw new ReviewsError('invalid_reviews_cache'); } },
    async set(key, value, ttl) { if (await command(['SET', key, JSON.stringify(value), 'EX', ttl]) !== 'OK') throw new ReviewsError('reviews_cache_unavailable'); },
    async acquire(key, owner, ttl) { return await command(['SET', key, owner, 'NX', 'EX', ttl]) === 'OK'; },
    async release(key, owner) { await command(['EVAL', "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", '1', key, owner]); },
    async remove(key) { await command(['DEL', key]); },
  };
}

/** Development/tests only. Expiration is enforced on every read. */
export function createMemoryCache(now = Date.now) {
  const data = new Map();
  return {
    async get(key) { const item = data.get(key); if (!item || item.expiresAt <= now()) { data.delete(key); return null; } return structuredClone(item.value); },
    async set(key, value, ttl) { data.set(key, { value: structuredClone(value), expiresAt: now() + ttl * 1000 }); },
    async acquire(key, owner, ttl) { const item = data.get(key); if (item && item.expiresAt > now()) return false;
      data.set(key, { value: owner, expiresAt: now() + ttl * 1000 }); return true; },
    async release(key, owner) { if (await this.get(key) === owner) data.delete(key); },
    async remove(key) { data.delete(key); },
  };
}
