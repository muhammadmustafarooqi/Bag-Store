'use client';
import Link from 'next/link';
import { 
  MdOutlineShoppingBag, 
  MdOutlineBackpack, 
  MdOutlineLaptopMac, 
  MdOutlineLocalMall, 
  MdOutlineCardTravel, 
  MdOutlineAutoAwesome, 
  MdOutlineAccountBalanceWallet, 
  MdOutlineSchool 
} from 'react-icons/md';

const CATEGORIES = [
  { name: 'Handbags', slug: 'handbag', Icon: MdOutlineShoppingBag, desc: 'Everyday elegance' },
  { name: 'Backpacks', slug: 'backpack', Icon: MdOutlineBackpack, desc: 'Urban adventures' },
  { name: 'Laptop Bags', slug: 'laptop bag', Icon: MdOutlineLaptopMac, desc: 'Professional style' },
  { name: 'Tote Bags', slug: 'tote', Icon: MdOutlineLocalMall, desc: 'Spacious & stylish' },
  { name: 'Travel Bags', slug: 'travel bag', Icon: MdOutlineCardTravel, desc: 'Journey in style' },
  { name: 'Clutches', slug: 'clutch', Icon: MdOutlineAutoAwesome, desc: 'Evening glam' },
  { name: 'Wallets', slug: 'wallet', Icon: MdOutlineAccountBalanceWallet, desc: 'Smart & slim' },
  { name: 'School Bags', slug: 'school bag', Icon: MdOutlineSchool, desc: 'For the students' },
];

export function CategoryGrid() {
  return (
    <section className="py-24 px-4" style={{ background: '#0a0907' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#c8a96e' }}>Browse Collections</p>
          <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce' }}>
            Shop By Category
          </h2>
          <div className="w-16 h-px mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, #c8a96e, transparent)' }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.slug)}`}>
              <div className="group relative flex flex-col items-center justify-center text-center cursor-pointer">
                
                {/* Floating Icon Container */}
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:-translate-y-3"
                  style={{ 
                    background: 'radial-gradient(circle at top left, #1a1815 0%, #0f0e0c 100%)',
                    border: '1px solid rgba(200,169,110,0.08)',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* Subtle Glow Behind Icon on Hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: 'rgba(200,169,110,0.1)' }} />
                  
                  <div className="relative text-3xl transition-transform duration-500 group-hover:scale-110" style={{ color: '#c8a96e' }}>
                    <cat.Icon />
                  </div>
                </div>

                {/* Elegant Typography */}
                <h3
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce' }}
                  className="text-xl md:text-2xl font-light mb-2 group-hover:text-[#c8a96e] transition-colors duration-300"
                >
                  {cat.name}
                </h3>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em]" style={{ color: '#7a6a54' }}>
                  {cat.desc}
                </p>
                
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
