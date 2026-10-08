// Copy into app/api/google-reviews/route.ts and adjust import to your shared module.
import { createReviewsHandler } from '../../../shared/google-reviews/server/http.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = createReviewsHandler();
