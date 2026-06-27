'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

type VaultStatus = 'loading' | 'locked' | 'ready' | 'opened';

export function MysteryVault() {
  const { user, isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<VaultStatus>('loading');
  const [prizeName, setPrizeName] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      if (!isAuthenticated) {
        setStatus('locked');
        return;
      }
      try {
        const { data } = await api.get('/users/vault/status');
        if (data.success) {
          if (data.data.hasOpenedVault) {
            setStatus('opened');
            setPrizeName(data.data.vaultPrize);
            if (data.data.coupon) {
              setCouponCode(data.data.coupon.code);
              setExpiresAt(new Date(data.data.coupon.expiresAt));
            }
          } else {
            setStatus('ready');
          }
        } else {
          setStatus('locked'); // fallback
        }
      } catch (err) {
        console.error('Failed to fetch vault status', err);
        setStatus('locked');
      }
    }
    fetchStatus();
  }, [isAuthenticated]);

  const handleOpenVault = async () => {
    if (status !== 'ready' || isAnimating) return;
    
    setIsAnimating(true);
    
    // Play interaction animation before making the API call (or concurrently)
    try {
      const { data } = await api.post('/users/vault/open');
      
      if (data.success) {
        setPrizeName(data.data.prizeName);
        setCouponCode(data.data.couponCode);
        setExpiresAt(new Date(data.data.expiresAt));
        
        // Wait for animation to finish
        setTimeout(() => {
          setStatus('opened');
          setIsAnimating(false);
        }, 1500); // match animation duration
      } else {
        setError(data.message);
        setIsAnimating(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while opening the vault.');
      setIsAnimating(false);
    }
  };

  const copyToClipboard = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === 'loading') {
    return (
      <section className="py-16 bg-bg-secondary flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">The Mystery Vault</h2>
          <p className="text-muted font-sans max-w-xl mx-auto">
            Unlock the vault to reveal an exclusive reward for your next purchase.
          </p>
        </div>

        <div className="relative max-w-md mx-auto bg-bg-card border border-gold/30 rounded-lg p-8 shadow-2xl shadow-gold/5 flex flex-col items-center">
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-kaarvan-red/10 border border-kaarvan-red/50 text-kaarvan-red p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {status === 'locked' && (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center w-full"
              >
                {/* Vault Graphic */}
                <div className="w-32 h-32 mb-6 border-4 border-muted/30 rounded-full flex items-center justify-center bg-bg-primary">
                  <div className="w-12 h-3 bg-muted/50 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-serif text-cream mb-2">Vault Locked</h3>
                <p className="text-muted text-sm text-center mb-6">
                  Sign in or create an account to unlock your mystery reward.
                </p>
                <Link href="/auth/login" className="bg-gold text-bg-primary px-8 py-3 rounded hover:bg-gold-light transition font-semibold">
                  Sign In to Unlock
                </Link>
              </motion.div>
            )}

            {status === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center w-full"
              >
                <div className="relative mb-8 cursor-pointer group" onClick={handleOpenVault}>
                  {/* Outer Vault Border */}
                  <div className={`w-40 h-40 border-4 border-gold rounded-full flex items-center justify-center bg-bg-primary shadow-[0_0_20px_rgba(200,169,110,0.2)] transition-transform duration-300 ${isAnimating ? '' : 'group-hover:scale-105'}`}>
                    {/* Vault Dial */}
                    <motion.div 
                      className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-inner"
                      animate={isAnimating ? { rotate: [0, 90, 180, 270, 360, 450, 540] } : {}}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                      <div className="w-4 h-4 bg-bg-card rounded-full absolute top-2"></div>
                      <div className="w-8 h-8 bg-bg-primary/20 rounded-full"></div>
                    </motion.div>
                  </div>
                  {!isAnimating && (
                    <div className="absolute -inset-2 rounded-full border border-gold/50 animate-ping opacity-20"></div>
                  )}
                </div>
                
                <h3 className="text-xl font-serif text-gold mb-2">
                  {isAnimating ? 'Unlocking...' : 'Click to Open'}
                </h3>
              </motion.div>
            )}

            {status === 'opened' && (
              <motion.div
                key="opened"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-full relative"
              >
                <div className="absolute inset-0 bg-gold/5 rounded-lg -z-10 animate-pulse"></div>
                
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto bg-bg-primary border border-gold/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>

                <h3 className="text-sm font-sans text-gold-light tracking-widest uppercase mb-1">You Unlocked</h3>
                <div className="text-3xl font-serif text-cream mb-6 text-center animate-shimmer relative overflow-hidden bg-clip-text text-transparent bg-[linear-gradient(110deg,#f0e4ce,45%,#fff,55%,#f0e4ce)] bg-[length:200%_100%]">
                  {prizeName}
                </div>

                {couponCode ? (
                  <div className="w-full bg-bg-primary rounded p-4 mb-4 border border-gold/20 flex flex-col items-center">
                    <span className="text-xs text-muted mb-2">Your Coupon Code</span>
                    <div className="flex items-center gap-3">
                      <code className="text-xl text-gold font-sans bg-bg-secondary px-3 py-1 rounded">
                        {couponCode}
                      </code>
                      <button 
                        onClick={copyToClipboard}
                        className="text-muted hover:text-cream transition"
                        title="Copy Code"
                      >
                        {copied ? (
                          <svg className="w-5 h-5 text-kaarvan-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted text-sm mb-4">No active coupon found.</div>
                )}
                
                {expiresAt && (
                  <p className="text-xs text-muted">
                    Expires on {expiresAt.toLocaleDateString()} at {expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => setStatus('ready')}
                    className="mt-6 text-xs text-muted hover:text-gold transition underline"
                  >
                    Reset Vault (Admin)
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
