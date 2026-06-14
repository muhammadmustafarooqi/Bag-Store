'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { ProductCard } from '@/components/product/ProductCard';
import { DeliveryEstimator } from '@/components/product/DeliveryEstimator';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { FiHeart, FiShoppingBag, FiStar, FiTruck, FiRefreshCw, FiShield, FiMaximize2 } from 'react-icons/fi';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { fbEvent } from '@/lib/pixel';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useProduct(params.slug);
  const product = data?.data;

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  
  const addToCartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (addToCartRef.current) {
        const rect = addToCartRef.current.getBoundingClientRect();
        setShowStickyCart(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const { toggle, isWishlisted } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const { data: relatedData } = useProducts({
    category: product?.category,
    limit: 4,
  });
  const related = relatedData?.data?.filter((p) => p._id !== product?._id).slice(0, 4) || [];

  const displayPrice = product?.onSale && product?.salePrice ? product.salePrice : (product?.price || 0);

  useEffect(() => {
    if (product) {
      fbEvent('ViewContent', {
        content_ids: [product._id],
        content_name: product.name,
        content_type: 'product',
        value: displayPrice,
        currency: 'PKR',
      });
    }
  }, [product, displayPrice]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0f0e0c' }}>
        <div className="w-16 h-16 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0f0e0c' }}>
        <p style={{ color: '#7a6a54' }}>Product not found.</p>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = () => {
    addItem(product, qty, selectedColor || product.colors[0] || '');
    fbEvent('AddToCart', {
      content_ids: [product._id],
      content_name: product.name,
      content_type: 'product',
      value: displayPrice * qty,
      currency: 'PKR',
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    clearCart();
    addItem(product, qty, selectedColor || product.colors[0] || '');
    fbEvent('AddToCart', {
      content_ids: [product._id],
      content_name: product.name,
      content_type: 'product',
      value: displayPrice * qty,
      currency: 'PKR',
    });
    router.push('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const stockStatus =
    product.stock === 0
      ? { label: 'Out of Stock', color: '#8b1a1a' }
      : product.stock <= 5
      ? { label: `Only ${product.stock} left!`, color: '#c8a96e' }
      : { label: 'In Stock', color: '#2d6a4f' };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: '#7a6a54' }}>
          <a href="/" className="hover:text-[#c8a96e] transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-[#c8a96e] transition-colors">Shop</a>
          <span>/</span>
          <span style={{ color: '#c8a96e' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square mb-4 overflow-hidden" style={{ background: '#1a1815' }}>
              {product.images[selectedImg] ? (
                <Image
                  src={product.images[selectedImg].url}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">👜</div>
              )}
              {product.onSale && (
                <div className="absolute top-4 left-4 badge-sale">Sale</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`relative aspect-square overflow-hidden transition-all ${
                    selectedImg === i ? 'ring-2 ring-[#c8a96e]' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ background: '#1a1815' }}
                >
                  <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="py-4">
            <p className="section-subtitle mb-2">{product.category}</p>
            <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f0e4ce' }}
              className="font-semibold mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.ratings.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={16} fill={i < product.ratings.average ? '#c8a96e' : 'none'}
                      className="text-[#c8a96e]" />
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#7a6a54' }}>
                  {product.ratings.average} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '2rem', color: '#c8a96e' }}
                className="font-semibold">
                {formatCurrency(displayPrice)}
              </span>
              {product.onSale && product.salePrice && (
                <span className="text-lg line-through mb-1" style={{ color: '#7a6a54' }}>
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <p className="text-sm mb-4" style={{ color: '#a08060' }}>{product.shortDescription}</p>

            {/* Size Guide Button */}
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest mb-6 hover:text-[#c8a96e] transition-colors"
              style={{ color: '#7a6a54' }}
            >
              <FiMaximize2 size={14} /> Size Guide
            </button>

            {/* Stock */}
            <p className="text-sm font-semibold mb-5" style={{ color: stockStatus.color }}>
              ● {stockStatus.label}
            </p>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#7a6a54' }}>
                  Color: <span style={{ color: '#c8a96e' }}>{selectedColor || 'Select a color'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className="px-4 py-2 text-sm transition-all duration-200"
                      style={{
                        border: `1px solid ${selectedColor === c ? '#c8a96e' : 'rgba(200,169,110,0.2)'}`,
                        background: selectedColor === c ? 'rgba(200,169,110,0.1)' : 'transparent',
                        color: selectedColor === c ? '#c8a96e' : '#7a6a54',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center" style={{ border: '1px solid rgba(200,169,110,0.2)' }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg transition-colors hover:text-[#c8a96e]"
                  style={{ color: '#7a6a54' }}
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold" style={{ color: '#f0e4ce' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-10 h-10 flex items-center justify-center text-lg transition-colors hover:text-[#c8a96e]"
                  style={{ color: '#7a6a54' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div ref={addToCartRef} className="flex gap-3 mb-8 flex-col sm:flex-row">
              <div className="flex gap-3 flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-outline flex items-center gap-2 justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingBag size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary flex items-center gap-2 justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
              <button
                onClick={() => {
                  toggle(product._id);
                  if (!wishlisted) {
                    fbEvent('AddToWishlist', {
                      content_ids: [product._id],
                      content_name: product.name,
                      content_type: 'product',
                      value: displayPrice,
                      currency: 'PKR',
                    });
                  }
                }}
                className="p-4 transition-all duration-200"
                style={{
                  border: `1px solid ${wishlisted ? '#c8a96e' : 'rgba(200,169,110,0.2)'}`,
                  background: wishlisted ? 'rgba(200,169,110,0.1)' : 'transparent',
                  color: wishlisted ? '#c8a96e' : '#7a6a54',
                }}
                aria-label="Wishlist"
              >
                <FiHeart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Delivery Estimator */}
            <DeliveryEstimator />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-6" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
              {[
                { icon: <FiTruck size={16} />, label: 'Free Delivery above Rs 2,000' },
                { icon: <FiRefreshCw size={16} />, label: '7-Day Easy Returns' },
                { icon: <FiShield size={16} />, label: '100% Original Product' },
              ].map((b) => (
                <div key={b.label} className="text-center">
                  <div className="flex justify-center mb-1" style={{ color: '#c8a96e' }}>{b.icon}</div>
                  <p className="text-xs" style={{ color: '#7a6a54' }}>{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b overflow-x-auto whitespace-nowrap" style={{ borderColor: 'rgba(200,169,110,0.15)', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {(['description', 'details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium uppercase tracking-widest transition-colors relative flex-shrink-0"
                style={{ color: activeTab === tab ? '#c8a96e' : '#7a6a54' }}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8a96e]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-sm leading-relaxed" style={{ color: '#a08060' }}>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'details' && (
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[
                  ['Material', product.material],
                  ['Dimensions', product.dimensions],
                  ['Weight', product.weight],
                  ['SKU', product.sku],
                  ['Brand', product.brand],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>{k}</span>
                    <span className="text-sm" style={{ color: '#f0e4ce' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {product.reviews.length > 0 ? (
                  <div className="space-y-6 mb-10">
                    {product.reviews.map((r) => (
                      <div key={r._id} className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.1)' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: '#c8a96e', color: '#0f0e0c' }}>
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#f0e4ce' }}>{r.name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < r.rating ? '#c8a96e' : '#3a3228', fontSize: '12px' }}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm" style={{ color: '#7a6a54' }}>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mb-8 text-sm" style={{ color: '#7a6a54' }}>No reviews yet. Be the first!</p>
                )}

                {/* Review Form */}
                {isAuthenticated && (
                  <form onSubmit={handleSubmitReview} className="max-w-lg">
                    <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-4">
                      Write a Review
                    </h4>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button key={r} type="button" onClick={() => setReviewRating(r)}>
                          <span style={{ fontSize: '24px', color: r <= reviewRating ? '#c8a96e' : '#3a3228' }}>★</span>
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                      className="input-field w-full mb-4 resize-none"
                      required
                    />
                    <button type="submit" disabled={submittingReview} className="btn-primary disabled:opacity-50">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <p className="section-subtitle mb-2">You May Also Like</p>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart Bar */}
      {showStickyCart && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1815] border-t border-[rgba(200,169,110,0.2)] p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-4">
              <div className="w-12 h-12 relative bg-[#0f0e0c]">
                <Image src={product.images[0]?.url || 'https://via.placeholder.com/50'} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm line-clamp-1" style={{ color: '#f0e4ce' }}>{product.name}</p>
                <p style={{ color: '#c8a96e' }} className="font-serif text-lg">{formatCurrency(displayPrice)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {product.colors.length > 0 && (
                <div className="hidden md:block">
                  <span className="text-xs uppercase mr-2 tracking-widest" style={{ color: '#7a6a54' }}>Color:</span>
                  <span className="text-sm" style={{ color: '#f0e4ce' }}>{selectedColor || product.colors[0]}</span>
                </div>
              )}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-outline w-full sm:w-auto flex items-center gap-2 justify-center py-3 px-4 disabled:opacity-50 text-sm"
                >
                  <FiShoppingBag size={16} />
                  Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-primary w-full sm:w-auto flex items-center gap-2 justify-center py-3 px-4 disabled:opacity-50 text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} dimensions={product.dimensions} />

    </div>
  );
}
