'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function NewProductPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', shortDescription: '', description: '',
    category: 'handbag', brand: 'KAARVAN', sku: '',
    price: '', salePrice: '', onSale: false,
    stock: '', colors: '', material: '', dimensions: '', weight: '',
    isFeatured: false, isNew: true, tags: '',
  });

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 10));
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      images.forEach((img) => fd.append('images', img));
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));

      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product created!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#f0e4ce' }}>Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#c8a96e' }}>Product Images</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: '#8b1a1a', color: '#fff' }}>
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center gap-2 transition-colors hover:border-[#c8a96e]"
                  style={{ border: '2px dashed rgba(200,169,110,0.3)', color: '#7a6a54' }}
                >
                  <FiUpload size={20} />
                  <span className="text-xs">Upload</span>
                </button>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
              <p className="text-xs" style={{ color: '#7a6a54' }}>Upload up to 10 images. First image is the main image.</p>
            </div>

            {/* Basic Info */}
            <div className="p-6 space-y-4" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c8a96e' }}>Basic Information</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field w-full" required placeholder="e.g. Luxe Leather Handbag" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Short Description</label>
                <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="input-field w-full" placeholder="One line summary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Full Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field w-full resize-none" rows={5} required placeholder="Detailed product description..." />
              </div>
            </div>

            {/* Pricing */}
            <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#c8a96e' }}>Pricing & Stock</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Price (Rs) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-field w-full" required min="0" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Stock Quantity *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input-field w-full" required min="0" />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.onSale} onChange={(e) => setForm({ ...form, onSale: e.target.checked })}
                    className="accent-[#c8a96e]" />
                  <span className="text-sm" style={{ color: '#7a6a54' }}>On Sale</span>
                </label>
              </div>
              {form.onSale && (
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Sale Price (Rs)</label>
                  <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    className="input-field w-full" min="0" />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Fields */}
          <div className="space-y-6">
            <div className="p-6 space-y-4" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest" style={{ color: '#c8a96e' }}>Organisation</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field w-full">
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {[
                { label: 'Brand', key: 'brand' },
                { label: 'SKU', key: 'sku' },
                { label: 'Colors (comma separated)', key: 'colors' },
                { label: 'Material', key: 'material' },
                { label: 'Dimensions', key: 'dimensions' },
                { label: 'Weight', key: 'weight' },
                { label: 'Tags (comma separated)', key: 'tags' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>{f.label}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="input-field w-full text-sm" />
                </div>
              ))}
            </div>

            <div className="p-6 space-y-3" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c8a96e' }}>Visibility</h3>
              {[
                { label: 'Featured Product', key: 'isFeatured' },
                { label: 'New Arrival', key: 'isNew' },
              ].map((f) => (
                <label key={f.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} className="accent-[#c8a96e]" />
                  <span className="text-sm" style={{ color: '#7a6a54' }}>{f.label}</span>
                </label>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60">
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
