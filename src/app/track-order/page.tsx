'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/constants';
import { FiSearch, FiClock, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_ICONS: Record<string, any> = {
  placed: FiClock,
  confirmed: FiPackage,
  packed: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
  returned: FiXCircle,
};

const STATUS_MESSAGES: Record<string, string> = {
  placed: 'We are reviewing your order.',
  confirmed: 'Your order is confirmed and being packed.',
  packed: 'Your order is confirmed and being packed.',
  shipped: 'Your order has been handed over to the courier.',
  delivered: 'Your order has been delivered successfully.',
  cancelled: 'Your order has been cancelled.',
  returned: 'Your order has been returned.',
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) {
      toast.error('Please enter both Order ID and Phone Number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setOrderData(null);
    
    try {
      const { data } = await api.get(`/orders/track?orderId=${orderId}&phone=${phone}`);
      setOrderData(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'No order found with these details.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTracking = () => {
    if (orderData?.trackingNumber) {
      navigator.clipboard.writeText(orderData.trackingNumber);
      toast.success('Tracking number copied!');
    }
  };

  const StatusIcon = orderData ? (STATUS_ICONS[orderData.orderStatus] || FiPackage) : FiPackage;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0f0e0c' }}>
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <p className="section-subtitle mb-2">Track Your Package</p>
          <h1 className="section-title">Order Tracking</h1>
          <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color: '#7a6a54' }}>
            Enter your Order ID and the Phone Number you used during checkout to see the current status of your shipment.
          </p>
        </div>

        {/* Search Form */}
        <div className="p-6 mb-8" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Order ID (e.g. KRV-2024-0001)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input-field w-full uppercase"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Phone Number (e.g. 03001234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field w-full"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary py-2 px-6 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSearch />
              )}
              {isLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
          
          {error && (
            <p className="text-red-400 mt-4 text-center text-sm">{error}</p>
          )}
        </div>

        {/* Results */}
        {orderData && (
          <div className="space-y-6 animate-scaleIn">
            
            {/* Status Card */}
            <div className="p-8 text-center" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)' }}>
                <StatusIcon size={32} style={{ color: '#c8a96e' }} />
              </div>
              <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2rem', color: '#f0e4ce' }} className="capitalize mb-2">
                Order {orderData.orderStatus}
              </h2>
              <p style={{ color: '#7a6a54' }}>
                {STATUS_MESSAGES[orderData.orderStatus] || 'We are processing your order.'}
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="p-8" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="font-semibold mb-8 text-center text-sm uppercase tracking-widest" style={{ color: '#f0e4ce', fontFamily: "'Space Mono', monospace" }}>
                Delivery Progress
              </h3>
              
              <div className="relative flex items-center justify-between max-w-xl mx-auto px-4">
                {/* Horizontal line background */}
                <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-[2px]" style={{ background: '#25211c' }} />
                
                {/* Active line progress */}
                <div 
                  className="absolute left-6 top-5 -translate-y-1/2 h-[2px] transition-all duration-700 ease-in-out" 
                  style={{ 
                    background: '#c8a96e',
                    width: (orderData.orderStatus === 'cancelled' || orderData.orderStatus === 'returned')
                      ? '0%'
                      : (() => {
                          const idx = { placed: 0, confirmed: 1, packed: 1, shipped: 2, delivered: 3 }[orderData.orderStatus as string] ?? 0;
                          return `${(idx / 3) * 88}%`; // Adjust slightly to match circles alignment
                        })()
                  }}
                />

                {[
                  { key: 'placed', label: 'Placed', icon: FiClock },
                  { key: 'confirmed', label: 'Confirmed', icon: FiPackage },
                  { key: 'shipped', label: 'Shipped', icon: FiTruck },
                  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle }
                ].map((step, idx) => {
                  const statusIdx = { placed: 0, confirmed: 1, packed: 1, shipped: 2, delivered: 3, cancelled: -1, returned: -1 }[orderData.orderStatus as string] ?? 0;
                  const isCompleted = idx < statusIdx && statusIdx >= 0;
                  const isActive = idx === statusIdx && statusIdx >= 0;
                  const IconComponent = step.icon;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[#c8a96e] text-[#0f0e0c]'
                            : isActive
                            ? 'bg-[#1a1815] text-[#c8a96e] border border-[#c8a96e] shadow-[0_0_12px_rgba(200,169,110,0.3)] animate-pulse'
                            : 'bg-[#0f0e0c] text-[#7a6a54] border border-[#25211c]'
                        }`}
                      >
                        <IconComponent size={18} />
                      </div>
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-3 whitespace-nowrap"
                         style={{ color: (isCompleted || isActive) ? '#c8a96e' : '#7a6a54' }}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {(orderData.orderStatus === 'cancelled' || orderData.orderStatus === 'returned') && (
                <div className="mt-8 p-3 text-sm text-center border border-red-900/30 bg-red-950/10 text-red-400">
                  ⚠️ This order has been {orderData.orderStatus === 'cancelled' ? 'cancelled' : 'returned'}.
                </div>
              )}
            </div>

            {/* Courier Tracking Card */}
            {orderData.trackingNumber && orderData.courierName && (
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4" 
                   style={{ background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.3)' }}>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Shipped Via</p>
                  <p className="font-semibold text-lg" style={{ color: '#c8a96e' }}>{orderData.courierName}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Tracking Number</p>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-lg font-bold" style={{ color: '#f0e4ce' }}>{orderData.trackingNumber}</p>
                    <button onClick={copyTracking} className="p-2 hover:bg-[#c8a96e] hover:text-[#0f0e0c] transition-colors rounded" style={{ color: '#c8a96e', border: '1px solid rgba(200,169,110,0.3)' }}>
                      <FiCopy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Items Summary */}
            <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="font-semibold mb-4 text-lg" style={{ color: '#f0e4ce' }}>Order Details</h3>
              <div className="space-y-4 mb-6">
                {orderData.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 pb-4" style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }}>
                    <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-16 h-16 object-cover bg-[#0f0e0c]" />
                    <div>
                      <p className="font-medium" style={{ color: '#f0e4ce' }}>{item.name}</p>
                      <p className="text-sm mt-1" style={{ color: '#7a6a54' }}>
                        {item.color && <span>Color: {item.color} | </span>} Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span style={{ color: '#7a6a54' }}>Total Amount</span>
                <span className="font-semibold text-lg" style={{ color: '#c8a96e' }}>{formatCurrency(orderData.total)}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
