export function isReviewsData(value) {
  if (!value || typeof value !== 'object') return false;
  const data = value;
  let url;
  try { url = new URL(data.googleUrl); } catch { return false; }
  return data.source === 'Google' && url.protocol === 'https:' && !url.username && !url.password &&
    ['google.com', 'www.google.com', 'maps.google.com', 'share.google', 'maps.app.goo.gl', 'g.page'].includes(url.hostname) &&
    Number.isFinite(Date.parse(data.fetchedAt)) && Date.parse(data.fetchedAt) <= Date.now() + 60000 &&
    Date.now() - Date.parse(data.fetchedAt) < 86400000 &&
    Number.isInteger(data.totalReviewCount) && data.totalReviewCount >= 0 &&
    (data.totalReviewCount === 0 ? data.averageRating === null :
      typeof data.averageRating === 'number' && data.averageRating >= 1 && data.averageRating <= 5) &&
    Array.isArray(data.reviews) && data.reviews.length <= 20 && data.reviews.length <= data.totalReviewCount &&
    data.reviews.every(review => review && typeof review.id === 'string' && typeof review.author === 'string' &&
      typeof review.comment === 'string' && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 &&
      Number.isFinite(Date.parse(review.createTime)) && Number.isFinite(Date.parse(review.updateTime)));
}
