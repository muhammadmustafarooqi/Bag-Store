'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminTestimonialsPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    isActive: true,
  });

  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data } = await api.get('/admin/testimonials');
      return data.data;
    },
  });

  const handleOpenModal = (t?: any) => {
    if (t) {
      setEditId(t._id);
      setForm({
        name: t.name,
        role: t.role || '',
        text: t.text,
        rating: t.rating,
        isActive: t.isActive,
      });
    } else {
      setEditId(null);
      setForm({ name: '', role: '', text: '', rating: 5, isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/admin/testimonials/${editId}`, form);
        toast.success('Testimonial updated successfully!');
      } else {
        await api.post('/admin/testimonials', form);
        toast.success('Testimonial created successfully!');
      }
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save Testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Testimonial?')) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      toast.success('Testimonial deleted');
      refetch();
    } catch (err: any) {
      toast.error('Failed to delete Testimonial');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Testimonials</h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>Manage customer reviews on the homepage</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add Testimonial
        </button>
      </div>

      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Name', 'Role', 'Rating', 'Text', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-10 skeleton" /></td></tr>
              ))
            ) : testimonials?.length > 0 ? (
              testimonials.map((t: any) => (
                <tr key={t._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }} className="hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: '#f0e4ce' }}>{t.name}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>{t.role || '-'}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#c8a96e' }}>{'★'.repeat(t.rating)}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ color: '#a08060' }}>{t.text}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>
                    <span className={`px-2 py-1 rounded text-xs ${t.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleOpenModal(t)} className="p-1.5 hover:text-[#c8a96e] transition-colors" style={{ color: '#7a6a54' }}>
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="p-1.5 hover:text-red-400 transition-colors" style={{ color: '#7a6a54' }}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: '#7a6a54' }}>No Testimonials found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md p-8" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
              {editId ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Customer Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Role/City</label>
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                    className="input-field w-full" required />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Review Text</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="input-field w-full" required rows={4} />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <label htmlFor="isActive" className="text-sm" style={{ color: '#f0e4ce' }}>Active (Visible to customers)</label>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 disabled:opacity-60">
                  {loading ? 'Saving...' : 'Save Testimonial'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline py-3">
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
