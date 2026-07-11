'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    freeShippingThreshold: 2000,
    shippingFee: 200,
    whatsappNumber: '',
    whatsappConfirmTemplate: '',
    whatsappCustomerTemplate: '',
    storeName: '',
    contactEmail: '',
  });

  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings');
      return data.data;
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        freeShippingThreshold: settings.freeShippingThreshold || 2000,
        shippingFee: settings.shippingFee || 200,
        whatsappNumber: settings.whatsappNumber || '',
        whatsappConfirmTemplate: settings.whatsappConfirmTemplate || '',
        whatsappCustomerTemplate: settings.whatsappCustomerTemplate || '',
        storeName: settings.storeName || '',
        contactEmail: settings.contactEmail || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/settings', form);
      toast.success('Settings updated successfully!');
      refetch();
    } catch (err: any) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-[#c8a96e]">Loading settings...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }}>Global Settings</h1>
        <p className="text-sm" style={{ color: '#7a6a54' }}>Configure store-wide variables and thresholds</p>
      </div>

      <div style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }} className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Store Name</label>
              <input type="text" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="input-field w-full" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="input-field w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Shipping Fee (Rs)</label>
              <input type="number" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: parseInt(e.target.value) })}
                className="input-field w-full" min="0" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Free Shipping Threshold (Rs)</label>
              <input type="number" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: parseInt(e.target.value) })}
                className="input-field w-full" min="0" required />
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>WhatsApp Support Number</label>
            <input type="text" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="input-field w-full" placeholder="e.g. 923001234567" />
            <p className="text-xs mt-2" style={{ color: '#a08060' }}>Include country code without '+'. This powers all WhatsApp buttons across the site.</p>
          </div>

          <div className="pt-4 mt-6" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>"Confirm Order" Message Template</label>
            <textarea value={form.whatsappConfirmTemplate} onChange={(e) => setForm({ ...form, whatsappConfirmTemplate: e.target.value })}
              className="input-field w-full h-32 py-3" />
            <p className="text-xs mt-2" style={{ color: '#a08060' }}>Available variables: {'{{customerName}}'}, {'{{orderId}}'}, {'{{total}}'}, {'{{products}}'}</p>
          </div>

          <div className="pt-4 mt-6" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>"Customer Chat" Message Template</label>
            <textarea value={form.whatsappCustomerTemplate} onChange={(e) => setForm({ ...form, whatsappCustomerTemplate: e.target.value })}
              className="input-field w-full h-32 py-3" />
            <p className="text-xs mt-2" style={{ color: '#a08060' }}>Available variables: {'{{customerName}}'}, {'{{orderId}}'}, {'{{orderStatus}}'}, {'{{total}}'}, {'{{trackingUrl}}'}</p>
          </div>

          <div className="pt-6 mt-6" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
