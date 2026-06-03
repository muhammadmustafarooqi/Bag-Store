'use client';
import { useDashboard, useSalesAnalytics } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import { FiTrendingUp, FiPackage, FiClock, FiAlertTriangle } from 'react-icons/fi';

const PIE_COLORS = ['#c8a96e', '#2d6a4f', '#4a3f35', '#8b1a1a', '#1a3a6e', '#6e4a1a', '#3a1a6e'];

export default function AdminDashboardPage() {
  const { data: dash, isLoading } = useDashboard();
  const { data: analytics } = useSalesAnalytics('week');

  const STAT_CARDS = dash ? [
    { label: "Today's Revenue", value: formatCurrency(dash.todayRevenue), icon: <FiTrendingUp size={22} />, color: '#c8a96e' },
    { label: 'Total Orders', value: dash.totalOrders.toLocaleString(), icon: <FiPackage size={22} />, color: '#2d6a4f' },
    { label: 'Pending Orders', value: dash.pendingOrders, icon: <FiClock size={22} />, color: '#c8a96e' },
    { label: 'Low Stock Items', value: dash.lowStockCount, icon: <FiAlertTriangle size={22} />, color: '#8b1a1a' },
  ] : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#f0e4ce' }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: '#7a6a54' }}>Welcome back, Admin</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton" />)
          : STAT_CARDS.map((card) => (
              <div key={card.label} className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>{card.label}</p>
                  <span style={{ color: card.color }}>{card.icon}</span>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: card.color }} className="font-bold">
                  {card.value}
                </p>
              </div>
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Sales Bar Chart */}
        <div className="lg:col-span-2 p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce', fontSize: '1.25rem' }} className="mb-6">
            Sales — Last 7 Days
          </h3>
          {analytics?.orders?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.orders}>
                <XAxis dataKey="_id" tick={{ fill: '#7a6a54', fontSize: 11 }} />
                <YAxis tick={{ fill: '#7a6a54', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#221f1b', border: '1px solid rgba(200,169,110,0.2)', color: '#f0e4ce' }}
                  formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#c8a96e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center" style={{ color: '#7a6a54' }}>No data yet</div>
          )}
        </div>

        {/* Order Status Donut */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce', fontSize: '1.25rem' }} className="mb-6">
            Orders by Status
          </h3>
          {analytics?.statusBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={analytics.statusBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {analytics.statusBreakdown.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#221f1b', border: '1px solid rgba(200,169,110,0.2)', color: '#f0e4ce' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center" style={{ color: '#7a6a54' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce', fontSize: '1.25rem' }}>Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs" style={{ color: '#c8a96e' }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {dash?.recentOrders?.map((o: any) => (
              <div key={o._id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#f0e4ce' }}>{o.orderId}</p>
                  <p className="text-xs" style={{ color: '#7a6a54' }}>{o.user?.name || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#c8a96e' }}>{formatCurrency(o.total)}</p>
                  <span className={`text-xs px-2 py-0.5 status-${o.orderStatus}`}>{o.orderStatus}</span>
                </div>
              </div>
            )) ?? <p style={{ color: '#7a6a54', fontSize: '0.875rem' }}>No orders yet</p>}
          </div>
        </div>

        {/* Low Stock */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e4ce', fontSize: '1.25rem' }}>Low Stock Products</h3>
            <Link href="/admin/products" className="text-xs" style={{ color: '#c8a96e' }}>Manage →</Link>
          </div>
          <div className="space-y-3">
            {dash?.lowStockProducts?.map((p: any) => (
              <div key={p._id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(200,169,110,0.06)' }}>
                <div>
                  <p className="text-sm font-semibold line-clamp-1" style={{ color: '#f0e4ce' }}>{p.name}</p>
                  <p className="text-xs capitalize" style={{ color: '#7a6a54' }}>{p.category}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: '#8b1a1a' }}>
                  {p.stock} left
                </span>
              </div>
            )) ?? <p style={{ color: '#7a6a54', fontSize: '0.875rem' }}>No low stock items</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
