const FEATURES = [
  {
    icon: '✦',
    title: '100% Original Products',
    desc: 'Every bag is genuine and quality-checked before shipping.',
  },
  {
    icon: '↩',
    title: 'Easy 7-Day Returns',
    desc: 'Not satisfied? Return within 7 days, no questions asked.',
  },
  {
    icon: '💵',
    title: 'Cash on Delivery',
    desc: 'Pay when you receive. Safe, convenient, trusted by thousands.',
  },
  {
    icon: '🚚',
    title: 'Fast Nationwide Shipping',
    desc: 'Delivery to all cities in Pakistan in 3–7 business days.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 px-4" style={{ background: '#1a1815' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Our Promise</p>
          <h2 className="section-title">Why Choose KAARVAN?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="text-center p-8 transition-all duration-300 hover:-translate-y-2"
              style={{ background: '#221f1b', border: '1px solid rgba(200,169,110,0.15)' }}
            >
              <div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl rounded-full"
                style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)' }}
              >
                {f.icon}
              </div>
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#f0e4ce' }}
                className="font-semibold mb-3"
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#7a6a54' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
