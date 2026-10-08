// Server only. No credentials or Google tokens belong in the browser bundle.
export class ReviewsError extends Error {
  constructor(code) { super(code); this.name = 'ReviewsError'; this.code = code; }
}

export function validateProfile({ accountId, locationId }) {
  if (!/^\d{1,40}$/.test(accountId ?? '') || !/^\d{1,40}$/.test(locationId ?? '')) {
    throw new ReviewsError('invalid_profile');
  }
  return { accountId: String(accountId), locationId: String(locationId) };
}

export function validateGoogleUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password ||
        !['google.com', 'www.google.com', 'maps.google.com', 'share.google', 'maps.app.goo.gl', 'g.page'].includes(url.hostname)) throw new Error();
    return url.href;
  } catch { throw new ReviewsError('invalid_google_url'); }
}

async function googleJson(url, init, { fetchImpl, signal, sleep }) {
  for (let attempt = 0; attempt < 4; attempt++) {
    let response;
    try { response = await fetchImpl(url, { ...init, signal, redirect: 'error' }); }
    catch { throw new ReviewsError('google_unavailable'); }
    if (response.ok) {
      try { return await response.json(); } catch { throw new ReviewsError('invalid_google_response'); }
    }
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
      throw new ReviewsError(response.status === 401 || response.status === 403 ? 'google_access_denied' : 'google_unavailable');
    }
    const retryAfter = response.headers.get('retry-after');
    const numeric = Number(retryAfter);
    const wait = retryAfter && Number.isFinite(numeric) ? numeric * 1000 :
      retryAfter && Number.isFinite(Date.parse(retryAfter)) ? Math.max(0, Date.parse(retryAfter) - Date.now()) : 500 * 2 ** attempt;
    // Never retry earlier than Google's requested time; refuse waits above our request budget.
    if (wait > 8000) throw new ReviewsError('google_rate_limited');
    await sleep(wait, signal);
  }
}

function pause(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new ReviewsError('google_unavailable'));
    const onAbort = () => { clearTimeout(timer); reject(new ReviewsError('google_unavailable')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve(); }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/** Collects EVERY page for exactly one configured profile. Nothing is stored here. */
export async function fetchGoogleReviews(profile, credentials, options = {}) {
  const { accountId, locationId } = validateProfile(profile);
  const { clientId, clientSecret, refreshToken } = credentials;
  if (![clientId, clientSecret, refreshToken].every(v => typeof v === 'string' && v.trim())) throw new ReviewsError('missing_google_credentials');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 25000);
  const context = { fetchImpl: options.fetchImpl ?? fetch, signal: controller.signal, sleep: options.sleep ?? pause };
  try {
    const token = await googleJson('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
    }, context);
    if (typeof token.access_token !== 'string' || !token.access_token) throw new ReviewsError('invalid_google_response');
    const reviews = new Map();
    const pageTokens = new Set();
    let pageToken;
    let totalReviewCount;
    let averageRating;
    for (let pageNumber = 0; pageNumber < (options.maxPages ?? 1000); pageNumber++) {
      const url = new URL(`https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`);
      url.searchParams.set('pageSize', '50');
      url.searchParams.set('orderBy', 'updateTime desc');
      if (pageToken) url.searchParams.set('pageToken', pageToken);
      const page = await googleJson(url, { headers: { authorization: `Bearer ${token.access_token}` } }, context);
      if (!Number.isInteger(page.totalReviewCount) || page.totalReviewCount < 0 ||
          (page.totalReviewCount > 0 && (!Number.isFinite(page.averageRating) || page.averageRating < 1 || page.averageRating > 5)) ||
          (page.reviews !== undefined && !Array.isArray(page.reviews))) throw new ReviewsError('invalid_google_response');
      if (pageNumber === 0) { totalReviewCount = page.totalReviewCount; averageRating = page.totalReviewCount ? page.averageRating : null; }
      // A changing dataset must not overwrite a complete cache with an inconsistent snapshot.
      if (page.totalReviewCount !== totalReviewCount || (totalReviewCount > 0 && page.averageRating !== averageRating)) throw new ReviewsError('google_dataset_changed');
      for (const review of page.reviews ?? []) {
        if (!review || typeof review.reviewId !== 'string' || !review.reviewId ||
            !['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'].includes(review.starRating) ||
            !Number.isFinite(Date.parse(review.updateTime)) || !Number.isFinite(Date.parse(review.createTime)) ||
            (review.comment !== undefined && typeof review.comment !== 'string')) throw new ReviewsError('invalid_google_response');
        if (review.reviewer && (typeof review.reviewer !== 'object' ||
            (review.reviewer.displayName !== undefined && typeof review.reviewer.displayName !== 'string'))) throw new ReviewsError('invalid_google_response');
        reviews.set(review.reviewId, review);
      }
      pageToken = page.nextPageToken;
      if (!pageToken) {
        if (reviews.size !== totalReviewCount) throw new ReviewsError('google_dataset_changed');
        return { reviews: [...reviews.values()], averageRating, totalReviewCount };
      }
      if (typeof pageToken !== 'string' || pageTokens.has(pageToken)) throw new ReviewsError('invalid_google_pagination');
      pageTokens.add(pageToken);
    }
    throw new ReviewsError('google_page_limit');
  } finally { clearTimeout(timer); }
}
