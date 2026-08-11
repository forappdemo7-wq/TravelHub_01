'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, MapPin, Clock, Search, Filter, X, ChevronRight, Compass, Heart } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useFavorites } from '@/app/hooks/useFavorites';

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

export default function ToursPage() {
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const { favorites, isFavorite, toggleFavorite, loading: favLoading } = useFavorites();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(3000);
  const [showFilters, setShowFilters] = useState(false);

  // ─── Fetch tours ──────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/tours', { signal: abortController.signal });
        if (!res.ok) throw new Error('Failed to fetch tours');
        const data = await res.json();
        if (isMounted) setTours(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error(err);
        if (isMounted) setError('Failed to load tours. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTours();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // ─── Handle toggle favorite ────────────────────────────────────
  const handleToggleFavorite = async (tour: Tour) => {
    if (!session) {
      alert('Please sign in to add favorites.');
      return;
    }

    setFavLoadingId(tour.id);
    await toggleFavorite({
      itemId: tour.id,
      itemType: 'tour',
      itemName: tour.name,
      itemImage: tour.image,
      itemPrice: tour.price,
    });
    setFavLoadingId(null);
  };

  // ─── Filter tours ──────────────────────────────────────────────
  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((tour) => tour.price <= priceRange)
      .sort((a, b) => a.price - b.price);
  }, [tours, searchTerm, priceRange]);

  const hasActiveFilters = searchTerm !== '' || priceRange !== 3000;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-emerald-100 dark:border-stone-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-stone-500 dark:text-stone-400 font-medium tracking-wide">Mapping your next adventure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white dark:bg-stone-800 shadow-xl border-0 rounded-2xl">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-stone-500 dark:text-stone-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="rounded-full px-8 py-2.5 bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pb-20">
      {/* Hero Header - Earthy Adventure Theme */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-emerald-900 to-teal-900 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-lg border border-white/20">
            <Compass className="w-10 h-10 text-emerald-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Expeditions</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50/80 max-w-2xl mx-auto font-light">
            Immerse yourself in breathtaking landscapes and vibrant cultures. Discover the world's hidden gems.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {/* Floating Search & Filter Bar */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-700 p-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search by tour name or magnificent destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-stone-50 dark:bg-stone-900/50 border-transparent rounded-xl 
                           focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           text-stone-900 dark:text-white transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                >
                  <X className="h-5 w-5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                ${showFilters 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
                } border`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Filters'}
              {hasActiveFilters && (
                <span className="ml-1 flex h-2 w-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>

          {/* Expandable Price Filter */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t border-stone-100 dark:border-stone-700">
              <div className="max-w-xl">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Budget Range
                    </label>
                    <span className="text-xs text-stone-500 dark:text-stone-400">Set your maximum price per person</span>
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${priceRange}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer dark:bg-stone-700 accent-emerald-600"
                />
                <div className="flex justify-between text-xs font-medium text-stone-400 dark:text-stone-500 mt-3 hidden sm:flex">
                  <span>$0</span>
                  <span>$500</span>
                  <span>$1000</span>
                  <span>$1500</span>
                  <span>$2000</span>
                  <span>$2500</span>
                  <span>$3000</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-stone-400 dark:text-stone-500 mt-3 sm:hidden">
                  <span>$0</span>
                  <span>$1500</span>
                  <span>$3000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8 px-2">
          <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base">
            Showing <span className="font-bold text-stone-900 dark:text-white text-base md:text-lg mx-1">{filteredTours.length}</span> adventures
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPriceRange(3000);
              }}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Reset Filters
            </button>
          )}
        </div>

        {/* ─── Tours Grid – Fixed for Mobile ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {filteredTours.map((tour) => {
            const isFav = isFavorite(tour.id, 'tour');
            const isLoading = favLoadingId === tour.id;

            return (
              <Card key={tour.id} className="group flex flex-col h-full bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                
                {/* Favorite Heart Button - Top Left */}
                <button
                  onClick={() => handleToggleFavorite(tour)}
                  disabled={isLoading}
                  className="absolute top-3 md:top-4 left-3 md:left-4 z-20 p-2 md:p-2 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm hover:scale-110 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart
                      className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    />
                  )}
                </button>

                {/* Image Section */}
                <div className="relative h-48 sm:h-52 md:h-56 lg:h-72 overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent z-10"></div>
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 
                        'https://via.placeholder.com/800x600/e7e5e4/a8a29e?text=No+Image+Available';
                    }}
                  />
                  
                  {/* Rating Badge - Top Right */}
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-xs md:text-sm text-stone-700 dark:text-stone-200">{tour.rating}</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 z-20 flex items-center justify-between text-white/90 text-xs md:text-sm font-medium">
                    <div className="flex items-center gap-1 md:gap-1.5 bg-stone-900/50 backdrop-blur-sm px-2 md:px-2.5 py-1 md:py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                      <span className="truncate max-w-[120px] md:max-w-[120px]">{tour.location}</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-1.5 bg-stone-900/50 backdrop-blur-sm px-2 md:px-2.5 py-1 md:py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-4 md:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {tour.name}
                  </h3>
                  
                  <p className="text-stone-600 dark:text-stone-400 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-sm leading-relaxed flex-grow block">
                    {tour.description}
                  </p>
                  
                  <div className="flex items-end justify-between pt-4 md:pt-5 border-t border-stone-100 dark:border-stone-700/50 mt-auto">
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-0 block">Starting from</p>
                      <div className="flex items-baseline gap-1 md:gap-1">
                        <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white">
                          {formatPrice(tour.price)}
                        </span>
                        <span className="text-xs md:text-sm text-stone-500 dark:text-stone-400 inline">/pp</span>
                      </div>
                    </div>
                    <Link href={`/tours/${tour.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full group/btn hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-stone-200 dark:border-stone-700 text-sm px-4 py-2 md:py-1.5">
                        Explore <ChevronRight className="w-4 h-4 md:w-4 md:h-4 ml-1 md:ml-1 inline group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-stone-800 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-sm mt-8">
            <div className="mx-auto w-24 h-24 bg-stone-50 dark:bg-stone-900 rounded-full flex items-center justify-center mb-6 border border-stone-100 dark:border-stone-800">
              <Compass className="w-10 h-10 text-stone-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-stone-900 dark:text-white">No expeditions found</h3>
            <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto text-lg">
              We couldn't find any tours matching your current path. Try clearing your filters to discover more.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setPriceRange(3000);
              }} 
              variant="primary"
              className="px-8 py-3 rounded-full shadow-lg shadow-emerald-500/30"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}