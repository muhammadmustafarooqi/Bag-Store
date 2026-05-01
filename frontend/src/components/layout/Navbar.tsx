'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=handbag', label: 'Handbags' },
  { href: '/shop?category=backpack', label: 'Backpacks' },
  { href: '/shop?category=laptop+bag', label: 'Laptop Bags' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0f0e0c]/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-3xl font-bold tracking-widest text-[#c8a96e] group-hover:text-[#e8c98a] transition-colors duration-300"
            >
              KAARVAN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active text-[#f0e4ce]' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#7a6a54] hover:text-[#f0e4ce] transition-colors"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Wishlist */}
            <Link href="/account?tab=wishlist" className="p-2 text-[#7a6a54] hover:text-[#f0e4ce] transition-colors" aria-label="Wishlist">
              <FiHeart size={20} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-[#7a6a54] hover:text-[#f0e4ce] transition-colors" aria-label="Cart">
              <FiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-[#c8a96e] text-[#0f0e0c]">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={isAuthenticated ? '/account' : '/auth/login'}
              className="p-2 text-[#7a6a54] hover:text-[#f0e4ce] transition-colors"
              aria-label="Account"
            >
              <FiUser size={20} />
            </Link>

            {/* Admin */}
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="hidden md:block btn-outline text-xs py-2 px-4">
                Admin
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#7a6a54] hover:text-[#f0e4ce] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fadeIn">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags, backpacks, wallets..."
                className="input-field flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary px-4 py-3">
                <FiSearch size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-[rgba(200,169,110,0.15)] animate-fadeIn">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium uppercase tracking-wider text-[#7a6a54] hover:text-[#f0e4ce] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
