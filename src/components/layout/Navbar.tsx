'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Image from 'next/image';
import { formatCurrency } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=Handbag', label: 'Handbags' },
  { href: '/shop?category=Backpack', label: 'Backpacks' },
  { href: '/shop?category=Laptop%20Bag', label: 'Laptop Bags' },
  { href: '/track-order', label: 'Track Order' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchResults(data.data || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0f0e0c]/85 backdrop-blur-xl shadow-lg shadow-black/50 border-b border-[rgba(200,169,110,0.1)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-24'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              style={{ fontFamily: "'Space Mono', monospace" }}
              className="text-3xl font-bold tracking-widest text-[#c8a96e] group-hover:text-[#e8c98a] transition-colors duration-300"
            >
              KAARVAN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
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
          <div className="flex items-center gap-1 sm:gap-4">
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
              className="lg:hidden p-2 text-[#7a6a54] hover:text-[#f0e4ce] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Premium Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-0 bg-[#0a0907]/95 backdrop-blur-md z-50 flex flex-col items-center pt-8 px-4 sm:px-6 lg:px-8 h-screen animate-fadeIn">
            <div className="w-full max-w-4xl flex items-center gap-4 border-b border-[rgba(200,169,110,0.3)] pb-4 relative">
              <FiSearch className="text-[#c8a96e] text-2xl hidden sm:block" />
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collections, bags, wallets..."
                  className="w-full bg-transparent border-none outline-none text-2xl sm:text-4xl text-[#f0e4ce] placeholder-[#7a6a54] font-light"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  autoFocus
                />
              </form>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                className="p-2 text-[#7a6a54] hover:text-[#c8a96e] transition-transform duration-300 hover:rotate-90 absolute right-0"
              >
                <FiX size={32} />
              </button>
            </div>

            {/* Live Search Results */}
            {searchQuery.trim() && (
              <div className="w-full max-w-4xl mt-8 overflow-y-auto max-h-[70vh]">
                <p className="text-xs uppercase tracking-widest text-[#7a6a54] mb-4">
                  {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
                </p>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {searchResults.map((product: any) => (
                      <div 
                        key={product._id} 
                        onClick={() => {
                          setSearchOpen(false);
                          router.push(`/shop/${product.slug}`);
                        }}
                        className="flex gap-4 p-4 border border-[rgba(200,169,110,0.1)] hover:border-[#c8a96e] bg-[#1a1815] cursor-pointer transition-colors group"
                      >
                        <div className="w-20 h-24 relative flex-shrink-0 bg-[#0f0e0c]">
                          <Image
                            src={product.images[0]?.url || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-xs uppercase text-[#7a6a54] tracking-widest mb-1">{product.category}</p>
                          <p className="font-semibold text-sm text-[#f0e4ce] line-clamp-2 leading-snug group-hover:text-[#c8a96e] transition-colors">{product.name}</p>
                          <p className="text-[#c8a96e] font-serif mt-2">{formatCurrency(product.onSale && product.salePrice ? product.salePrice : product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !isSearching && (
                  <p className="text-[#7a6a54] text-sm">No products found.</p>
                )}
                {searchResults.length > 0 && (
                  <button 
                    onClick={handleSearch}
                    className="mt-8 text-sm uppercase tracking-widest text-[#c8a96e] hover:text-[#e8c98a] border-b border-current pb-1"
                  >
                    View all results →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile Side Drawer */}
        <div 
          className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[80%] bg-[#0f0e0c] shadow-2xl border-l border-[rgba(200,169,110,0.2)] transition-transform duration-300 ease-in-out lg:hidden ${
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
                  style={{ fontFamily: "'Space Mono', monospace" }}
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
