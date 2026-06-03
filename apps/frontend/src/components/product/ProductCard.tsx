'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiHeart, FiShoppingBag, FiStar, FiEye } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';
import { CursorHover } from '@/components/ui/CursorHover';
import { QuickViewModal } from './QuickViewModal';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors[0] || '');
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(product._id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hovered && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
      }, 1200);
    } else {
      setCurrentImgIndex(0);
    }
    return () => clearInterval(interval);
  }, [hovered, product.images]);

  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;

  return (
    <>
    <Link href={`/shop/${product.slug}`}>
      <CursorHover title="View Product" subtitle={product.name} icon="✨" className="w-full">
        <div
          className="product-card group cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#1a1815]">
          {product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <Image
                key={img.publicId || idx}
                src={img.url}
                alt={`${product.name} - Image ${idx + 1}`}
                fill
                className={`absolute inset-0 object-cover transition-all duration-700 group-hover:scale-105 ${
                  idx === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ))
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.onSale && <span className="badge-sale">Sale</span>}
            {product.isNew && <span className="badge-gold">New</span>}
            {product.stock === 0 && (
              <span className="text-xs px-2 py-1 font-semibold uppercase tracking-wider bg-gray-800 text-gray-400">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            {/* Quick View */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="p-2 rounded-full transition-all duration-200 bg-[#0f0e0c]/70 text-[#f0e4ce] hover:bg-[#c8a96e] hover:text-[#0f0e0c]"
              aria-label="Quick View"
              title="Quick View"
            >
              <FiEye size={16} />
            </button>
            
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full transition-all duration-200 ${
                wishlisted
                  ? 'bg-[#c8a96e] text-[#0f0e0c]'
                  : 'bg-[#0f0e0c]/70 text-[#f0e4ce] hover:bg-[#c8a96e] hover:text-[#0f0e0c]'
              }`}
              aria-label="Wishlist"
            >
              <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 rounded-full transition-all duration-200 bg-[#0f0e0c]/70 text-[#f0e4ce] hover:bg-[#c8a96e] hover:text-[#0f0e0c] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to Cart"
              title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <FiShoppingBag size={16} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>
            {product.category}
          </p>
          <h3
            className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-[#c8a96e] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce' }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {product.ratings.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <FiStar size={12} fill="#c8a96e" className="text-[#c8a96e]" />
              <span className="text-xs" style={{ color: '#7a6a54' }}>
                {product.ratings.average} ({product.ratings.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold" style={{ color: '#c8a96e', fontFamily: "'Outfit', sans-serif" }}>
              {formatCurrency(displayPrice)}
            </span>
            {product.onSale && product.salePrice && (
              <span className="text-sm line-through" style={{ color: '#7a6a54' }}>
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Stock warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs mt-1" style={{ color: '#c8a96e' }}>
              Only {product.stock} left!
            </p>
          )}
        </div>
      </div>
      </CursorHover>
    </Link>
    <QuickViewModal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={product} />
    </>
  );
}
