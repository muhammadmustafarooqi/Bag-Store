'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset successfully!');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0907' }}>
        <div className="text-center">
          <h1 className="text-2xl text-[#f0e4ce] mb-4 font-serif">Invalid Reset Link</h1>
          <Link href="/auth/login" className="text-[#c8a96e] hover:underline uppercase tracking-widest text-xs">Back to Login</Link>
        </div>
      </div>
    );
  }

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
            New Password
          </h1>
          <p className="text-xs uppercase tracking-widest" style={{ color: '#7a6a54' }}>Set a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-10 rounded-sm"
          style={{ 
            background: 'linear-gradient(145deg, #161412, #1a1815)', 
            border: '1px solid rgba(200,169,110,0.1)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
          }}>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.1em] mb-2" style={{ color: '#c8a96e' }}>New Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54] pr-10"
                required
                placeholder="Enter new password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors hover:text-[#c8a96e]" style={{ color: '#7a6a54' }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.1em] mb-2" style={{ color: '#c8a96e' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[rgba(200,169,110,0.2)] text-[#f0e4ce] py-2 focus:outline-none focus:border-[#c8a96e] transition-colors font-light placeholder:text-[#7a6a54]"
              required
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-4 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 disabled:opacity-50 hover:-translate-y-1" style={{ background: '#c8a96e', color: '#0f0e0c' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
