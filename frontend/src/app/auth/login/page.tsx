'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#f0e4ce' }} className="mt-4 mb-1">
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: '#7a6a54' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8"
          style={{ background: '#1a1815', border: '1px solid rgba(200,169,110,0.15)' }}>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field w-full"
              required
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: '#7a6a54' }}>Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field w-full pr-10"
                required
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6a54' }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm" style={{ color: '#7a6a54' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: '#c8a96e' }}>Create one →</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
