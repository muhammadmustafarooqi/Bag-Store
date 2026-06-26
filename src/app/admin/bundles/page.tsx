'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBundlesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    bundlePrice: '',
    isActive: true,
    items: [{ product: '', quantity: 1 }]
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products-list'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data.data;
    },
  });

  const { data: bundles, isLoading, refetch } = useQuery({
    queryKey: ['admin-bundles'],
    queryFn: async () => {
      const { data } = await api.get('/admin/bundles');
      return data.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/bundles', form);
      toast.success('Bundle created successfully!');
      setShowAdd(false);
      setForm({ name: '', description: '', bundlePrice: '', isActive: true, items: [{ product: '', quantity: 1 }] });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create bundle');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    try {
      await api.delete(`/admin/bundles/${id}`);
      toast.success('Bundle deleted');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete bundle');
    }
  };

  const handleAddItem = () => {
    setForm({ ...form, items: [...form.items, { product: '', quantity: 1 }] });
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Bundles</h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>Manage product bundles and packs</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Create Bundle
        </button>
      </div>

      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Name', 'Price', 'Items', 'Status', 'Actions'].map((h) => (
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
            ) : bundles?.length > 0 ? (
              bundles.map((b: any) => (
                <tr key={b._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }} className="hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: '#c8a96e' }}>{b.name}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#f0e4ce' }}>Rs {b.bundlePrice}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>{b.items?.length || 0} items</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>{b.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(b._id)} className="p-1.5 hover:text-red-400 transition-colors" style={{ color: '#7a6a54' }}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-12 text-sm" style={{ color: '#7a6a54' }}>No bundles found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', color: '#f0e4ce' }} className="mb-6">
              Create Bundle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Bundle Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field w-full" required placeholder="E.G. Summer Pack" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field w-full" required placeholder="Bundle description..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Bundle Price</label>
                <input type="number" value={form.bundlePrice} onChange={(e) => setForm({ ...form, bundlePrice: e.target.value })}
                  className="input-field w-full" required min="0" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 mt-4" style={{ color: '#7a6a54' }}>Bundle Items</label>
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-2">
                    <select 
                      value={item.product} 
                      onChange={(e) => handleUpdateItem(idx, 'product', e.target.value)}
                      className="input-field flex-1" required
                    >
                      <option value="">Select Product...</option>
                      {products?.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                    <input 
                      type="number" value={item.quantity} 
                      onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value))}
                      className="input-field w-24" required min="1" placeholder="Qty" 
                    />
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-xs mt-2 hover:underline" style={{ color: '#c8a96e' }}>
                  + Add another product
                </button>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Bundle'}
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
