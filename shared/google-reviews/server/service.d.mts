import type { GoogleReviewsData } from '../types';
import type { Cache } from './cache.mjs';
import type { Collection, Credentials, Profile } from './google-client.mjs';
export interface ReviewsService {
  read(): Promise<GoogleReviewsData>;
  refresh(): Promise<{ fetchedAt: string; totalReviewCount: number; displayedReviewCount: number }>;
  purge(): Promise<void>;
}
export function createReviewsService(options: Profile & {
  googleUrl: string; cache: Cache; credentials: Credentials; namespace?: string;
  cacheTtlSeconds?: number; displayLimit?: number; now?: () => number;
  collect?: (profile: Profile, credentials: Credentials) => Promise<Collection>;
}): ReviewsService;
