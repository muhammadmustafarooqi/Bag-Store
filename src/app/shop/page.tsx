'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { PRODUCT_CATEGORIES, formatCurrency } from '@/lib/constants';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const COLORS = ['Black', 'Brown', 'Tan', 'Navy', 'Beige', 'White', 'Red', 'Olive', 'Burgundy'];

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: (searchParams.get('category') || '').toLowerCase(),
    minPrice: '',
    maxPrice: '',
    color: '',
    sort: searchParams.get('sort') || '-createdAt',
    search: searchParams.get('search') || '',
    isNewArrival: searchParams.get('isNewArrival') === 'true',
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: (searchParams.get('category') || '').toLowerCase(),
      search: searchParams.get('search') || '',
      isNewArrival: searchParams.get('isNewArrival') === 'true',
      sort: searchParams.get('sort') || prev.sort,
    }));
  }, [searchParams]);

  const { data, isLoading } = useProducts(filters);

  const updateFilter = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', color: '', sort: '-createdAt', search: '', isNewArrival: false, page: 1, limit: 12 });
  };

  const activeFilterCount = [filters.category, filters.color, filters.minPrice, filters.maxPrice, filters.isNewArrival ? 'new' : '']
    .filter(Boolean).length;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#0f0e0c' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="section-subtitle mb-2">Our Collection</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="section-title">
              {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}s` : 'All Bags'}
            </h1>
            <p className="text-sm" style={{ color: '#7a6a54' }}>
              {data?.pagination?.total || 0} products
            </p>
          </div>
        </div>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search bags..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="input-field w-full sm:w-48"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 btn-outline py-3 px-4 text-sm relative md:hidden"
          >
            <FiFilter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#c8a96e', color: '#0f0e0c' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.category && (
              <button onClick={() => updateFilter('category', '')}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                style={{ background: 'rgba(200,169,110,0.15)', color: '#c8a96e', border: '1px solid rgba(200,169,110,0.3)' }}>
                {filters.category} <FiX size={12} />
              </button>
            )}
            {filters.color && (
              <button onClick={() => updateFilter('color', '')}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                style={{ background: 'rgba(200,169,110,0.15)', color: '#c8a96e', border: '1px solid rgba(200,169,110,0.3)' }}>
                {filters.color} <FiX size={12} />
              </button>
            )}
            {filters.isNewArrival && (
              <button onClick={() => updateFilter('isNewArrival', '')}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                style={{ background: 'rgba(200,169,110,0.15)', color: '#c8a96e', border: '1px solid rgba(200,169,110,0.3)' }}>
                New Arrivals <FiX size={12} />
              </button>
            )}
            <button onClick={clearFilters} className="text-xs px-3 py-1" style={{ color: '#7a6a54' }}>
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <FilterPanel filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] skeleton" />
                ))}
              </div>
            ) : data?.data?.length ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {data.data.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {/* Pagination */}
                {data.pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(data.pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
                        className={`w-10 h-10 text-sm font-medium transition-all ${
                          filters.page === i + 1
                            ? 'bg-[#c8a96e] text-[#0f0e0c]'
                            : 'text-[#7a6a54] hover:text-[#f0e4ce]'
                        }`}
                        style={{ border: '1px solid rgba(200,169,110,0.2)' }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <p style={{ color: '#7a6a54', fontFamily: "'Space Mono', monospace", fontSize: '1.5rem' }}>
                  No products found
                </p>
                <button onClick={clearFilters} className="btn-outline mt-4 text-sm">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 overflow-y-auto p-6"
            style={{ background: '#1a1815', borderLeft: '1px solid rgba(200,169,110,0.15)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.5rem', color: '#f0e4ce' }}>Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><FiX size={20} style={{ color: '#7a6a54' }} /></button>
            </div>
            <FilterPanel filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({ filters, updateFilter, clearFilters }: any) {
  return (
    <>
      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#c8a96e' }}>
          Category
        </h4>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                className="relative flex items-center justify-center w-4 h-4 transition-all duration-300"
                style={{
                  border: `1px solid ${filters.category === cat ? '#c8a96e' : 'rgba(200,169,110,0.3)'}`,
                  background: filters.category === cat ? 'rgba(200,169,110,0.1)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => updateFilter('category', cat === filters.category ? '' : cat)}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                {filters.category === cat && (
                  <div className="w-2 h-2 bg-[#c8a96e]" />
                )}
              </div>
              <span className="text-sm capitalize group-hover:text-[#c8a96e] transition-colors"
                style={{ color: filters.category === cat ? '#c8a96e' : '#7a6a54' }}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#c8a96e' }}>
          Price Range (PKR)
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="input-field w-full text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-field w-full text-sm"
          />
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#c8a96e' }}>
          Color
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => updateFilter('color', c === filters.color ? '' : c)}
              className="px-3 py-1 text-xs rounded-full transition-all"
              style={{
                background: filters.color === c ? 'rgba(200,169,110,0.2)' : 'transparent',
                border: `1px solid ${filters.color === c ? '#c8a96e' : 'rgba(200,169,110,0.2)'}`,
                color: filters.color === c ? '#c8a96e' : '#7a6a54',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button onClick={clearFilters} className="w-full btn-outline text-sm py-2">
        Clear All Filters
      </button>
    </>
  );
}


export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
