'use client';

import { FiX, FiInfo } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dimensions?: string; // e.g. "30 x 40 x 15 cm" or just empty
}

export function SizeGuideModal({ isOpen, onClose, dimensions }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0907]/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1a1815] border border-[rgba(200,169,110,0.3)] shadow-2xl shadow-black/50 w-full max-w-2xl p-8 animate-scaleIn">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7a6a54] hover:text-[#c8a96e] hover:bg-[rgba(200,169,110,0.1)] rounded-full transition-colors"
        >
          <FiX size={24} />
        </button>

        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#f0e4ce' }} className="mb-2 text-center">
          Size Guide
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: '#7a6a54' }}>
          Understanding the scale and dimensions of our bags.
        </p>

        {dimensions && (
          <div className="p-4 mb-8 bg-[#0f0e0c] border border-[rgba(200,169,110,0.15)] flex flex-col items-center justify-center">
            <span className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Product Dimensions</span>
            <span className="font-mono text-xl" style={{ color: '#c8a96e' }}>{dimensions}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Visual Scale representation */}
          <div className="flex flex-col items-center border border-[rgba(200,169,110,0.1)] p-6 bg-[#0f0e0c]">
            <div className="relative w-full aspect-square flex items-end justify-center pb-4">
              {/* Laptop Silhouette */}
              <div className="absolute bottom-4 w-3/4 h-3/4 border-2 border-[#7a6a54]/30 rounded-md flex items-center justify-center">
                <span className="text-xs text-[#7a6a54]/50 font-mono">13&quot; Laptop</span>
              </div>
              {/* Bag Silhouette */}
              <div className="relative w-1/2 h-2/3 bg-[rgba(200,169,110,0.1)] border-2 border-[#c8a96e] rounded-t-lg z-10 flex items-center justify-center">
                <span className="text-xs text-[#c8a96e] font-semibold">Standard Bag</span>
              </div>
            </div>
            <p className="text-xs text-center mt-4" style={{ color: '#7a6a54' }}>
              Scale comparison against a standard 13-inch laptop.
            </p>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-start gap-3">
              <FiInfo className="mt-1 flex-shrink-0" style={{ color: '#c8a96e' }} />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: '#f0e4ce' }}>Measuring Guide</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#7a6a54' }}>
                  Width is measured across the bottom. Height is from bottom to top edge (excluding handles). Depth is the side width.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <FiInfo className="mt-1 flex-shrink-0" style={{ color: '#c8a96e' }} />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: '#f0e4ce' }}>Fit Promise</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#7a6a54' }}>
                  Not sure if your items will fit? Reach out to our WhatsApp support, and we&apos;ll gladly verify specific item compatibility for you.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
