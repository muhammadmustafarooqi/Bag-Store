'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiStar } from 'react-icons/fi';
import { CursorHover } from '@/components/ui/CursorHover';

const REVIEWS = [
  {
    name: 'Ayesha Siddiqui',
    city: 'Lahore',
    category: 'Premium Handbag',
    rating: 5,
    comment:
      'Absolutely love my KAARVAN handbag! The quality is exceptional and it arrived in just 2 days. The attention to detail in the gold hardware and stitching rivals international luxury brands.',
    avatar: 'AS',
  },
  {
    name: 'Muhammad Imran',
    city: 'Karachi',
    category: 'Leather Laptop Bag',
    rating: 5,
    comment:
      'Ordered a laptop bag and the stitching and material quality is top-notch. It fits my 16" MacBook and accessories perfectly while maintaining a slim profile. COD made it super easy.',
    avatar: 'MI',
  },
  {
    name: 'Fatima Khan',
    city: 'Islamabad',
    category: 'Travel Backpack',
    rating: 5,
    comment:
      'Beautiful backpack, exactly as shown in pictures. The interior lining is premium and water-resistant. Customer service was incredibly helpful too. Highly recommend KAARVAN!',
    avatar: 'FK',
  },
  {
    name: 'Zainab Yusuf',
    city: 'Faisalabad',
    category: 'Classic Tote',
    rating: 5,
    comment:
      'The classic leather tote is my daily workhorse. It holds my laptop, folders, and water bottle easily without losing its elegant structure. Essential for office goers.',
    avatar: 'ZY',
  },
  {
    name: 'Hamza Ahmed',
    city: 'Peshawar',
    category: 'Weekender Duffel',
    rating: 5,
    comment:
      'Took the weekender duffel on a trip to the north. Highly durable zippers, premium metal fittings, and surprisingly spacious. Worth every single rupee!',
    avatar: 'HA',
  },
  {
    name: 'Mariam Raza',
    city: 'Quetta',
    category: 'Luxury Clutch & Wallet',
    rating: 5,
    comment:
      'Bought the matching wallet and clutch set. The textured finish is gorgeous, and it came in a beautiful presentation box. It makes for a perfect gift!',
    avatar: 'MR',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(REVIEWS.length);
  const [visibleCards, setVisibleCards] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(1.5);
      } else {
        setVisibleCards(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, visibleCards]);

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= REVIEWS.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - REVIEWS.length);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + REVIEWS.length);
    }
  };

  const DISPLAY_REVIEWS = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section className="py-28 px-4 relative overflow-hidden" style={{ background: '#0a0908' }}>
      {/* Premium ambient light glow */}
      <div 
        className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, #c8a96e 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          
          {/* Left Column: Trust Summary & Header */}
          <div className="flex flex-col justify-between pr-0 lg:pr-8 mb-8 lg:mb-0">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c8a96e' }}></span>
                <p className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: '#c8a96e' }}>
                  Verified Reviews
                </p>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-6 font-serif leading-tight text-[#f0e4ce]">
                Loved by <br />
                <span className="font-semibold" style={{ color: '#c8a96e' }}>Our Community</span>
              </h2>
              
              <p className="text-sm leading-relaxed mb-8 max-w-md text-[#a08b70]">
                We build for quality, durability, and standard. Discover how KAARVAN premium bags elevate the daily journeys of our clients across Pakistan.
              </p>

              {/* Verified Badge Summary Box */}
              <div className="p-6 bg-[#13110f] border border-[rgba(200,169,110,0.12)] inline-block w-full sm:w-auto">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-serif font-bold text-[#c8a96e]">4.9</span>
                  <span className="text-xs text-[#7a6a54]">/ 5.0</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="text-xs fill-current" style={{ color: '#c8a96e' }} />
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#7a6a54] font-semibold">
                  1,420+ Verified Buyers
                </p>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex gap-3 mt-8 pt-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0a0908] hover:shadow-[0_0_15px_rgba(200,169,110,0.2)]"
                style={{
                  borderColor: 'rgba(200, 169, 110, 0.25)',
                  background: 'transparent',
                }}
                aria-label="Previous review"
              >
                <FiArrowLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0a0908] hover:shadow-[0_0_15px_rgba(200,169,110,0.2)]"
                style={{
                  borderColor: 'rgba(200, 169, 110, 0.25)',
                  background: 'transparent',
                }}
                aria-label="Next review"
              >
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Sliding Testimonial viewport */}
          <div 
            className="lg:col-span-2 relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="w-full overflow-hidden">
              <div 
                className="flex"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  transition: isTransitioning ? 'transform 700ms ease-out' : 'none'
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {DISPLAY_REVIEWS.map((r, idx) => (
                  <div 
                    key={idx} 
                    className="flex-shrink-0 px-3 h-full"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <CursorHover 
                      title={`Review from ${r.city}`} 
                      subtitle={r.category} 
                      icon="✦"
                      className="w-full h-full !block"
                    >
                      <div
                        className="p-8 relative h-full flex flex-col justify-between transition-all duration-300 hover:border-[#c8a96e] border group"
                        style={{
                          background: '#13110f',
                          borderColor: 'rgba(200, 169, 110, 0.12)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {/* Huge Elegant Quote Mark */}
                        <div className="absolute top-2 right-6 select-none pointer-events-none text-[10rem] font-serif text-[rgba(200,169,110,0.03)] leading-none font-bold">
                          “
                        </div>

                        <div>
                          {/* Stars */}
                          <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className="text-xs fill-current"
                                style={{ color: i < r.rating ? '#c8a96e' : '#282420' }}
                              />
                            ))}
                          </div>
                          
                          {/* Category Tag */}
                          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-4 text-[#7a6a54]">
                            Verified Purchase — {r.category}
                          </span>

                          {/* Client Comment */}
                          <p className="text-sm leading-relaxed mb-8 font-serif italic text-[#e6dcc8]">
                            &quot;{r.comment}&quot;
                          </p>
                        </div>

                        {/* Customer Avatar & Bio */}
                        <div className="flex items-center gap-3.5 pt-5 border-t border-[rgba(200,169,110,0.06)] mt-auto">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold font-mono tracking-wider border border-[rgba(200,169,110,0.18)]"
                            style={{
                              background: 'linear-gradient(135deg, #1a1815, #0f0e0c)',
                              color: '#c8a96e',
                            }}
                          >
                            {r.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold tracking-wide text-[#f0e4ce]">
                                {r.name}
                              </p>
                              <span className="inline-flex items-center justify-center text-[10px] text-[#c8a96e] border border-[rgba(200,169,110,0.3)] rounded-full w-3.5 h-3.5" title="Verified Buyer">
                                ✓
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7a6a54]">
                              {r.city}, Pakistan
                            </p>
                          </div>
                        </div>

                      </div>
                    </CursorHover>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
