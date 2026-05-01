import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export function PromoBanner() {
  return (
    <section className="py-16 px-4" style={{ background: '#221f1b', borderTop: '1px solid rgba(200,169,110,0.1)', borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="section-subtitle mb-2">Limited Time Offer</p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#f0e4ce' }}
          >
            🚚 Free Delivery on Orders Above{' '}
            <span style={{ color: '#c8a96e' }}>Rs 2,000</span>
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#7a6a54' }}>
            Nationwide delivery in 3–7 business days. Cash on Delivery available.
          </p>
        </div>
        <Link href="/shop" className="btn-primary whitespace-nowrap flex items-center gap-2 px-8 py-4">
          Shop Now <FiArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
