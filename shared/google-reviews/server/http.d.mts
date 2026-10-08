import type { ReviewsService } from './service.mjs';
export interface HandlerOptions { mode?: 'read' | 'refresh'; env?: Record<string, string | undefined>; getService?: () => ReviewsService; }
export function serviceFromEnv(env: Record<string, string | undefined>): ReviewsService;
export function createReviewsHandler(options?: HandlerOptions): (request: Request) => Promise<Response>;
export function createVercelReviewsHandler(options?: HandlerOptions):
  (req: { method?: string; url?: string; headers: Record<string, string | string[] | undefined> },
   res: { statusCode: number; setHeader(key: string, value: string): unknown; end(body: string): unknown }) => Promise<void>;
