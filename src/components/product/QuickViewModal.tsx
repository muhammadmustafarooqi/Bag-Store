'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiX, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function QuickViewModal({ isOpen, onClose, product }: Props) {
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState('');
  
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setQty(1);
      setCurrentImg(product.images?.[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    addItem(product, qty, selectedColor);
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  const handleWishlist = async () => {
    await toggle(product._id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0907]/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1815] border border-[rgba(200,169,110,0.2)] shadow-2xl shadow-black/50 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-scaleIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#0f0e0c]/50 hover:bg-[#c8a96e] text-[#f0e4ce] hover:text-[#0f0e0c] rounded-full backdrop-blur-sm transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#0f0e0c] flex flex-col">
          <div className="relative aspect-square w-full">
            <Image 
              src={currentImg}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto border-t border-[rgba(200,169,110,0.1)]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImg(img.url)}
                  className={`relative w-16 h-16 flex-shrink-0 border-2 transition-colors ${currentImg === img.url ? 'border-[#c8a96e]' : 'border-transparent'}`}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col max-h-[80vh] overflow-y-auto">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>{product.category}</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#f0e4ce' }} className="mb-2 leading-tight">
            {product.name}
          </h2>
          
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#c8a96e' }} className="font-semibold">
              {formatCurrency(displayPrice)}
            </span>
            {product.onSale && product.salePrice && (
              <span className="line-through text-sm" style={{ color: '#7a6a54' }}>
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <p className="text-sm mb-6 leading-relaxed" style={{ color: '#7a6a54' }}>
            {product.shortDescription || product.description.substring(0, 150) + '...'}
          </p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-widest mb-3" style={{ color: '#f0e4ce' }}>
                Color: <span style={{ color: '#7a6a54' }}>{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200 ${
                      selectedColor === color 
                        ? 'bg-[#c8a96e] text-[#0f0e0c]' 
                        : 'bg-[#221f1b] text-[#7a6a54] hover:border-[#c8a96e] border border-transparent'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center border border-[rgba(200,169,110,0.2)]">
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-[#7a6a54] hover:text-[#c8a96e] transition-colors"
              >-</button>
              <span className="w-8 text-center text-sm" style={{ color: '#f0e4ce' }}>{qty}</span>
              <button 
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-4 py-2 text-[#7a6a54] hover:text-[#c8a96e] transition-colors"
              >+</button>
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs" style={{ color: '#c8a96e' }}>Only {product.stock} left in stock!</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              <FiShoppingBag size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 border transition-colors ${wishlisted ? 'border-[#c8a96e] text-[#c8a96e]' : 'border-[rgba(200,169,110,0.2)] text-[#7a6a54] hover:border-[#c8a96e] hover:text-[#c8a96e]'}`}
              aria-label="Wishlist"
            >
              <FiHeart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href={`/shop/${product.slug}`}
              className="text-xs uppercase tracking-widest hover:underline transition-all"
              style={{ color: '#7a6a54' }}
              onClick={onClose}
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
