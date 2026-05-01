'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useOrders } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/constants';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ORDER_STATUS_COLORS: Record<string, string> = {
  placed: 'status-placed',
  confirmed: 'status-confirmed',
  packed: 'status-packed',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
  returned: 'status-returned',
};

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>('profile');
  const { data: ordersData, isLoading: ordersLoading } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login?redirect=/account');
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: <FiUser size={16} /> },
    { key: 'orders', label: 'My Orders', icon: <FiPackage size={16} /> },
    { key: 'wishlist', label: 'Wishlist', icon: <FiHeart size={16} /> },
    { key: 'addresses', label: 'Addresses', icon: <FiMapPin size={16} /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <p className="section-subtitle mb-2">Your Account</p>
          <h1 className="section-title">Hello, {user.name.split(' ')[0]} 👋</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside>
            <div className="p-6 mb-4" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto"
                style={{ background: '#c8a96e', color: '#0f0e0c' }}>
                {user.name[0]}
              </div>
              <p className="text-center font-semibold" style={{ color: '#f0e4ce' }}>{user.name}</p>
              <p className="text-center text-xs mt-1" style={{ color: '#7a6a54' }}>{user.email}</p>
            </div>

            <nav className="space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as Tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all ${
                    tab === t.key ? 'text-[#c8a96e]' : 'text-[#7a6a54] hover:text-[#f0e4ce]'
                  }`}
                  style={{
                    background: tab === t.key ? 'rgba(200,169,110,0.08)' : 'transparent',
                    borderLeft: tab === t.key ? '2px solid #c8a96e' : '2px solid transparent',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-400 hover:text-red-300 transition-colors"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="md:col-span-3">
            {/* PROFILE TAB */}
            {tab === 'profile' && (
              <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
                  Profile Details
                </h2>
                <div className="space-y-4 max-w-md">
                  {[
                    { label: 'Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone || '—' },
                    { label: 'Account Type', value: user.role === 'admin' ? 'Administrator' : 'Customer' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>{f.label}</label>
                      <p className="mt-1 text-sm" style={{ color: '#f0e4ce' }}>{f.value}</p>
                    </div>
                  ))}
                </div>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="btn-primary mt-6 inline-block text-sm px-6 py-3">
                    Go to Admin Dashboard →
                  </Link>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
                  My Orders
                </h2>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton" />)}
                  </div>
                ) : ordersData?.data?.length ? (
                  <div className="space-y-3">
                    {ordersData.data.map((order) => (
                      <Link key={order._id} href={`/account/orders/${order._id}`}>
                        <div className="flex items-center justify-between p-4 transition-all hover:border-[rgba(200,169,110,0.4)]"
                          style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.1)' }}>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#f0e4ce' }}>{order.orderId}</p>
                            <p className="text-xs mt-1" style={{ color: '#7a6a54' }}>
                              {new Date(order.placedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-semibold" style={{ color: '#c8a96e' }}>{formatCurrency(order.total)}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.orderStatus] || 'status-placed'}`}>
                                {order.orderStatus}
                              </span>
                            </div>
                            <FiChevronRight size={16} style={{ color: '#7a6a54' }} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FiPackage size={48} className="mx-auto mb-4" style={{ color: '#3a3228' }} />
                    <p style={{ color: '#7a6a54' }}>No orders yet</p>
                    <Link href="/shop" className="btn-primary mt-4 inline-block text-sm px-6">Shop Now</Link>
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {tab === 'wishlist' && (
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
                  My Wishlist
                </h2>
                <p style={{ color: '#7a6a54' }}>Your wishlisted items appear here.</p>
                <Link href="/shop" className="btn-outline mt-4 inline-block text-sm px-6">Browse Shop</Link>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {tab === 'addresses' && (
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
                  Saved Addresses
                </h2>
                {user.addresses?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div key={addr._id} className="p-4" style={{ background: '#221f1b', border: `1px solid ${addr.isDefault ? '#c8a96e' : 'rgba(200,169,110,0.15)'}` }}>
                        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c8a96e' }}>
                          {addr.label} {addr.isDefault && '(Default)'}
                        </p>
                        <p className="text-sm" style={{ color: '#f0e4ce' }}>{addr.street}</p>
                        <p className="text-sm" style={{ color: '#7a6a54' }}>{addr.city}, {addr.province}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#7a6a54' }}>No saved addresses.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
