'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ThemePreview() {
  const pathname = usePathname();
  useEffect(() => {
    const syncTheme = () => {
      if (new URLSearchParams(window.location.search).get('tema') === 'escuro') {
        document.body.dataset.previewTheme = 'dark';
      } else {
        delete document.body.dataset.previewTheme;
      }
    };
    const keepTheme = (event: MouseEvent) => {
      if (document.body.dataset.previewTheme !== 'dark') return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || url.searchParams.has('tema')) return;
      url.searchParams.set('tema', 'escuro');
      anchor.href = url.href;
    };
    syncTheme();
    window.addEventListener('popstate', syncTheme);
    document.addEventListener('click', keepTheme, true);
    return () => {
      window.removeEventListener('popstate', syncTheme);
      document.removeEventListener('click', keepTheme, true);
    };
  }, [pathname]);
  return null;
}
