'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { FiSearch, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/customers?${params}`);
      return data;
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Customers</h1>
        <p className="text-sm" style={{ color: '#7a6a54' }}>{data?.pagination?.total || 0} registered users</p>
      </div>

      <div className="relative mb-6">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6a54' }} />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-9 w-full max-w-sm"
        />
      </div>

      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
              {['Customer', 'Contact', 'Orders', 'Joined Date'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={4} className="px-4 py-4"><div className="h-10 skeleton" /></td></tr>
                ))
              : data?.data?.map((customer: any) => (
                  <tr key={customer._id} style={{ borderBottom: '1px solid rgba(200,169,110,0.05)' }}
                    className="hover:bg-[rgba(200,169,110,0.02)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: '#c8a96e', color: '#0f0e0c' }}>
                          {customer.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#f0e4ce' }}>{customer.name}</p>
                          <span className={`text-[10px] uppercase tracking-tighter px-1.5 py-0.5 rounded ${customer.role === 'admin' ? 'bg-[#c8a96e] text-[#0f0e0c]' : 'bg-[#221f1b] text-[#7a6a54]'}`}>
                            {customer.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <p className="flex items-center gap-2" style={{ color: '#f0e4ce' }}>
                          <FiMail size={12} className="text-[#c8a96e]" /> {customer.email}
                        </p>
                        <p className="flex items-center gap-2" style={{ color: '#7a6a54' }}>
                          <FiPhone size={12} /> {customer.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#f0e4ce' }}>
                      {customer.orderCount || 0} orders
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#7a6a54' }}>
                      {new Date(customer.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

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
