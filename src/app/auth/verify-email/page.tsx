'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch (err) {
        setStatus('error');
        toast.error('Verification failed. The link may be expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0907' }}>
      <div className="w-full max-w-md text-center p-10 rounded-sm relative z-10"
        style={{ 
          background: 'linear-gradient(145deg, #161412, #1a1815)', 
          border: '1px solid rgba(200,169,110,0.1)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
        }}>
        <div className="absolute inset-0 bg-[#c8a96e] blur-[150px] opacity-10 rounded-full -z-10" />
        
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: '2.5rem', color: '#f0e4ce' }} className="mb-6 font-light">
          {status === 'loading' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified'}
          {status === 'error' && 'Verification Failed'}
        </h1>

        {status === 'success' && (
          <p className="text-[#7a6a54] mb-8 uppercase tracking-widest text-xs">
            Your account is now ready. You can sign in to start shopping.
          </p>
        )}

        {status === 'error' && (
          <p className="text-[#7a6a54] mb-8 uppercase tracking-widest text-xs">
            The verification link is invalid or has expired. Please try registering again.
          </p>
        )}

        <Link href="/auth/login" className="inline-block w-full py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 hover:-translate-y-1" 
          style={{ background: '#c8a96e', color: '#0f0e0c' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
