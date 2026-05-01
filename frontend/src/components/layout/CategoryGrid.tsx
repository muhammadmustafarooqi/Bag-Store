import Link from 'next/link';

const CATEGORIES = [
  { name: 'Handbags', slug: 'handbag', emoji: '👜', desc: 'Everyday elegance' },
  { name: 'Backpacks', slug: 'backpack', emoji: '🎒', desc: 'Urban adventures' },
  { name: 'Laptop Bags', slug: 'laptop bag', emoji: '💼', desc: 'Professional style' },
  { name: 'Tote Bags', slug: 'tote', emoji: '🛍️', desc: 'Spacious & stylish' },
  { name: 'Travel Bags', slug: 'travel bag', emoji: '✈️', desc: 'Journey in style' },
  { name: 'Clutches', slug: 'clutch', emoji: '✨', desc: 'Evening glam' },
  { name: 'Wallets', slug: 'wallet', emoji: '👛', desc: 'Smart & slim' },
  { name: 'School Bags', slug: 'school bag', emoji: '🎓', desc: 'For the students' },
];

export function CategoryGrid() {
  return (
    <section className="py-24 px-4" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Browse Categories</p>
          <h2 className="section-title">Shop By Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.slug)}`}>
              <div
                className="group relative overflow-hidden p-6 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
                style={{
                  background: '#1a1815',
                  border: '1px solid rgba(200,169,110,0.15)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,169,110,0.5)';
                  (e.currentTarget as HTMLDivElement).style.background = '#221f1b';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,169,110,0.15)';
                  (e.currentTarget as HTMLDivElement).style.background = '#1a1815';
                }}
              >
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {cat.emoji}
                </div>
                <h3
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce', fontSize: '1.2rem' }}
                  className="font-semibold mb-1 group-hover:text-[#c8a96e] transition-colors"
                >
                  {cat.name}
                </h3>
                <p className="text-xs" style={{ color: '#7a6a54' }}>{cat.desc}</p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(90deg, transparent, #c8a96e, transparent)' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
