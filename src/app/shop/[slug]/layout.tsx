import type { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    await dbConnect();
    const product = await Product.findOne({ slug: params.slug }).lean();
    if (!product) return { title: 'Product Not Found' };

    return {
      title: product.name,
      description: product.shortDescription?.substring(0, 160) || product.description?.substring(0, 160),
      openGraph: {
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch (error) {
    return { title: 'Product' };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
