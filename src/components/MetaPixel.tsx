'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const PIXEL_ID = '1005576675765836';

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fb = (window as any).fbq;
    if (!fb) {
      const n: any = ((window as any).fbq = function (...args: any[]) {
        n.callMethod
          ? n.callMethod.apply(n, args)
          : n.queue.push(args);
      });
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = document.getElementsByTagName('script')[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        document.head.appendChild(t);
      }

      (window as any).fbq('init', PIXEL_ID);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      // Exclude admin panel views if wanted, but follow standard PageView trigger
      if (!pathname?.startsWith('/admin') && !pathname?.startsWith('/api')) {
        (window as any).fbq('track', 'PageView');
      }
    }
  }, [pathname, searchParams]);

  return null;
}
