'use client';
import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiPlus, FiTrash2, FiEdit2, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    cursorTitle: '',
    cursorSubtitle: '',
    iconName: '',
    isActive: true,
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/admin/categories');
      return data.data;
    },
  });

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditId(cat._id);
      setForm({
        name: cat.name || '',
        description: cat.description || '',
        cursorTitle: cat.cursorTitle || '',
        cursorSubtitle: cat.cursorSubtitle || '',
        iconName: cat.iconName || '',
        isActive: cat.isActive,
      });
      setImagePreview(cat.image || null);
    } else {
      setEditId(null);
      setForm({
        name: '',
        description: '',
        cursorTitle: '',
        cursorSubtitle: '',
        iconName: '',
        isActive: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = imagePreview; // might be existing url if not changed
      let imagePublicId = undefined;

      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        fd.append('folder', 'kaarvan/categories');
        const uploadRes = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data.success && uploadRes.data.data.length > 0) {
          imageUrl = uploadRes.data.data[0].url;
          imagePublicId = uploadRes.data.data[0].publicId;
        }
      }

      const payload = { ...form, image: imageUrl, imagePublicId };

      if (editId) {
        await api.put(`/categories/${editId}`, payload);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', payload);
        toast.success('Category created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Categories</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ color: '#f0e4ce' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.2)', color: '#c8a96e' }}>
              <th className="p-4 font-mono text-xs uppercase">Image</th>
              <th className="p-4 font-mono text-xs uppercase">Name</th>
              <th className="p-4 font-mono text-xs uppercase">Cursor Text</th>
              <th className="p-4 font-mono text-xs uppercase">Status</th>
              <th className="p-4 font-mono text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat: any) => (
              <tr key={cat._id} className="hover:bg-[#1a1815] transition-colors" style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
                <td className="p-4">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover border border-[#c8a96e]/30" />
                  ) : (
                    <div className="w-12 h-12 bg-[#1a1815] flex items-center justify-center text-[10px] text-[#7a6a54]">N/A</div>
                  )}
                </td>
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-sm" style={{ color: '#7a6a54' }}>
                  {cat.cursorTitle && <div className="text-[#f0e4ce]">{cat.cursorTitle}</div>}
                  {cat.cursorSubtitle && <div>{cat.cursorSubtitle}</div>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${cat.isActive ? 'bg-[#2d6a4f]/20 text-[#2d6a4f]' : 'bg-[#8b1a1a]/20 text-[#8b1a1a]'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleOpenModal(cat)} className="p-2 hover:text-[#c8a96e] transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 hover:text-[#8b1a1a] transition-colors ml-2">
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {categories?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center" style={{ color: '#7a6a54' }}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0f0e0c] border border-[rgba(200,169,110,0.3)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(200,169,110,0.1)] flex justify-between items-center bg-[#1a1815]">
              <h2 className="text-xl font-serif text-[#c8a96e]">{editId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#7a6a54] hover:text-[#c8a96e]"><FiX size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Category Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-24 h-24 border border-[#c8a96e]/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-[#8b1a1a] text-white rounded-full p-1"><FiX size={12} /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileRef.current?.click()} className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-[#c8a96e]/30 hover:border-[#c8a96e] text-[#7a6a54] transition-colors">
                        <FiUpload size={20} className="mb-2" />
                        <span className="text-[10px] uppercase tracking-widest">Upload</span>
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field w-full" placeholder="e.g. Handbags" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Status</label>
                    <select value={form.isActive ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })} className="input-field w-full cursor-pointer">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Description</label>
                  <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field w-full" placeholder="e.g. Everyday elegance" />
                </div>

                <div className="p-4 bg-[#1a1815] border border-[rgba(200,169,110,0.1)] space-y-4">
                  <h3 className="text-xs font-serif text-[#c8a96e] uppercase tracking-widest">UI Display Options (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Cursor Title</label>
                      <input type="text" value={form.cursorTitle} onChange={(e) => setForm({ ...form, cursorTitle: e.target.value })} className="input-field w-full" placeholder="e.g. Boss Mode 💼" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Cursor Subtitle</label>
                      <input type="text" value={form.cursorSubtitle} onChange={(e) => setForm({ ...form, cursorSubtitle: e.target.value })} className="input-field w-full" placeholder="e.g. Slay all day" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Icon Name (React Icons)</label>
                    <input type="text" value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })} className="input-field w-full" placeholder="e.g. MdOutlineShoppingBag" />
                  </div>
                </div>

              </form>
            </div>
            <div className="p-4 border-t border-[rgba(200,169,110,0.1)] flex justify-end gap-3 bg-[#1a1815]">
              <button onClick={() => setShowModal(false)} className="btn-outline px-6 py-2">Cancel</button>
              <button form="category-form" type="submit" disabled={loading} className="btn-primary px-6 py-2 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
