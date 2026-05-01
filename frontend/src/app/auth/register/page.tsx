'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!/^03\d{9}$/.test(form.phone)) {
      toast.error('Phone must be Pakistani format: 03XXXXXXXXX');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      await login({ email: form.email, password: form.password });
      toast.success('Account created! Welcome to KAARVAN.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4" style={{ background: '#0f0e0c' }}>
      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <Link href="/">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#c8a96e', letterSpacing: '0.2em' }}>
              KAARVAN
            </span>
          </Link>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#f0e4ce' }} className="mt-4">
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8"
          style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Muhammad Ali' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Phone Number (03XXXXXXXXX)', key: 'phone', type: 'tel', placeholder: '03001234567' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Confirm Password', key: 'confirmPassword', type: 'password', placeholder: '••••••••' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="input-field w-full"
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm" style={{ color: '#7a6a54' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#c8a96e' }}>Sign in →</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
