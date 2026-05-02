'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4" style={{ background: '#0a0907' }}>
      <div className="w-full max-w-md animate-scaleIn relative z-10">
        <div className="absolute inset-0 bg-[#c8a96e] blur-[150px] opacity-10 rounded-full -z-10" />
        
        <div className="text-center mb-10">
          <Link href="/">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#c8a96e', letterSpacing: '0.2em' }}>
              KAARVAN
            </span>
          </Link>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', color: '#f0e4ce' }} className="mt-4 mb-2 font-light">
            Reset Password
          </h1>
          <p className="text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>Enter your email to receive a reset link</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6 p-10 rounded-sm"
            style={{ 
              background: 'linear-gradient(145deg, #161412, #1a1815)', 
              border: '1px solid rgba(200,169,110,0.1)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
            }}>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.1em] mb-2" style={{ color: '#c8a96e' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54]"
                required
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 mt-4 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 disabled:opacity-50 hover:-translate-y-1" style={{ background: '#c8a96e', color: '#0f0e0c' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-xs mt-6 uppercase tracking-wider" style={{ color: '#7a6a54' }}>
              Remembered your password?{' '}
              <Link href="/auth/login" style={{ color: '#c8a96e' }} className="hover:underline">Sign in</Link>
            </p>
          </form>
        ) : (
          <div className="p-10 text-center rounded-sm"
            style={{ 
              background: 'linear-gradient(145deg, #161412, #1a1815)', 
              border: '1px solid rgba(200,169,110,0.1)'
            }}>
            <p className="text-[#f0e4ce] mb-8 font-light uppercase tracking-widest text-xs">
              A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Link href="/auth/login" className="inline-block w-full py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 hover:-translate-y-1" 
              style={{ background: '#c8a96e', color: '#0f0e0c' }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
