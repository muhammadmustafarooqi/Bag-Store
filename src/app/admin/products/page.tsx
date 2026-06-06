'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) params.set('search', search);
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setDeleteId(null);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Products</h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>{data?.pagination?.total || 0} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6a54' }} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-9 w-full max-w-sm"
        />
      </div>

      {/* Table */}
      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-10 skeleton" /></td></tr>
                ))
              : data?.data?.map((p: any) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }}
                    className="hover:bg-[rgba(200,169,110,0.03)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          {p.images[0] ? (
                            <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center text-xl" style={{ background: '#221f1b' }}>👜</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold line-clamp-1" style={{ color: '#f0e4ce' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: '#7a6a54' }}>{p.sku || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize" style={{ color: '#7a6a54' }}>{p.category}</td>
                    <td className="px-4 py-3 text-sm">
                      <span style={{ color: '#c8a96e' }}>{formatCurrency(p.onSale ? p.salePrice : p.price)}</span>
                      {p.onSale && (
                        <span className="ml-1 text-xs line-through" style={{ color: '#7a6a54' }}>{formatCurrency(p.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span style={{ color: p.stock === 0 ? '#8b1a1a' : p.stock <= 5 ? '#c8a96e' : '#2d6a4f' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: p.isFeatured ? '#c8a96e' : '#3a3228' }}>
                      {p.isFeatured ? '★ Yes' : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${p._id}/edit`}
                          className="p-1.5 hover:text-[#c8a96e] transition-colors" style={{ color: '#7a6a54' }}>
                          <FiEdit2 size={14} />
                        </Link>
                        <button onClick={() => setDeleteId(p._id)}
                          className="p-1.5 hover:text-red-400 transition-colors" style={{ color: '#7a6a54' }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="p-8 max-w-sm w-full mx-4" style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.2)' }}>
            <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }} className="mb-3">
              Delete Product?
            </h3>
            <p className="text-sm mb-6" style={{ color: '#7a6a54' }}>
              This will permanently delete the product and its images from Cloudinary.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 text-sm font-semibold uppercase tracking-wider bg-red-900 text-red-200 hover:bg-red-800 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-outline py-3 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
