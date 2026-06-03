'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursorStore } from '@/store/cursorStore';

export default function CustomCursor() {
  const { isActive, title, subtitle, icon } = useCursorStore();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      
      const defaultIcon = "✦";

      const closestLink = target.closest('a, button, [role="button"]');
      const closestHeading = target.closest('h1, h2, h3, h4, h5, h6');
      
      if (target.closest('nav') || target.closest('footer')) {
        useCursorStore.getState().resetCursor();
        return;
      }
      
      // We check if it's already handled by CursorHover. If not, fallback to auto
      if (!useCursorStore.getState().isActive) {
        if (closestLink) {
          const text = closestLink.textContent?.trim().replace(/\n/g, ' ').slice(0, 25) || 'Action';
          useCursorStore.getState().setCursor('Click', text, defaultIcon);
        } else if (closestHeading) {
          useCursorStore.getState().setCursor('Discover', 'Details', defaultIcon);
        } else if (tag === 'img' || tag === 'video' || target.closest('img')) {
          useCursorStore.getState().setCursor('View', 'Media', defaultIcon);
        }
      }
    };

    const handleMouseOut = () => {
      useCursorStore.getState().resetCursor();
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      {/* The main gold dot that always follows mouse */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] w-3 h-3 rounded-full bg-[#c8a96e] mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isActive ? 2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 35,
          mass: 0.2,
        }}
      />
      
      {/* Expanding info pill if active */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1815] shadow-2xl border border-[rgba(200,169,110,0.3)] backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          x: mousePosition.x + 15,
          y: mousePosition.y + 15,
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.8,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
      >
        <span style={{ color: '#c8a96e' }} className="text-sm">{icon}</span>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f0e4ce' }}>{title}</span>
        </div>
      </motion.div>
    </>
  );
}
