const REVIEWS = [
  {
    name: 'Ayesha Siddiqui',
    city: 'Lahore',
    rating: 5,
    comment:
      'Absolutely love my KAARVAN handbag! The quality is exceptional and it arrived in just 3 days. Will definitely be ordering again!',
    avatar: 'AS',
  },
  {
    name: 'Muhammad Imran',
    city: 'Karachi',
    rating: 5,
    comment:
      'Ordered a laptop bag and the stitching and material quality is top-notch. Great value for money. COD made it super easy.',
    avatar: 'MI',
  },
  {
    name: 'Fatima Khan',
    city: 'Islamabad',
    rating: 4,
    comment:
      'Beautiful backpack, exactly as shown in pictures. Customer service was very helpful too. Highly recommend KAARVAN!',
    avatar: 'FK',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Customer Love</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < r.rating ? '#c8a96e' : '#3a3228', fontSize: '16px' }}>
                    ★
                  </span>
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: '#a08060' }}>
                "{r.comment}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: '#c8a96e', color: '#0f0e0c' }}
                >
                  {r.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#f0e4ce' }}>
                    {r.name}
                  </p>
                  <p className="text-xs" style={{ color: '#7a6a54' }}>
                    {r.city}, Pakistan
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
