'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FiGrid, FiShoppingBag, FiPackage, FiUsers, FiTag, FiLogOut, FiX, FiMenu, FiTrendingUp } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, mounted]);

  if (!mounted || !isAuthenticated || user?.role !== 'admin') return null;

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { href: '/admin/analytics', label: 'Analytics', icon: <FiTrendingUp size={18} /> },
    { href: '/admin/products', label: 'Products', icon: <FiShoppingBag size={18} /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiPackage size={18} /> },
    { href: '/admin/customers', label: 'Customers', icon: <FiUsers size={18} /> },
    { href: '/admin/coupons', label: 'Coupons', icon: <FiTag size={18} /> },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0908' }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#0f0e0c', borderRight: '1px solid rgba(200,169,110,0.1)' }}
      >
        <div className="p-6 mb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
          <div>
            <Link href="/">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#c8a96e', letterSpacing: '0.15em' }}>
                KAARVAN
              </span>
            </Link>
            <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#7a6a54' }}>Admin Panel</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-[#7a6a54]">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm transition-all group hover:bg-[rgba(200,169,110,0.05)]"
                style={{
                  color: isActive ? '#c8a96e' : '#7a6a54',
                  background: isActive ? 'rgba(200,169,110,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #c8a96e' : '2px solid transparent',
                }}
              >
                <span style={{ color: isActive ? '#c8a96e' : 'inherit' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[rgba(200,169,110,0.1)] bg-[#0f0e0c]">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#c8a96e]">
            <FiMenu size={24} />
          </button>
          <span className="text-sm font-serif text-[#c8a96e]" style={{ fontFamily: "'Space Mono', monospace" }}>
            KAARVAN ADMIN
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>
        {children}
      </main>
    </div>
  );
}
