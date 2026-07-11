'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/constants';
import { FiCheckCircle, FiPackage, FiPhone, FiDollarSign } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { fbEvent } from '@/lib/pixel';
import { useCartStore } from '@/store/cartStore';

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const globalSettings = useCartStore((s) => s.globalSettings);
  const WA = globalSettings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  const { data, isLoading } = useOrder(params.orderId);
  const order = data?.data;
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [purchaseFired, setPurchaseFired] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const audio = new Audio('/success.mp3');
    audio.play().catch((err) => console.log('Audio play blocked:', err));
    
    setShowConfetti(true);
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || !order || purchaseFired) return;
    fbEvent('Purchase', {
      value: order.total,
      currency: 'PKR',
    });
    setPurchaseFired(true);
  }, [isLoading, order, purchaseFired]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0f0e0c' }}>
        <div className="w-12 h-12 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ background: '#0f0e0c' }}>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          colors={['#c8a96e', '#e8c98a', '#f0e4ce', '#7a6a54', '#ffffff']}
          numberOfPieces={400}
          gravity={0.15}
        />
      )}
      <div className="max-w-lg w-full mx-auto px-4 text-center animate-scaleIn relative z-10">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: 'rgba(200,169,110,0.1)', border: '2px solid rgba(200,169,110,0.3)' }}>
          <FiCheckCircle size={48} style={{ color: '#c8a96e' }} />
        </div>

        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#f0e4ce' }} className="mb-3">
          Order Placed Successfully!
        </h1>
        <p className="mb-2 text-sm" style={{ color: '#7a6a54' }}>
          Thank you for shopping with KAARVAN.
        </p>

        {/* Order ID */}
        <div className="my-8 p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Order ID</p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: '#c8a96e' }} className="font-bold">
            {params.orderId}
          </p>

          {order && (
            <>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: '#7a6a54' }}>Payment Method</span>
                  <span style={{ color: '#f0e4ce' }}>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: '#7a6a54' }}>Total Amount</span>
                  <span style={{ color: '#c8a96e', fontWeight: 600 }}>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#7a6a54' }}>Delivery To</span>
                  <span style={{ color: '#f0e4ce' }}>{order.shippingAddress.city}</span>
                </div>
              </div>

              {order.paymentMethod === 'COD' && (
                <div className="mt-4 p-3 text-sm text-center" style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e' }}>
                  You will pay <strong>{formatCurrency(order.total)}</strong> when your order arrives.
                </div>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 text-sm" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.1)' }}>
            <FiPhone size={16} style={{ color: '#c8a96e', flexShrink: 0 }} />
            <span style={{ color: '#7a6a54' }}>We will call you within 24 hours to confirm your order.</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-sm" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.1)' }}>
            <FiPackage size={16} style={{ color: '#c8a96e', flexShrink: 0 }} />
            <span style={{ color: '#7a6a54' }}>Estimated delivery: <strong style={{ color: '#f0e4ce' }}>3–7 business days</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${WA}?text=Hi%20KAARVAN!%20My%20order%20ID%20is%20${params.orderId}.%20Please%20confirm%20my%20order.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm transition-all hover:scale-105"
            style={{ background: '#25d366', color: '#fff', borderRadius: 0 }}
          >
            <FaWhatsapp size={18} /> Chat on WhatsApp
          </a>
          <Link href="/shop" className="btn-outline px-6 py-3">
            Continue Shopping
          </Link>
        </div>

        {isLoading || !order ? null : (
          <Link href={`/account/orders/${order.orderId}`} className="block mt-4 text-sm" style={{ color: '#7a6a54' }}>
            Track your order →
          </Link>
        )}
      </div>
    </div>
  );
}
