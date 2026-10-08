export class ReviewsError extends Error { code: string; constructor(code: string); }
export interface Profile { accountId: string; locationId: string; }
export interface Credentials { clientId: string; clientSecret: string; refreshToken: string; }
export interface RawReview {
  reviewId: string; starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  reviewer?: { displayName?: string; isAnonymous?: boolean };
  comment?: string; createTime: string; updateTime: string;
}
export interface Collection { reviews: RawReview[]; averageRating: number | null; totalReviewCount: number; }
export function validateProfile(profile: Profile): Profile;
export function validateGoogleUrl(value: string): string;
export function fetchGoogleReviews(profile: Profile, credentials: Credentials,
  options?: { fetchImpl?: typeof fetch; timeoutMs?: number; maxPages?: number; sleep?: (ms: number, signal: AbortSignal) => Promise<void> }): Promise<Collection>;
