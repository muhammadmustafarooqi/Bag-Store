'use client';
import { useOrder } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const STATUS_ICONS: Record<string, any> = {
  placed: FiClock,
  confirmed: FiPackage,
  packed: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
  returned: FiXCircle,
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  placed: "text-blue-400 bg-blue-900/30",
  confirmed: "text-indigo-400 bg-indigo-900/30",
  packed: "text-purple-400 bg-purple-900/30",
  shipped: "text-orange-400 bg-orange-900/30",
  delivered: "text-green-400 bg-green-900/30",
  cancelled: "text-red-400 bg-red-900/30",
  returned: "text-red-400 bg-red-900/30",
};

export default function CustomerOrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: response, isLoading } = useOrder(params.id);
  const order = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ background: "#0f0e0c" }}>
        <div className="w-12 h-12 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16 text-center" style={{ background: "#0f0e0c" }}>
        <p style={{ color: '#7a6a54' }}>Order not found or you do not have permission to view it.</p>
        <Link href="/account" className="text-[#c8a96e] mt-4 inline-block hover:underline">← Back to My Account</Link>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[order.orderStatus] || FiPackage;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: "#0f0e0c" }}>
      <div className="max-w-4xl mx-auto px-4">
        
        <Link href="/account" className="flex items-center gap-2 mb-8 text-sm hover:underline transition-colors w-fit" style={{ color: '#c8a96e' }}>
          <FiArrowLeft /> Back to My Account
        </Link>
        
        <div className="mb-8">
          <p className="section-subtitle mb-2">Order Details</p>
          <h1 className="section-title">Order {order.orderId}</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a54' }}>
            Placed on {new Date(order.placedAt).toLocaleString('en-PK')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content (Status & Items) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Status Summary */}
            <div className="p-6 rounded" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-full ${ORDER_STATUS_COLORS[order.orderStatus] || "bg-gray-800 text-gray-400"}`}>
                  <StatusIcon size={24} />
                </div>
                <div>
                  <h2 className="text-sm uppercase tracking-widest" style={{ color: '#7a6a54' }}>Current Status</h2>
                  <p className="text-xl font-semibold capitalize" style={{ color: '#f0e4ce' }}>{order.orderStatus}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Payment Method</p>
                  <p className="font-medium" style={{ color: '#f0e4ce' }}>{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Payment Status</p>
                  <p className={`font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Information (If available) */}
            {(order.trackingNumber || order.courierName) && (
              <div className="p-6 rounded relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1815, #0f0e0c)', border: '1px solid rgba(200,169,110,0.3)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FiTruck size={100} color="#c8a96e" />
                </div>
                <h2 className="text-lg font-semibold mb-4 relative z-10 flex items-center gap-2" style={{ color: '#f0e4ce' }}>
                   <FiTruck className="text-[#c8a96e]" /> Shipment Tracking
                </h2>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  {order.courierName && (
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Courier</p>
                      <p className="font-medium" style={{ color: '#f0e4ce' }}>{order.courierName}</p>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Tracking Number</p>
                      <p className="font-mono text-lg font-semibold tracking-wider" style={{ color: '#c8a96e' }}>
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs mt-4 relative z-10" style={{ color: '#a08b70' }}>
                  You can use this tracking number on the courier's official website to track your parcel.
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="p-6 rounded" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0e4ce' }}>Items Ordered</h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item._id} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }}>
                    <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-16 h-16 rounded object-cover bg-[#0f0e0c]" />
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

          {/* Right Sidebar (Summary & Address) */}
          <div className="space-y-8">
            
            {/* Order Summary */}
            <div className="p-6 rounded" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0e4ce' }}>Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#7a6a54' }}>Subtotal</span>
                  <span style={{ color: '#f0e4ce' }}>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#7a6a54' }}>Shipping Fee</span>
                  <span style={{ color: '#f0e4ce' }}>{formatCurrency(order.shippingFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 font-semibold text-lg" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                  <span style={{ color: '#f0e4ce' }}>Total</span>
                  <span style={{ color: '#c8a96e' }}>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 rounded" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#f0e4ce' }}>Shipping Details</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium" style={{ color: '#f0e4ce' }}>{order.shippingAddress?.name}</p>
                <p style={{ color: '#7a6a54' }}>{order.shippingAddress?.phone}</p>
                <p className="mt-2 leading-relaxed" style={{ color: '#a08b70' }}>
                  {order.shippingAddress?.street}<br/>
                  {order.shippingAddress?.city}, {order.shippingAddress?.province}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
