'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#221f1b',
            color: '#f0e4ce',
            border: '1px solid rgba(200, 169, 110, 0.2)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#c8a96e', secondary: '#0f0e0c' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
          duration: 3000,
        }}
      />
    </QueryClientProvider>
  );
}
