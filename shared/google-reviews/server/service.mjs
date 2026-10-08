import { fetchGoogleReviews, ReviewsError, validateGoogleUrl, validateProfile } from './google-client.mjs';

export function createReviewsService({ accountId, locationId, googleUrl, cache, credentials,
  namespace = 'default', cacheTtlSeconds = 86400, displayLimit = 12, now = Date.now, collect = fetchGoogleReviews }) {
  const profile = validateProfile({ accountId, locationId });
  const url = validateGoogleUrl(googleUrl);
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(namespace) || !Number.isInteger(cacheTtlSeconds) || cacheTtlSeconds < 300 || cacheTtlSeconds > 86400 ||
      !Number.isInteger(displayLimit) || displayLimit < 1 || displayLimit > 20) throw new ReviewsError('invalid_reviews_config');
  const key = `google-reviews:v1:${namespace}:${profile.accountId}:${profile.locationId}`;
  const lockKey = `${key}:lock`;
  return {
    async read() {
      const snapshot = await cache.get(key);
      if (!snapshot || snapshot.expiresAt <= now()) throw new ReviewsError('reviews_not_ready');
      // Expose only the website contract; exclude profile identifiers, cache metadata and credentials.
      return { source: 'Google', googleUrl: url, fetchedAt: snapshot.fetchedAt,
        averageRating: snapshot.averageRating, totalReviewCount: snapshot.totalReviewCount,
        reviews: snapshot.reviews };
    },
    async refresh() {
      const owner = crypto.randomUUID();
      if (!await cache.acquire(lockKey, owner, 120)) throw new ReviewsError('reviews_sync_busy');
      try {
        const result = await collect(profile, credentials);
        const fetchedAt = new Date(now()).toISOString();
        // Keep a limited temporary subset, full original text, and Google's aggregate (never recompute a selected average).
        const snapshot = { fetchedAt, expiresAt: now() + cacheTtlSeconds * 1000,
          averageRating: result.averageRating, totalReviewCount: result.totalReviewCount,
          reviews: result.reviews.slice(0, displayLimit).map(review => ({
            id: review.reviewId, author: review.reviewer?.isAnonymous ? 'Utilizador do Google' : review.reviewer?.displayName || 'Utilizador do Google',
            rating: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'].indexOf(review.starRating) + 1,
            comment: review.comment ?? '', createTime: review.createTime, updateTime: review.updateTime,
          })) };
        // Full replacement only AFTER every page succeeds; removed reviews disappear here.
        await cache.set(key, snapshot, cacheTtlSeconds);
        return { fetchedAt, totalReviewCount: result.totalReviewCount, displayedReviewCount: snapshot.reviews.length };
      } finally { await cache.release(lockKey, owner); }
    },
    async purge() { await cache.remove(key); },
  };
}
