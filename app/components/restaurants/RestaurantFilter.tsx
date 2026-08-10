'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';

interface FilterOptions {
  cuisine: string;
  priceLevel: string;
  dietary: string;
  sort: string;
}

const cuisines = ['All', 'Alpine Swiss', 'Fine French Seafood', 'Traditional Sushi', 'Classic French Haute', 'Northwest Indian BBQ', 'Modern Indonesian', 'Indonesian BBQ', 'Hakata Tonkotsu Ramen', 'Classic Kosher Deli', 'Breton Galettes'];
const priceLevels = ['All', '$', '$$', '$$$', '$$$$'];
const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];
const sortOptions = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Popular' },
];

export default function RestaurantFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: searchParams.get('cuisine') || 'All',
    priceLevel: searchParams.get('price') || 'All',
    dietary: searchParams.get('dietary') || 'All',
    sort: searchParams.get('sort') || 'rating',
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.cuisine !== 'All') params.set('cuisine', filters.cuisine);
    if (filters.priceLevel !== 'All') params.set('price', filters.priceLevel);
    if (filters.dietary !== 'All') params.set('dietary', filters.dietary);
    if (filters.sort !== 'rating') params.set('sort', filters.sort);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    router.push(`/restaurants?${params.toString()}`);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(applyFilters, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearFilters = () => {
    setFilters({ cuisine: 'All', priceLevel: 'All', dietary: 'All', sort: 'rating' });
    setSearchQuery('');
    router.push('/restaurants');
  };

  const hasFilters = filters.cuisine !== 'All' || filters.priceLevel !== 'All' || filters.dietary !== 'All' || filters.sort !== 'rating' || searchQuery;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-zinc-200 dark:border-zinc-800 space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cuisine */}
        <select
          value={filters.cuisine}
          onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Price Level */}
        <select
          value={filters.priceLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, priceLevel: e.target.value }))}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {priceLevels.map(p => <option key={p} value={p}>{p === 'All' ? 'All Prices' : p}</option>)}
        </select>

        {/* Dietary */}
        <select
          value={filters.dietary}
          onChange={(e) => setFilters(prev => ({ ...prev, dietary: e.target.value }))}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {dietaryOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {/* Apply & Clear buttons */}
        <button
          onClick={applyFilters}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
        >
          Apply
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 text-sm flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}