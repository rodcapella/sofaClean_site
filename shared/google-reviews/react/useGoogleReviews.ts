'use client';
import { useEffect, useState } from 'react';
import type { GoogleReviewsData } from '../types';
import { isReviewsData } from './contract.mjs';
export { isReviewsData } from './contract.mjs';

export type ReviewsState = { status: 'idle' | 'loading' | 'ready' | 'unavailable'; data: GoogleReviewsData | null };

export function useGoogleReviews({ endpoint = '/api/google-reviews', enabled = true }: { endpoint?: string; enabled?: boolean } = {}): ReviewsState {
  const [state, setState] = useState<ReviewsState>({ status: 'idle', data: null });
  useEffect(() => {
    if (!enabled) { setState({ status: 'idle', data: null }); return; }
    const controller = new AbortController();
    let active = true;
    let expiration: ReturnType<typeof setTimeout> | undefined;
    const timeout = setTimeout(() => controller.abort(), 8000);
    setState({ status: 'loading', data: null });
    void (async () => {
      try {
        // Same-origin API only. The browser never sends Google IDs or secrets.
        const url = new URL(endpoint, window.location.origin);
        if (url.origin !== window.location.origin) throw new Error('invalid_endpoint');
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
        if (!response.ok) throw new Error('unavailable');
        const data: unknown = await response.json();
        if (!isReviewsData(data)) throw new Error('invalid_response');
        if (active) {
          setState({ status: 'ready', data });
          expiration = setTimeout(() => setState({ status: 'unavailable', data: null }),
            Math.max(0, Date.parse(data.fetchedAt) + 86400000 - Date.now()));
        }
      } catch { if (active) setState({ status: 'unavailable', data: null }); }
      finally { clearTimeout(timeout); }
    })();
    return () => { active = false; controller.abort(); clearTimeout(timeout); clearTimeout(expiration); };
  }, [endpoint, enabled]);
  return state;
}
