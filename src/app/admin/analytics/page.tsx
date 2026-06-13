'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiGlobe, FiSmartphone, FiActivity, FiArrowRight } from 'react-icons/fi';

const PIE_COLORS = ['#c8a96e', '#7a6a54', '#a08060', '#f0e4ce', '#3a3228'];

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin', 'analytics-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data.data;
    },
    refetchInterval: 30000, // Refresh every 30s for near real-time statistics
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-2 border-[#c8a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { activeSessions = 0, kpis = {}, funnel = {}, devices = [], channels = [], geoData = [], topProducts = [], topPages = [] } = analytics || {};

  // Formulate KPI array
  const statCards = [
    { label: 'Live Active Users (5m)', value: activeSessions, icon: <FiActivity className="animate-pulse" size={20} />, color: '#25D366' },
    { label: '30D Total Revenue', value: formatCurrency(kpis.revenue || 0), icon: <FiTrendingUp size={20} />, color: '#c8a96e' },
    { label: '30D Total Orders', value: kpis.orders || 0, icon: <FiShoppingBag size={20} />, color: '#a08060' },
    { label: 'Repeat Customer Rate', value: `${(kpis.rcr || 0).toFixed(1)}%`, icon: <FiUsers size={20} />, color: '#f0e4ce' },
  ];

  // Calculate Funnel Conversion Rates
  const funnelSessions = funnel.sessions || 1;
  const cartRate = ((funnel.cart || 0) / funnelSessions) * 100;
  const checkoutRate = ((funnel.checkout || 0) / funnelSessions) * 100;
  const purchaseRate = ((funnel.purchase || 0) / funnelSessions) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>
            Store Analytics
          </h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>Shopify-style live customer behavior & conversion analytics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1815] border border-green-500/20 text-green-400 rounded text-xs font-mono">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
          <span>Real-time aggregation active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>{card.label}</p>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: card.color }} className="font-bold">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Funnel & Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Funnel Card */}
        <div className="lg:col-span-2 p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }} className="mb-6 uppercase tracking-widest">
            Checkout Funnel Overview
          </h3>
          <div className="space-y-6">
            {/* Step 1: Sessions */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold" style={{ color: '#f0e4ce' }}>1. All Visitor Sessions</span>
                <span style={{ color: '#7a6a54' }}>{funnel.sessions || 0} sessions</span>
              </div>
              <div className="w-full h-8 bg-[#0a0908] rounded relative overflow-hidden border border-white/5">
                <div className="h-full bg-[#7a6a54]/30" style={{ width: '100%' }} />
                <span className="absolute inset-0 flex items-center pl-3 text-xs font-mono text-[#f0e4ce]">100% Benchmark</span>
              </div>
            </div>

            {/* Step 2: Cart */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold" style={{ color: '#c8a96e' }}>2. Added to Cart</span>
                <span style={{ color: '#7a6a54' }}>{funnel.cart || 0} sessions ({cartRate.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-8 bg-[#0a0908] rounded relative overflow-hidden border border-white/5">
                <div className="h-full bg-[#c8a96e]/30" style={{ width: `${cartRate}%` }} />
                <span className="absolute inset-0 flex items-center pl-3 text-xs font-mono text-[#c8a96e]">{cartRate.toFixed(1)}% conversion</span>
              </div>
            </div>

            {/* Step 3: Checkout */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold" style={{ color: '#a08060' }}>3. Initiated Checkout</span>
                <span style={{ color: '#7a6a54' }}>{funnel.checkout || 0} sessions ({checkoutRate.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-8 bg-[#0a0908] rounded relative overflow-hidden border border-white/5">
                <div className="h-full bg-[#a08060]/30" style={{ width: `${checkoutRate}%` }} />
                <span className="absolute inset-0 flex items-center pl-3 text-xs font-mono text-[#a08060]">{checkoutRate.toFixed(1)}% conversion</span>
              </div>
            </div>

            {/* Step 4: Purchase */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold" style={{ color: '#25d366' }}>4. Completed Purchases</span>
                <span style={{ color: '#7a6a54' }}>{funnel.purchase || 0} sessions ({purchaseRate.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-8 bg-[#0a0908] rounded relative overflow-hidden border border-white/5">
                <div className="h-full bg-green-500/25" style={{ width: `${purchaseRate}%` }} />
                <span className="absolute inset-0 flex items-center pl-3 text-xs font-mono text-[#25d366]">{purchaseRate.toFixed(1)}% conversion rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acquisition Channels Card */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }} className="mb-6 uppercase tracking-widest">
            Traffic Channels
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channels} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: '#7a6a54', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ background: '#221f1b', border: '1px solid rgba(200,169,110,0.2)', color: '#f0e4ce' }}
                />
                <Bar dataKey="count" fill="#c8a96e" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Devices, Geography & Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Device breakdown */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }} className="mb-6 uppercase tracking-widest flex items-center gap-2">
            <FiSmartphone /> Devices Used
          </h3>
          <div className="h-56 flex items-center justify-center">
            {devices.some((d: any) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={devices} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {devices.map((_: any, idx: number) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#221f1b', border: '1px solid rgba(200,169,110,0.2)', color: '#f0e4ce' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs" style={{ color: '#7a6a54' }}>Insufficient visitor logs</p>
            )}
          </div>
          <div className="flex justify-around text-xs mt-4">
            {devices.map((d: any, idx: number) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span style={{ color: '#7a6a54' }}>{d.name}: {d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pakistan Geo Distribution */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }} className="mb-6 uppercase tracking-widest flex items-center gap-2">
            <FiGlobe /> Pakistan Locations
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {geoData.length > 0 ? (
              geoData.slice(0, 5).map((g: any, index: number) => (
                <div key={g.city} className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-sm" style={{ color: '#f0e4ce' }}>
                    {index + 1}. {g.city}
                  </span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(200,169,110,0.08)', color: '#c8a96e' }}>
                    {g.count} visits
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-center pt-8" style={{ color: '#7a6a54' }}>No geographical sessions logged</p>
            )}
          </div>
        </div>

        {/* Top Product / Pages lists */}
        <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <h3 style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }} className="mb-6 uppercase tracking-widest">
            Top Performing Pages
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {topPages.length > 0 ? (
              topPages.map((page: any) => (
                <div key={page.path} className="flex justify-between items-start py-2 border-b border-white/5 gap-2">
                  <span className="text-xs truncate max-w-[180px] font-mono" style={{ color: '#7a6a54' }} title={page.path}>
                    {page.path}
                  </span>
                  <span className="text-xs font-semibold font-mono" style={{ color: '#c8a96e' }}>
                    {page.views} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-center pt-8" style={{ color: '#7a6a54' }}>No page views registered</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="mt-10 p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
        <h3 style={{ fontFamily: "'Space Mono', monospace", color: '#f0e4ce', fontSize: '1.1rem' }} className="mb-6 uppercase tracking-widest">
          Top Products (30 Days)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10" style={{ color: '#7a6a54' }}>
                <th className="pb-3 text-xs uppercase tracking-widest font-normal">Product Title</th>
                <th className="pb-3 text-xs uppercase tracking-widest font-normal text-center">Qty Sold</th>
                <th className="pb-3 text-xs uppercase tracking-widest font-normal text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? (
                topProducts.map((prod: any) => (
                  <tr key={prod.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-medium" style={{ color: '#f0e4ce' }}>{prod.name}</td>
                    <td className="py-3.5 text-center font-mono" style={{ color: '#7a6a54' }}>{prod.qty} units</td>
                    <td className="py-3.5 text-right font-mono font-semibold" style={{ color: '#c8a96e' }}>{formatCurrency(prod.revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-xs" style={{ color: '#7a6a54' }}>No sales records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
