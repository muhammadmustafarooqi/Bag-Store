'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { PROVINCES, PAKISTANI_CITIES, formatCurrency } from '@/lib/constants';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

interface ShippingForm {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  province: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JazzCash'>('COD');
  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const [form, setForm] = useState<ShippingForm>({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    province: 'Punjab',
  });

  const updateForm = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate phone
    if (!/^03\d{9}$/.test(form.phone)) {
      toast.error('Phone must be Pakistani format: 03XXXXXXXXX');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.product._id,
          qty: i.qty,
          color: i.color,
        })),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          province: form.province,
        },
        paymentMethod,
        isGift,
        giftMessage,
        ...(!isAuthenticated && {
          guestInfo: { name: form.name, email: form.email, phone: form.phone },
        }),
      };

      const { data } = await api.post('/orders', orderPayload);
      const order = data.data;

      if (paymentMethod === 'JazzCash') {
        // Initiate JazzCash
        const jcRes = await api.post('/payments/jazzcash/initiate', {
          orderId: order.orderId,
          amount: order.total,
        });
        const { postUrl, params } = jcRes.data.data;

        // Create and submit form to JazzCash
        const form_el = document.createElement('form');
        form_el.method = 'POST';
        form_el.action = postUrl;
        Object.entries(params).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = v as string;
          form_el.appendChild(input);
        });
        document.body.appendChild(form_el);
        clearCart();
        form_el.submit();
      } else {
        clearCart();
        router.push(`/order-success/${order.orderId}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0f0e0c' }}>
        <div className="text-center">
          <p style={{ color: '#7a6a54', fontSize: '1.25rem' }}>Your cart is empty.</p>
          <a href="/shop" className="btn-primary mt-4 inline-block">Shop Now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Almost There</p>
          <h1 className="section-title">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Shipping */}
            <div className="lg:col-span-3 space-y-8">
              {/* Guest/Login prompt */}
              {!isAuthenticated && (
                <div className="p-4 text-sm" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
                  <span style={{ color: '#7a6a54' }}>Have an account? </span>
                  <a href="/auth/login?redirect=/checkout" style={{ color: '#c8a96e' }}>Login for faster checkout →</a>
                </div>
              )}

              {/* Shipping Address */}
              <div>
                <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: '#f0e4ce' }} className="mb-6">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        className="input-field w-full"
                        required
                        placeholder="Muhammad Ali"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Phone Number *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        className="input-field w-full"
                        required
                        placeholder="03001234567"
                        pattern="03\d{9}"
                      />
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        className="input-field w-full"
                        placeholder="email@example.com"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Street Address *</label>
                    <input
                      type="text"
                      value={form.street}
                      onChange={(e) => updateForm('street', e.target.value)}
                      className="input-field w-full"
                      required
                      placeholder="House #123, Street Name, Area"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>City *</label>
                      <select
                        value={form.city}
                        onChange={(e) => updateForm('city', e.target.value)}
                        className="input-field w-full"
                        required
                      >
                        <option value="">Select City</option>
                        {PAKISTANI_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Province *</label>
                      <select
                        value={form.province}
                        onChange={(e) => updateForm('province', e.target.value)}
                        className="input-field w-full"
                        required
                      >
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Options */}
              <div>
                <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: '#f0e4ce' }} className="mb-6">
                  Gift Options
                </h2>
                <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-5 h-5 accent-[#c8a96e]"
                    />
                    <span style={{ color: '#f0e4ce', fontWeight: '500' }}>This order is a gift</span>
                  </label>
                  
                  {isGift && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px dashed rgba(200,169,110,0.2)' }}>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>
                        Gift Message (Optional)
                      </label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        className="input-field w-full resize-none"
                        rows={3}
                        placeholder="Add a special note for the recipient..."
                        maxLength={500}
                      />
                      <p className="text-xs text-right mt-1" style={{ color: '#7a6a54' }}>
                        {giftMessage.length}/500
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: '#f0e4ce' }} className="mb-6">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives. Most popular!', badge: 'Recommended' },
                    { value: 'JazzCash', label: 'JazzCash', desc: 'Pay securely via JazzCash Mobile Account', badge: null },
                  ].map((pm) => (
                    <label key={pm.value}
                      className={`flex items-start gap-4 p-4 cursor-pointer transition-all duration-200 ${
                        paymentMethod === pm.value ? 'border-[#c8a96e]' : 'border-[rgba(200,169,110,0.15)]'
                      }`}
                      style={{ background: paymentMethod === pm.value ? 'rgba(200,169,110,0.05)' : '#1a1815', border: `1px solid ${paymentMethod === pm.value ? '#c8a96e' : 'rgba(200,169,110,0.15)'}` }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.value}
                        checked={paymentMethod === pm.value as 'COD' | 'JazzCash'}
                        onChange={() => setPaymentMethod(pm.value as 'COD' | 'JazzCash')}
                        className="mt-1 accent-[#c8a96e]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm" style={{ color: '#f0e4ce' }}>{pm.label}</span>
                          {pm.badge && <span className="badge-gold text-xs">{pm.badge}</span>}
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#7a6a54' }}>{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
                <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.color}`} className="flex gap-3">
                      <div className="relative w-14 h-16 flex-shrink-0">
                        <Image
                          src={item.product.images[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: '#c8a96e', color: '#0f0e0c' }}>
                          {item.qty}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-1" style={{ color: '#f0e4ce' }}>{item.product.name}</p>
                        {item.color && <p className="text-xs" style={{ color: '#7a6a54' }}>{item.color}</p>}
                        <p className="text-sm" style={{ color: '#c8a96e' }}>{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
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
                </div>

                <div className="flex justify-between font-semibold text-base py-4"
                  style={{ borderTop: '1px solid rgba(200,169,110,0.15)' }}>
                  <span style={{ color: '#f0e4ce' }}>Total</span>
                  <span style={{ color: '#c8a96e', fontFamily: "'Space Mono', monospace", fontSize: '1.25rem' }}>
                    {formatCurrency(total())}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCheckCircle size={18} />
                  )}
                  {loading ? 'Placing Order...' : paymentMethod === 'JazzCash' ? 'Pay via JazzCash' : 'Place Order (COD)'}
                </button>

                <p className="text-xs text-center mt-4" style={{ color: '#7a6a54' }}>
                  🔒 Your information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
