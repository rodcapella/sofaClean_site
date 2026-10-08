// Copy into app/api/google-reviews-refresh/route.ts and adjust import.
import { createReviewsHandler } from '../../../shared/google-reviews/server/http.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = createReviewsHandler({ mode: 'refresh' });
export const POST = GET;
export const DELETE = GET;
