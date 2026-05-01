import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0a0907 0%, #1a1512 40%, #221a14 70%, #0f0e0c 100%)',
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #c8a96e 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #c8a96e 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <div className="animate-fadeIn">
          <p className="section-subtitle mb-4">Pakistan's Premier Bag Destination</p>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-6"
          >
            <span style={{ color: '#f0e4ce' }}>Carry What</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #c8a96e, #e8c98a, #c8a96e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Matters
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#7a6a54' }}>
            Discover our collection of handcrafted premium bags — from everyday handbags to travel essentials.
            Free delivery on orders above Rs 2,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
              Shop Collection <FiArrowRight size={18} />
            </Link>
            <Link href="/shop?filter=new" className="btn-outline text-base px-8 py-4">
              New Arrivals
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { num: '5000+', label: 'Happy Customers' },
              { num: '50+', label: 'Bag Styles' },
              { num: '3-7 Days', label: 'Nationwide Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', color: '#c8a96e' }}
                  className="font-bold"
                >
                  {stat.num}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#7a6a54' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, #0f0e0c)' }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>Scroll</span>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, #c8a96e, transparent)' }} />
      </div>
    </section>
  );
}
