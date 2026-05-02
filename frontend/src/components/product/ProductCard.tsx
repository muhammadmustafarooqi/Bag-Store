'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
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

  const mainImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600';
  const secondImage = product.images[1]?.url || mainImage;
  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;

  return (
    <Link href={`/shop/${product.slug}`}>
      <div
        className="product-card group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[#1a1815]">
          <Image
            src={hovered && secondImage !== mainImage ? secondImage : mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

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

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              wishlisted
                ? 'bg-[#c8a96e] text-[#0f0e0c]'
                : 'bg-[#0f0e0c]/70 text-[#f0e4ce] hover:bg-[#c8a96e] hover:text-[#0f0e0c]'
            }`}
            aria-label="Wishlist"
          >
            <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Add to Cart Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 transition-all duration-300 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 opacity-100 translate-y-0`}
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              style={{ background: '#c8a96e', color: '#0f0e0c', fontFamily: "'Outfit', sans-serif" }}
            >
              <FiShoppingBag size={16} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
    </Link>
  );
}
