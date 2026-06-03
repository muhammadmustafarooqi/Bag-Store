'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: productData, isLoading: fetchLoading } = useProduct(params.id);
  
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string, publicId: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', shortDescription: '', description: '',
    category: 'handbag', brand: 'KAARVAN', sku: '',
    price: '', salePrice: '', onSale: false,
    stock: '', colors: '', material: '', dimensions: '', weight: '',
    isFeatured: false, isNew: false, tags: '',
  });

  useEffect(() => {
    if (productData?.data) {
      const p = productData.data;
      setForm({
        name: p.name || '',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        category: p.category || 'handbag',
        brand: p.brand || 'KAARVAN',
        sku: p.sku || '',
        price: String(p.price || ''),
        salePrice: String(p.salePrice || ''),
        onSale: p.onSale || false,
        stock: String(p.stock || ''),
        colors: p.colors?.join(', ') || '',
        material: p.material || '',
        dimensions: p.dimensions || '',
        weight: p.weight || '',
        isFeatured: p.isFeatured || false,
        isNew: p.isNew || false,
        tags: p.tags?.join(', ') || '',
      });
      setExistingImages(p.images || []);
    }
  }, [productData]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 10 - existingImages.length));
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeNewImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (publicId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      images.forEach((img) => fd.append('images', img));
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append('existingImages', JSON.stringify(existingImages));

      await api.put(`/products/${params.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product updated!');
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="p-8"><div className="h-10 w-48 skeleton mb-8" /><div className="h-96 skeleton" /></div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-[rgba(200,169,110,0.1)] transition-colors" style={{ color: '#c8a96e' }}>
          <FiArrowLeft size={20} />
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#f0e4ce' }}>Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#c8a96e' }}>Product Images</h3>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {existingImages.map((img) => (
                  <div key={img.publicId} className="relative aspect-square">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(img.publicId)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: '#8b1a1a', color: '#fff' }}>
                      <FiX size={10} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-center text-white py-0.5">Existing</div>
                  </div>
                ))}
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: '#8b1a1a', color: '#fff' }}>
                      <FiX size={10} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-900/50 text-[8px] text-center text-white py-0.5">New</div>
                  </div>
                ))}
                {existingImages.length + previews.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center gap-2 transition-colors hover:border-[#c8a96e]"
                    style={{ border: '2px dashed rgba(200,169,110,0.3)', color: '#7a6a54' }}
                  >
                    <FiUpload size={20} />
                    <span className="text-xs">Upload</span>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
            </div>

            <div className="p-6 space-y-4" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
              <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: '#c8a96e' }}>Basic Information</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field w-full" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Full Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field w-full resize-none" rows={5} required />
              </div>
            </div>
          </div>

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
                { label: 'Price (Rs) *', key: 'price' },
                { label: 'Stock *', key: 'stock' },
                { label: 'Colors', key: 'colors' },
                { label: 'Tags', key: 'tags' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>{f.label}</label>
                  <input type={f.key === 'price' || f.key === 'stock' ? 'number' : 'text'} 
                    value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="input-field w-full" required={f.key.includes('*')} />
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60">
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
