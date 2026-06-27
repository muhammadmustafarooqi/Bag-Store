'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
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
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/constants';

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

interface CategoryCardItemProps {
  cat: typeof CATEGORIES[0];
  index: number;
}

function CategoryCardItem({ cat, index }: CategoryCardItemProps) {
  const router = useRouter();
  const previewCardRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  const [isHovered, setIsHovered] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const safeClassSlug = cat.slug.replace(/\s+/g, '-');

  // Track latest state in refs to prevent stale closure bugs in the fetch effect
  const productsRef = useRef(products);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    productsRef.current = products;
    isLoadingRef.current = isLoading;
  }, [products, isLoading]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch products on demand (only re-run when hover changes, avoiding state update triggers)
  useEffect(() => {
    if (isHovered && !productsRef.current && !isLoadingRef.current) {
      setIsLoading(true);
      fetch(`/api/products?category=${encodeURIComponent(cat.slug)}&limit=3`)
        .then((res) => res.json())
        .then((data) => {
          if (mountedRef.current && data.success) {
            setProducts(data.data);
          }
        })
        .catch((err) => console.error('Error fetching preview products:', err))
        .finally(() => {
          if (mountedRef.current) setIsLoading(false);
        });
    }
  }, [isHovered, cat.slug]);

  // GSAP Exit animation handling
  useEffect(() => {
    if (isHovered) {
      setShouldRender(true);
    } else {
      if (previewCardRef.current) {
        gsap.killTweensOf(previewCardRef.current);
        gsap.to(previewCardRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 15,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            setShouldRender(false);
          }
        });
      } else {
        setShouldRender(false);
      }
    }
  }, [isHovered]);

  // GSAP Entrance animation handling
  useEffect(() => {
    if (shouldRender && previewCardRef.current && isHovered) {
      gsap.killTweensOf(previewCardRef.current);
      gsap.fromTo(previewCardRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        }
      );
    }
  }, [shouldRender, isHovered]);

  // GSAP Staggered products entry animation
  useEffect(() => {
    if (products && products.length > 0 && shouldRender && isHovered) {
      const selector = `.prod-row-${safeClassSlug}`;
      gsap.fromTo(selector,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.35, 
          stagger: 0.08, 
          ease: 'power1.out',
          delay: 0.15 
        }
      );
    }
  }, [products, shouldRender, isHovered, safeClassSlug]);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.product-preview-item')) {
      return;
    }
    router.push(`/shop?category=${encodeURIComponent(cat.slug)}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-full h-[320px] md:h-[460px] bg-[#0d0c0a] border border-gold/10 p-3 transition-all duration-700 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(200,169,110,0.08)] flex flex-col justify-end even:translate-y-6 md:even:translate-y-12 cursor-pointer transition-[z-index] ${isHovered ? 'z-40' : 'z-10'}`}
    >
      <CursorHover title={cat.cursorTitle} subtitle={cat.cursorSubtitle} icon="✨" className="w-full h-full relative">
        
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

      {/* Dynamic Animated Glassmorphic Product Preview Card (Rendered Separately alongside) */}
      {shouldRender && (
        <div
          ref={previewCardRef}
          className="absolute z-50 bg-[#090807]/98 border-2 border-gold/35 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(200,169,110,0.05)] p-1 top-[102%] left-0 w-full h-auto mt-2"
          onClick={(e) => e.stopPropagation()} // Prevent card navigation when interacting inside the overlay
        >
          {/* Inner Editorial Frame */}
          <div className="border border-gold/15 w-full h-full p-5 md:p-6 flex flex-col justify-between relative">
            
            {/* Top Emblem Accent */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-gold/35 text-[10px]">✦</div>

            <div className="text-center mt-2">
              <span className="block text-[8px] tracking-[0.3em] text-gold uppercase mb-1 font-mono">
                KAARVAN SELECT
              </span>
              <h4 
                className="text-xl md:text-2xl font-light text-cream italic tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {cat.name}
              </h4>
              <div className="w-8 h-px bg-gold/30 mx-auto mt-2.5" />
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4 py-6">
              {isLoading ? (
                // 3 Luxury Loading Skeletons
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 animate-pulse pb-3 border-b border-gold/5 last:border-0 last:pb-0">
                    <div className="w-14 h-14 bg-gold/5 border border-gold/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-gold/15 w-3/4" />
                      <div className="h-1.5 bg-gold/5 w-1/2" />
                    </div>
                  </div>
                ))
              ) : products && products.length > 0 ? (
                // Staggered Product Cards
                products.map((product) => {
                  const hasSale = product.onSale && typeof product.salePrice === 'number';
                  const currentPrice = hasSale && product.salePrice !== undefined ? product.salePrice : product.price;
                  const mainImage = product.images?.[0]?.url || 'https://via.placeholder.com/60';
                  
                  // Calculate discount percentage if on sale
                  let discountPercent = 0;
                  if (hasSale && product.salePrice) {
                    discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);
                  }

                  const ratingAverage = product.ratings?.average || 5;

                  return (
                    <div
                      key={product._id}
                      onClick={() => router.push(`/shop/${product.slug}`)}
                      className={`prod-row-${safeClassSlug} product-preview-item flex items-center gap-4 pb-3 border-b border-gold/5 last:border-0 last:pb-0 hover:bg-gold/5 p-2 transition-all duration-300 group/item cursor-pointer`}
                    >
                      {/* Image Container with Zoom */}
                      <div className="w-14 h-14 overflow-hidden border border-gold/20 group-hover/item:border-gold/45 transition-colors relative flex-shrink-0 bg-[#0d0c0a]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={mainImage} 
                          alt={product.name} 
                          className="w-full h-full object-cover scale-100 group-hover/item:scale-110 transition-transform duration-500"
                        />
                        {discountPercent > 0 && (
                          <div className="absolute top-0 left-0 bg-[#c8a96e] text-black font-mono text-[7px] font-bold px-1 py-0.5">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-cream/90 font-light truncate group-hover/item:text-gold transition-colors font-mono">
                          {product.name}
                        </p>
                        
                        {/* Rating Stars */}
                        <div className="flex text-[8px] text-gold/80 gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < Math.round(ratingAverage) ? '★' : '☆'}</span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gold font-mono font-medium">
                            {formatCurrency(currentPrice)}
                          </span>
                          {hasSale && (
                            <span className="text-[9px] text-muted line-through font-mono">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-gold/40 group-hover/item:text-gold text-xs transition-colors pr-1 font-mono">
                        →
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-cream/40 text-[10px] uppercase tracking-widest font-light font-mono">
                  New Arrivals Coming Soon
                </div>
              )}
            </div>

            {/* Premium Button CTA */}
            <div 
              onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.slug)}`)}
              className="w-full border border-gold/20 text-gold text-[9px] tracking-[0.25em] uppercase py-2.5 text-center hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 cursor-pointer font-mono font-semibold"
            >
              Explore Collection
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

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
          {CATEGORIES.map((cat, index) => (
            <CategoryCardItem key={cat.slug} cat={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

