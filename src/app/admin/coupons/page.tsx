'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '0',
    expiryDate: '',
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/coupons', form);
      toast.success('Coupon created successfully!');
      setShowAdd(false);
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0', expiryDate: '' });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Coupons</h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>Manage discount codes</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Create Coupon
        </button>
      </div>

      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Code', 'Discount', 'Min Order', 'Expiry', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-10 skeleton" /></td></tr>
              ))
            ) : data?.length > 0 ? (
              data.map((c: any) => (
                <tr key={c._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }} className="hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: '#c8a96e' }}>{c.code}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#f0e4ce' }}>
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `Rs ${c.discountValue}`}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>Rs {c.minOrderAmount}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:text-red-400 transition-colors" style={{ color: '#7a6a54' }}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-12 text-sm" style={{ color: '#7a6a54' }}>No coupons found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md p-8" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: '#f0e4ce' }} className="mb-6">
              Create Coupon
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Coupon Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="input-field w-full" required placeholder="E.G. WELCOME20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field w-full">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Value</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="input-field w-full" required min="1" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Min Order Amount</label>
                <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  className="input-field w-full" required min="0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="input-field w-full" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Coupon'}
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 btn-outline py-3">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
