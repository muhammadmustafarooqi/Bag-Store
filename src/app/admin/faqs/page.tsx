'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminFaqsPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isActive: true,
  });

  const { data: faqs, isLoading, refetch } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data } = await api.get('/admin/faqs');
      return data.data;
    },
  });

  const handleOpenModal = (faq?: any) => {
    if (faq) {
      setEditId(faq._id);
      setForm({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        isActive: faq.isActive,
      });
    } else {
      setEditId(null);
      setForm({ question: '', answer: '', category: 'General', order: 0, isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/admin/faqs/${editId}`, form);
        toast.success('FAQ updated successfully!');
      } else {
        await api.post('/admin/faqs', form);
        toast.success('FAQ created successfully!');
      }
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      toast.success('FAQ deleted');
      refetch();
    } catch (err: any) {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>FAQs</h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>Manage Frequently Asked Questions</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add FAQ
        </button>
      </div>

      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Question', 'Category', 'Order', 'Status', 'Actions'].map((h) => (
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
            ) : faqs?.length > 0 ? (
              faqs.map((f: any) => (
                <tr key={f._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }} className="hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                  <td className="px-4 py-3 font-medium max-w-md truncate" style={{ color: '#f0e4ce' }}>{f.question}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>{f.category}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>{f.order}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#7a6a54' }}>
                    <span className={`px-2 py-1 rounded text-xs ${f.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {f.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleOpenModal(f)} className="p-1.5 hover:text-[#c8a96e] transition-colors" style={{ color: '#7a6a54' }}>
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(f._id)} className="p-1.5 hover:text-red-400 transition-colors" style={{ color: '#7a6a54' }}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-12 text-sm" style={{ color: '#7a6a54' }}>No FAQs found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md p-8" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
            <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-6">
              {editId ? 'Edit FAQ' : 'Add FAQ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Question</label>
                <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="input-field w-full" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Answer</label>
                <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="input-field w-full" required rows={3} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field w-full" required />
                </div>
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                    className="input-field w-full" required />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <label htmlFor="isActive" className="text-sm" style={{ color: '#f0e4ce' }}>Active (Visible to customers)</label>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 disabled:opacity-60">
                  {loading ? 'Saving...' : 'Save FAQ'}
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
