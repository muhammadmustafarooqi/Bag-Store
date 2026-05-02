import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

export function PromoBanner() {
  return (
    <section className="py-16 px-4" style={{ background: '#1a1815', borderTop: '1px solid rgba(200,169,110,0.1)', borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full" style={{ background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.15)' }}>
            <MdOutlineLocalShipping className="text-3xl" style={{ color: '#c8a96e' }} />
          </div>
          <div>
            <p className="section-subtitle mb-2 text-xs uppercase tracking-[0.2em]" style={{ color: '#c8a96e' }}>Limited Time Offer</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#f0e4ce' }}
              className="flex items-center gap-2 leading-tight"
            >
              <span className="sm:hidden text-2xl" style={{ color: '#c8a96e' }}><MdOutlineLocalShipping /></span>
              <span>
                Free Delivery on Orders Above{' '}
                <span style={{ color: '#c8a96e' }}>Rs 2,000</span>
              </span>
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#7a6a54' }}>
              Nationwide delivery in 3–7 business days. Cash on Delivery available.
            </p>
          </div>
        </div>
        <Link href="/shop" className="btn-primary whitespace-nowrap flex items-center gap-2 px-8 py-4">
          Shop Now <FiArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
