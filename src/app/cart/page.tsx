'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, shippingFee, total, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon, orderTotal: subtotal() });
      setDiscount(data.data.discount);
      setCouponApplied(true);
      toast.success(`Coupon applied! You saved ${formatCurrency(data.data.discount)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0f0e0c' }}>
        <div className="text-center animate-fadeIn">
          <FiShoppingBag size={64} className="mx-auto mb-6" style={{ color: '#3a3228' }} />
          <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }} className="mb-3">
            Your Cart is Empty
          </h2>
          <p className="mb-8" style={{ color: '#7a6a54' }}>Looks like you haven't added any items yet.</p>
          <Link href="/shop" className="btn-primary px-8 py-4">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const grandTotal = total() - discount;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Review Items</p>
          <h1 className="section-title">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product._id}-${item.color}`}
                className="flex gap-4 p-4"
                style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.1)' }}>
                <div className="relative w-20 h-24 flex-shrink-0">
                  <Image
                    src={item.product.images[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.product.slug}`}
                    className="font-semibold text-sm hover:text-[#c8a96e] transition-colors line-clamp-1"
                    style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }}>
                    {item.product.name}
                  </Link>
                  {item.color && (
                    <p className="text-xs mt-1" style={{ color: '#7a6a54' }}>Color: {item.color}</p>
                  )}
                  <p className="text-sm font-semibold mt-2" style={{ color: '#c8a96e' }}>
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.product._id, item.color)} className="p-1 hover:text-red-400 transition-colors" style={{ color: '#7a6a54' }}>
                    <FiTrash2 size={16} />
                  </button>
                  <div className="flex items-center" style={{ border: '1px solid rgba(200,169,110,0.2)' }}>
                    <button onClick={() => updateQty(item.product._id, item.color, Math.max(1, item.qty - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:text-[#c8a96e] transition-colors" style={{ color: '#7a6a54' }}>
                      <FiMinus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm" style={{ color: '#f0e4ce' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.product._id, item.color, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:text-[#c8a96e] transition-colors" style={{ color: '#7a6a54' }}>
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#f0e4ce' }}>
                    {formatCurrency(item.price * item.qty)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="p-6 sticky top-28" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#7a6a54' }}>Subtotal</span>
                  <span style={{ color: '#f0e4ce' }}>{formatCurrency(subtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#7a6a54' }}>Shipping</span>
                  <span style={{ color: shippingFee() === 0 ? '#2d6a4f' : '#f0e4ce' }}>
                    {shippingFee() === 0 ? 'FREE' : formatCurrency(shippingFee())}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7a6a54' }}>Coupon Discount</span>
                    <span style={{ color: '#2d6a4f' }}>−{formatCurrency(discount)}</span>
                  </div>
                )}
                {shippingFee() > 0 && (
                  <p className="text-xs" style={{ color: '#7a6a54' }}>
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal())} more for free shipping
                  </p>
                )}
              </div>

              {/* Coupon */}
              {!couponApplied && (
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="btn-outline text-sm py-2 px-3 whitespace-nowrap disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponApplied && (
                <div className="mb-6 p-3 text-sm flex items-center gap-2" style={{ background: 'rgba(45,106,79,0.1)', border: '1px solid rgba(45,106,79,0.3)', color: '#2d6a4f' }}>
                  ✓ Coupon applied: {coupon}
                </div>
              )}

              <div className="flex justify-between text-base font-semibold py-4"
                style={{ borderTop: '1px solid rgba(200,169,110,0.15)' }}>
                <span style={{ color: '#f0e4ce' }}>Total</span>
                <span style={{ color: '#c8a96e', fontFamily: "'Space Mono', monospace", fontSize: '1.25rem' }}>
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block py-4">
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="btn-outline w-full text-center block py-3 mt-3 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
