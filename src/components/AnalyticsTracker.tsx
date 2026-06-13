'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cartItems = useCartStore((state) => state.items);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Exclude admin panel and API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Retrieve or initialize session identifier
    let sessionId = sessionStorage.getItem('allinone_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      sessionStorage.setItem('allinone_session_id', sessionId);
    }

    // Evaluate current milestones
    const hasCart = cartItems.length > 0;
    const hasCheckout = pathname.startsWith('/checkout');
    const hasOrdered = pathname.startsWith('/order-success');

    // Debounce to prevent rapid multiple postings
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      const payload = {
        sessionId,
        path: fullPath,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        hasCart,
        hasCheckout,
        hasOrdered,
      };

      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error('Analytics tracking transmission failed:', err);
      });
    }, 1000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [pathname, searchParams, cartItems]);

  return null;
}
