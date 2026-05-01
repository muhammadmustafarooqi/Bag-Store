'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FiGrid, FiShoppingBag, FiPackage, FiUsers, FiTag, FiLogOut, FiBarChart2 } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { href: '/admin/products', label: 'Products', icon: <FiShoppingBag size={18} /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiPackage size={18} /> },
    { href: '/admin/customers', label: 'Customers', icon: <FiUsers size={18} /> },
    { href: '/admin/coupons', label: 'Coupons', icon: <FiTag size={18} /> },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0908' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: '#0f0e0c', borderRight: '1px solid rgba(200,169,110,0.1)' }}>
        <div className="p-6 mb-4" style={{ borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
          <Link href="/">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#c8a96e', letterSpacing: '0.15em' }}>
              KAARVAN
            </span>
          </Link>
          <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#7a6a54' }}>Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-none transition-all group"
              style={{ color: '#7a6a54' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f0e4ce'; e.currentTarget.style.background = 'rgba(200,169,110,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#7a6a54'; e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="group-hover:text-[#c8a96e] transition-colors">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
