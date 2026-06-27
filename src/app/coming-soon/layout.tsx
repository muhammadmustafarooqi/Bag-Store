import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
