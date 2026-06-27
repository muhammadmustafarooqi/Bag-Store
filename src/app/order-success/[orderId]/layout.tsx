import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { orderId: string } }): Promise<Metadata> {
  return {
    title: `Order Success - ${params.orderId}`,
    description: `Thank you for your order! Your order ID is ${params.orderId}.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
