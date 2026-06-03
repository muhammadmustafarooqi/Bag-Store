'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMessageCircle, FiTruck, FiPackage, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const STATUS_ICONS: Record<string, any> = {
  placed: FiClock,
  confirmed: FiPackage,
  packed: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
  returned: FiXCircle,
};

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-order-detail', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${params.id}`);
      return data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setCourierName(data.courierName || '');
      setTrackingNumber(data.trackingNumber || '');
    }
  }, [data]);

  const handleSaveTracking = async () => {
    if (!courierName || !trackingNumber) {
      toast.error('Both Courier Name and Tracking Number are required.');
      return;
    }
    setIsSaving(true);
    try {
      await api.put(`/orders/${data._id}/tracking`, {
        courierName,
        trackingNumber,
      });
      toast.success('Tracking information saved successfully.');
      refetch();
    } catch (error) {
      toast.error('Failed to save tracking info.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsApp = () => {
    if (!data) return;
    
    // Normalize phone number (replace leading 0 with 92)
    let phone = data.shippingAddress?.phone || data.guestInfo?.phone || '';
    if (phone.startsWith('0')) {
      phone = '92' + phone.slice(1);
    }
    
    const trackingUrl = `${window.location.origin}/track-order`;
    const message = `Hi ${data.shippingAddress?.name || data.guestInfo?.name || 'Customer'}! \n\nThank you for shopping with KAARVAN. \nYour order *${data.orderId}* is currently *${data.orderStatus}*.\nOrder Total: ${formatCurrency(data.total)}\n\nYou can track your order live here:\n${trackingUrl}\n\nFeel free to reply if you have any questions.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p style={{ color: '#7a6a54' }}>Order not found.</p>
        <Link href="/admin/orders" className="text-[#c8a96e] mt-4 inline-block">← Back to Orders</Link>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[data.orderStatus] || FiPackage;

  return (
    <div className="p-8">
      <Link href="/admin/orders" className="flex items-center gap-2 mb-6 text-sm hover:underline" style={{ color: '#c8a96e' }}>
        <FiArrowLeft /> Back to Orders
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#f0e4ce' }}>
            Order {data.orderId}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7a6a54' }}>
            Placed on {new Date(data.placedAt).toLocaleString('en-PK')}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded transition-colors"
            style={{ background: '#25D366', color: '#fff' }}
          >
            <FaWhatsapp size={16} /> WhatsApp Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status & Summary */}
          <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#f0e4ce' }}>
              <StatusIcon /> Current Status: <span className="uppercase tracking-widest text-sm ml-2" style={{ color: '#c8a96e' }}>{data.orderStatus}</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Payment Method</p>
                <p className="font-semibold" style={{ color: '#f0e4ce' }}>{data.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Payment Status</p>
                <p className={`font-semibold capitalize ${data.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {data.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Total</p>
                <p className="font-semibold" style={{ color: '#c8a96e' }}>{formatCurrency(data.total)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Items</p>
                <p className="font-semibold" style={{ color: '#f0e4ce' }}>{data.items?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0e4ce' }}>Items Ordered</h2>
            <div className="space-y-4">
              {data.items?.map((item: any) => (
                <div key={item._id} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }}>
                  <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-16 h-16 object-cover bg-[#0f0e0c]" />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#f0e4ce' }}>{item.name}</p>
                    <p className="text-xs mt-1" style={{ color: '#7a6a54' }}>
                      {item.color && <span>Color: {item.color} | </span>} Qty: {item.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: '#c8a96e' }}>{formatCurrency(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Tracking */}
        <div className="space-y-8">
          
          {/* Customer Info */}
          <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0e4ce' }}>Customer Details</h2>
            <div className="space-y-3 text-sm">
              <p><strong style={{ color: '#7a6a54' }}>Name:</strong> <span style={{ color: '#f0e4ce' }}>{data.shippingAddress?.name || data.guestInfo?.name}</span></p>
              <p><strong style={{ color: '#7a6a54' }}>Phone:</strong> <span style={{ color: '#f0e4ce' }}>{data.shippingAddress?.phone || data.guestInfo?.phone}</span></p>
              <p><strong style={{ color: '#7a6a54' }}>Email:</strong> <span style={{ color: '#f0e4ce' }}>{data.user?.email || data.guestInfo?.email || 'N/A'}</span></p>
              <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <p><strong style={{ color: '#7a6a54' }}>Address:</strong></p>
                <p className="mt-1" style={{ color: '#f0e4ce' }}>
                  {data.shippingAddress?.street}<br/>
                  {data.shippingAddress?.city}, {data.shippingAddress?.province}
                </p>
              </div>
            </div>
          </div>

          {/* Shipment Tracking */}
          <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0e4ce' }}>Shipment Tracking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Courier Name</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g. TCS, Leopards, CallCourier"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="input-field w-full"
                  placeholder="Tracking ID"
                />
              </div>
              <button 
                onClick={handleSaveTracking}
                disabled={isSaving}
                className="btn-primary w-full py-2 text-sm disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Tracking Info'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
