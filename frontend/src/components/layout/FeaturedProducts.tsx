'use client';
import Link from 'next/link';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';

export function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts();
  const products = data?.data || [];

  return (
    <section className="py-24 px-4" style={{ background: '#1a1815' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="section-subtitle mb-3">Curated Selection</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link href="/shop" className="btn-outline text-sm px-6 py-2 self-start md:self-auto">
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center py-16" style={{ color: '#7a6a54' }}>No featured products yet.</p>
        )}
      </div>
    </section>
  );
}
