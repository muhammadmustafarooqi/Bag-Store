'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';

const STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', search, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('t', Date.now().toString());
      const { data } = await api.get(`/admin/orders?${params}`);
      return data;
    },
  });

  const updateStatus = async (id: string, orderStatus: string) => {
    try {
      await api.put(`/orders/${id}/status`, { orderStatus });
      toast.success(`Status updated to "${orderStatus}"`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted successfully');
      refetch();
    } catch {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Orders</h1>
        <p className="text-sm" style={{ color: '#7a6a54' }}>{data?.pagination?.total || 0} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6a54' }} />
          <input
            type="text"
            placeholder="Search order ID or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-8 text-sm"
            style={{ width: '250px' }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input-field text-sm"
          style={{ width: '180px' }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-10 skeleton" /></td></tr>
                ))
              : data?.data?.map((o: any) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }}
                    className="hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: '#c8a96e' }}>{o.orderId}</td>
                    <td className="px-4 py-3 text-sm">
                      <p style={{ color: '#f0e4ce' }}>{o.user?.name || o.guestInfo?.name || 'Guest'}</p>
                      <p className="text-xs" style={{ color: '#7a6a54' }}>{o.shippingAddress?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#f0e4ce' }}>{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-1 rounded-sm font-medium ${
                        o.paymentStatus === 'paid' ? 'bg-green-900 text-green-300' :
                        o.paymentStatus === 'failed' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {o.paymentMethod} / {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="text-xs px-2 py-1 rounded outline-none cursor-pointer"
                        style={{ background: '#221f1b', border: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e' }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#7a6a54' }}>
                      {new Date(o.placedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link href={`/admin/orders/${o.orderId}`}
                        className="p-1.5 hover:text-[#c8a96e] transition-colors inline-block" style={{ color: '#7a6a54' }}>
                        <FiEye size={14} />
                      </Link>
                      <button
                        onClick={() => deleteOrder(o.orderId)}
                        className="p-1.5 hover:text-red-500 transition-colors inline-block" style={{ color: '#7a6a54' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(data.pagination.pages)].map((_: any, i: number) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 text-sm ${page === i + 1 ? 'bg-[#c8a96e] text-[#0f0e0c]' : 'text-[#7a6a54]'}`}
              style={{ border: '1px solid rgba(200,169,110,0.2)' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
