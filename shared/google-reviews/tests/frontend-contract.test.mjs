import test from 'node:test';
import assert from 'node:assert/strict';
import { isReviewsData } from '../react/contract.mjs';

const data = () => ({ source: 'Google', googleUrl: 'https://share.google/example', fetchedAt: new Date().toISOString(),
  averageRating: 4.7, totalReviewCount: 22, reviews: [{ id: '1', author: 'Author', rating: 3,
    comment: '<img onerror="evil()">\nFull text', createTime: new Date().toISOString(), updateTime: new Date().toISOString() }] });

test('public contract accepts selected cards without recomputing full-profile average', () => {
  assert.equal(isReviewsData(data()), true);
  assert.equal(isReviewsData({ ...data(), reviews: [], totalReviewCount: 0, averageRating: null }), true);
});
test('rejects expired data, fake aggregate, malformed authors and unsafe source URLs', () => {
  assert.equal(isReviewsData({ ...data(), fetchedAt: new Date(Date.now() - 86400001).toISOString() }), false);
  assert.equal(isReviewsData({ ...data(), averageRating: 7 }), false);
  assert.equal(isReviewsData({ ...data(), googleUrl: 'javascript:alert(1)' }), false);
  assert.equal(isReviewsData({ ...data(), reviews: [{ ...data().reviews[0], author: {} }] }), false);
});
