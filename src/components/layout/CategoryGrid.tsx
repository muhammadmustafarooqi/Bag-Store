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
import { CursorHover } from '@/components/ui/CursorHover';

const CATEGORIES = [
  {
    num: '01',
    name: 'Handbags',
    slug: 'handbag',
    Icon: MdOutlineShoppingBag,
    desc: 'Everyday elegance',
    cursorTitle: 'Grab & Go! 👜',
    cursorSubtitle: 'Slay all day',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '02',
    name: 'Backpacks',
    slug: 'backpack',
    Icon: MdOutlineBackpack,
    desc: 'Urban adventures',
    cursorTitle: 'Pack It Up! 🎒',
    cursorSubtitle: 'Adventure awaits',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '03',
    name: 'Laptop Bags',
    slug: 'laptop bag',
    Icon: MdOutlineLaptopMac,
    desc: 'Professional style',
    cursorTitle: 'Boss Mode 💼',
    cursorSubtitle: 'Secure the bag',
    img: 'https://images.unsplash.com/photo-1608354580875-30bd4168de35?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '04',
    name: 'Tote Bags',
    slug: 'tote',
    Icon: MdOutlineLocalMall,
    desc: 'Spacious & stylish',
    cursorTitle: "Fill 'er up! 🛍️",
    cursorSubtitle: 'Fits your entire life',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '05',
    name: 'Travel Bags',
    slug: 'travel bag',
    Icon: MdOutlineCardTravel,
    desc: 'Journey in style',
    cursorTitle: 'Catch Flights ✈️',
    cursorSubtitle: 'Not feelings',
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '06',
    name: 'Clutches',
    slug: 'clutch',
    Icon: MdOutlineAutoAwesome,
    desc: 'Evening glam',
    cursorTitle: 'Shine Bright ✨',
    cursorSubtitle: 'Main character energy',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '07',
    name: 'Wallets',
    slug: 'wallet',
    Icon: MdOutlineAccountBalanceWallet,
    desc: 'Smart & slim',
    cursorTitle: 'Money Moves 💸',
    cursorSubtitle: 'Keep it cute',
    img: 'https://images.unsplash.com/photo-1627124765135-565b503040bc?auto=format&fit=crop&q=80&w=800',
  },
  {
    num: '08',
    name: 'School Bags',
    slug: 'school bag',
    Icon: MdOutlineSchool,
    desc: 'For the students',
    cursorTitle: 'A+ Style 📚',
    cursorSubtitle: 'Too cool for school',
    img: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=800',
  },
];

export function CategoryGrid() {
  return (
    <section className="py-28 px-4 md:px-8 bg-[#0a0907] relative overflow-hidden">
      {/* Background luxury visual gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium block mb-3 font-mono">
            Browse Collections
          </span>
          <h2 
            className="text-4xl md:text-6xl font-light text-cream mb-4 tracking-tight" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Curated Categories
          </h2>
          <p className="text-xs text-muted max-w-md mx-auto tracking-wider uppercase font-light">
            Discover our range of premium crafted bags tailored for every lifestyle
          </p>
          <div className="w-24 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Staggered Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-24 pb-20">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="group relative w-full h-[320px] md:h-[460px] overflow-hidden bg-[#0d0c0a] border border-gold/10 p-3 transition-all duration-700 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(200,169,110,0.08)] flex flex-col justify-end even:translate-y-6 md:even:translate-y-12"
            >
              <CursorHover title={cat.cursorTitle} subtitle={cat.cursorSubtitle} icon="✨" className="w-full h-full">
                
                {/* Inner Scaling Border Frame */}
                <div className="relative w-full h-full overflow-hidden border border-gold/20 transition-all duration-700 group-hover:scale-[0.98] flex flex-col justify-end p-6 md:p-8">
                  
                  {/* Background Image with Hover Scale */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={cat.img} 
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-108 transition-transform duration-1000 ease-out filter brightness-[0.7] group-hover:brightness-[0.5] contrast-[1.05]"
                  />

                  {/* High Contrast Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-transparent to-transparent opacity-95 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-[#0d0c0a]/10 group-hover:bg-[#0d0c0a]/30 transition-colors duration-700" />

                  {/* Corner Accent Brackets for editorial focus */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/30 group-hover:w-6 group-hover:h-6 transition-all duration-500 ease-out" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/30 group-hover:w-6 group-hover:h-6 transition-all duration-500 ease-out" />

                  {/* Category Number Bracket top-left */}
                  <div className="absolute top-6 left-6 font-mono text-[9px] text-gold/60 tracking-wider">
                    [ {cat.num} ]
                  </div>

                  {/* Floating Outline Icon top-right */}
                  <div className="absolute top-6 right-6 text-gold/30 group-hover:text-gold/80 transition-all duration-700 text-xl group-hover:scale-110 group-hover:rotate-[15deg]">
                    <cat.Icon />
                  </div>

                  {/* Category Card Content */}
                  <div className="relative z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <span className="block text-[8px] md:text-[9px] tracking-[0.3em] text-gold/80 uppercase mb-2 font-medium">
                      {cat.desc}
                    </span>
                    <h3 
                      className="text-xl md:text-3xl font-light text-cream leading-tight mb-2 group-hover:bg-gradient-to-r group-hover:from-gold-light group-hover:via-gold group-hover:to-gold-light group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {cat.name}
                    </h3>
                    
                    {/* Animated Underline Indicator */}
                    <div className="w-0 h-[1px] bg-gradient-to-r from-gold/30 to-gold/80 group-hover:w-full transition-all duration-700 ease-out mt-1" />
                    
                    {/* Interactive Slide-up Explore CTA */}
                    <div className="mt-4 flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-cream/60 group-hover:text-gold transition-colors duration-500 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span>Explore Selection</span>
                      <span className="text-xs">→</span>
                    </div>
                  </div>

                </div>
              </CursorHover>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
