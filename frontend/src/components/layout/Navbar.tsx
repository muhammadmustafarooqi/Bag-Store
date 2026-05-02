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

        {/* Premium Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-0 bg-[#0a0907]/95 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn shadow-lg shadow-black/50 border-b border-[rgba(200,169,110,0.1)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-4 h-20">
              <FiSearch className="text-[#c8a96e] text-2xl hidden sm:block" />
              <form onSubmit={handleSearch} className="flex-1 flex h-full items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collections, bags, wallets..."
                  className="w-full h-full bg-transparent border-none outline-none text-2xl sm:text-3xl text-[#f0e4ce] placeholder-[#7a6a54] font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  autoFocus
                />
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#7a6a54] hover:text-[#c8a96e] transition-transform duration-300 hover:rotate-90"
              >
                <FiX size={32} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile Side Drawer */}
        <div 
          className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[80%] bg-[#0a0908] border-l border-[rgba(200,169,110,0.1)] transition-transform duration-300 ease-in-out md:hidden ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-end mb-8">
              <button onClick={() => setMenuOpen(false)} className="p-2 text-[#7a6a54]">
                <FiX size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mb-auto">
              <p className="text-[10px] uppercase tracking-widest text-[#7a6a54] mb-2">Shop Categories</p>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-serif text-[#f0e4ce] hover:text-[#c8a96e] transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-8 border-t border-[rgba(200,169,110,0.1)]">
              <Link 
                href={isAuthenticated ? '/account' : '/auth/login'}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-[#f0e4ce] mb-6"
              >
                <FiUser size={20} className="text-[#c8a96e]" />
                <span>{isAuthenticated ? 'My Account' : 'Login / Register'}</span>
              </Link>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-[rgba(200,169,110,0.05)] text-[#c8a96e] rounded-full"><FiHeart size={18} /></a>
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="p-2 bg-[rgba(200,169,110,0.05)] text-[#c8a96e] rounded-full relative">
                  <FiShoppingBag size={18} />
                  {itemCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c8a96e] text-[#0f0e0c] text-[10px] rounded-full flex items-center justify-center font-bold">{itemCount}</span>}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
