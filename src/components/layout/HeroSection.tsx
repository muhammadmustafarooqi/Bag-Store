'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { CursorHover } from '@/components/ui/CursorHover';
import { motion, useScroll, useTransform } from 'framer-motion';

const bgImages = [
  'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614179689702-355944cd0918?q=80&w=2000&auto=format&fit=crop'
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 400]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0e0c]">
      {/* Background Images */}
      {bgImages.map((img, index) => (
        <motion.div
          key={img}
          className={`absolute -inset-[20%] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url("${img}")`, y: yBackground }}
        />
      ))}

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 9, 7, 0.90) 0%, rgba(26, 21, 18, 0.75) 50%, rgba(15, 14, 12, 0.95) 100%)',
        }}
      />

      {/* Decorative Blob Gradients over the picture */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[80px] animate-pulse opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.5) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.4) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center py-20">
        <div className="animate-fadeIn">
          <p className="section-subtitle mb-4 text-sm md:text-base">Pakistan&apos;s Premier Bag Destination</p>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-tight md:leading-none mb-6"
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
              <CursorHover title="Premium Bags" subtitle="Crafted with love" icon="✨">Matters</CursorHover>
            </span>
          </h1>
          <p className="text-base md:text-xl max-w-2xl mx-auto mb-10 px-4" style={{ color: '#7a6a54' }}>
            Discover our collection of handcrafted premium bags — from everyday handbags to travel essentials.
            Free delivery on orders above Rs 2,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
            <CursorHover title="Explore All" subtitle="Find your perfect bag" icon="🛍️">
              <Link href="/shop" className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-2">
                Shop Collection <FiArrowRight size={18} />
              </Link>
            </CursorHover>
            <CursorHover title="Fresh Drops" subtitle="Be the first" icon="🔥">
              <Link href="/shop?filter=new" className="btn-outline text-base px-8 py-4">
                New Arrivals
              </Link>
            </CursorHover>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-4">
            {[
              { num: '5000+', label: 'Happy Customers' },
              { num: '50+', label: 'Bag Styles' },
              { num: '3-7 Days', label: 'Nationwide Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 sm:p-0" style={{ background: 'rgba(200,169,110,0.02)', border: '1px solid rgba(200,169,110,0.05)', borderRadius: '4px' }}>
                <CursorHover title={stat.label === 'Happy Customers' ? '5 Star Ratings!' : stat.label === 'Bag Styles' ? 'Endless Choices' : 'Fast Delivery'} subtitle={stat.num} icon="🚀">
                  <p
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#c8a96e' }}
                    className="font-bold md:text-3xl"
                  >
                    {stat.num}
                  </p>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest mt-1" style={{ color: '#7a6a54' }}>
                    {stat.label}
                  </p>
                </CursorHover>
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
