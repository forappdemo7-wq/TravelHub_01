'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, Anchor, Clock, Search, Ship, Filter, X, ChevronRight, Heart } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useFavorites } from '@/app/hooks/useFavorites';

interface Cruise {
  id: string;
  name: string;
  ship: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

export default function CruisesPage() {
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);

  // ─── Fetch cruises (with abort controller) ──────────────────────────
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCruises = async () => {
      try {
        const res = await fetch('/api/cruises', { signal: abortController.signal });
        if (!res.ok) throw new Error('Failed to fetch cruises');
        const data = await res.json();
        if (isMounted) setCruises(data);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Failed to load cruises:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCruises();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // ─── Handle toggle favorite ──────────────────────────────────────────
  const handleToggleFavorite = async (cruise: Cruise) => {
    if (!session) {
      alert('Please sign in to add favorites.');
      return;
    }

    setFavLoadingId(cruise.id);
    await toggleFavorite({
      itemId: cruise.id,
      itemType: 'cruise',
      itemName: cruise.name,
      itemImage: cruise.image,
      itemPrice: cruise.price,
    });
    setFavLoadingId(null);
  };

  // ─── Filter cruises ──────────────────────────────────────────
  const filteredCruises = useMemo(() => {
    return cruises
      .filter(cruise =>
        cruise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cruise.ship.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cruise.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(cruise => cruise.price <= priceRange);
  }, [cruises, searchTerm, priceRange]);

  const hasActiveFilters = searchTerm !== '' || priceRange !== 5000;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium tracking-wide">Curating luxury voyages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Header - Luxury Maritime Theme */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-lg border border-white/20">
            <Ship className="w-10 h-10 text-cyan-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Cruises</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-50/80 max-w-2xl mx-auto font-light">
            Embark on unforgettable journeys. Sail the world's most beautiful waters in ultimate comfort and uncompromising style.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {/* Floating Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, magnificent ship, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-transparent rounded-2xl 
                           focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           text-slate-900 dark:text-white transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium transition-all duration-200 whitespace-nowrap border
                ${showFilters 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
              {hasActiveFilters && (
                <span className="ml-1 flex h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </button>
          </div>

          {/* Expandable Price Filter */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="max-w-xl">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Budget Range
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Set your maximum price per person</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${priceRange}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                />
                <div className="flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500 mt-3">
                  <span>$0</span>
                  <span>$1000</span>
                  <span>$2000</span>
                  <span>$3000</span>
                  <span>$4000</span>
                  <span>$5000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <p className="text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white text-lg mx-1">{filteredCruises.length}</span> luxury journeys
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPriceRange(5000);
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Reset Filters
            </button>
          )}
        </div>

        {/* Cruises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCruises.map((cruise) => {
            const isFav = isFavorite(cruise.id, 'cruise');
            const isLoading = favLoadingId === cruise.id;

            return (
              <Card key={cruise.id} className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
                
                {/* Heart Button - Top Left */}
                <button
                  onClick={() => handleToggleFavorite(cruise)}
                  disabled={isLoading}
                  className="absolute top-4 left-4 z-30 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-110 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    />
                  )}
                </button>

                {/* Image Section */}
                <div className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent z-10"></div>
                  <img
                    src={cruise.image}
                    alt={cruise.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image')}
                  />
                  
                  {/* Rating Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{cruise.rating}</span>
                    </div>
                  </div>

                  {/* Duration Badge - Bottom Right */}
                  <div className="absolute bottom-4 right-4 z-20 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cruise.duration}
                  </div>

                  {/* Cruise Badge - Bottom Left */}
                  <div className="absolute bottom-4 left-4 z-20 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <Anchor className="w-3 h-3" />
                    CRUISE
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">
                    <span>{cruise.ship}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{cruise.destination.split('(')[0]}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {cruise.name}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 text-sm leading-relaxed flex-grow">
                    {cruise.description}
                  </p>
                  
                  <div className="flex items-end justify-between pt-5 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Starting from</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          {formatPrice(cruise.price)}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">/pp</span>
                      </div>
                    </div>
                    <Link href={`/cruises/${cruise.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full group/btn hover:bg-blue-50 dark:hover:bg-blue-950/20 border-slate-200 dark:border-slate-700">
                        Explore <ChevronRight className="w-4 h-4 ml-1 inline group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCruises.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm mt-8">
            <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
              <Ship className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No voyages found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
              We couldn't find any cruises matching your refined criteria. Try broadening your horizon.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setPriceRange(5000);
              }} 
              variant="primary"
              className="px-8 py-3 rounded-full shadow-lg shadow-blue-500/30"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}