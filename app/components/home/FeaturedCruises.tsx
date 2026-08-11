'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, Anchor, Clock, ArrowRight, Ship, Heart } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
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

export default function FeaturedCruises() {
  const { data: session, status } = useSession();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCruises = async () => {
      try {
        const res = await fetch('/api/cruises', { signal: abortController.signal });
        if (!res.ok) throw new Error('Failed to fetch cruises');
        const data = await res.json();
        if (isMounted) setCruises(data);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching cruises:', error);
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

  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Loading luxury cruises...</p>
        </div>
      </section>
    );
  }

  if (cruises.length === 0) return null;

  const featuredCruises = cruises.slice(0, 3);

  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
            <Ship className="w-7 h-7 md:w-9 md:h-9 text-blue-600" />
            <span className="uppercase tracking-[2px] md:tracking-[3px] text-[10px] md:text-sm font-semibold text-blue-600">
              Luxury at Sea
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
            <span className="gradient-text">Featured Cruises</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Experience the world from the deck of our handpicked luxury vessels
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {featuredCruises.map((cruise) => {
            const formattedPrice = formatPrice(cruise.price);
            const isFav = isFavorite(cruise.id, 'cruise');
            const isLoading = favLoadingId === cruise.id;

            return (
              <Card
                key={cruise.id}
                className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-24 sm:h-36 md:h-48 lg:h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={cruise.image}
                    alt={cruise.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://placehold.co/600x400/1f2937/9ca3af?text=Cruise';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  <div className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-1 sm:px-2 md:px-3.5 py-0.5 sm:py-1 rounded-full shadow flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs md:text-sm font-semibold">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                    {cruise.rating}
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(cruise)}
                    disabled={isLoading}
                    className="absolute top-1.5 sm:top-2 md:top-3 left-1.5 sm:left-2 md:left-3 p-1 sm:p-1.5 md:p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full hover:scale-110 transition-all shadow-sm disabled:opacity-70 flex items-center justify-center"
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isLoading ? (
                      <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart
                        className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 transition-all ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                        }`}
                      />
                    )}
                  </button>

                  <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 left-1.5 sm:left-2 md:left-3 flex gap-1 sm:gap-1.5 md:gap-2">
                    <div className="bg-black/70 backdrop-blur-md px-1.5 sm:px-2 md:px-4 py-0.5 sm:py-1 rounded-full text-white text-[7px] sm:text-[9px] md:text-xs font-medium flex items-center gap-0.5 sm:gap-1">
                      <Anchor className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5" />
                      <span className="hidden sm:inline">CRUISE</span>
                    </div>
                    <div className="bg-black/70 backdrop-blur-md px-1.5 sm:px-2 md:px-4 py-0.5 sm:py-1 rounded-full text-white text-[7px] sm:text-[9px] md:text-xs font-medium flex items-center gap-0.5 sm:gap-1">
                      <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5" />
                      <span className="hidden sm:inline">{cruise.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 sm:p-3 md:p-4 lg:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 md:mb-4 overflow-hidden whitespace-nowrap">
                    <span className="font-semibold text-blue-600 flex-shrink-0">{cruise.ship}</span>
                    <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">•</span>
                    <span className="truncate">{cruise.destination}</span>
                  </div>

                  <h3 className="text-[9px] min-[360px]:text-[10px] leading-tight sm:text-xs md:text-base lg:text-xl font-semibold mb-1 sm:mb-2 md:mb-4 line-clamp-2 h-[22px] min-[360px]:h-[26px] sm:h-auto sm:min-h-[2rem] md:min-h-[3.25rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cruise.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-[8px] sm:text-[10px] md:text-xs lg:text-[15px] line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3 md:mb-8 flex-1 leading-relaxed hidden sm:block">
                    {cruise.description}
                  </p>

                  <div className="mt-auto pt-1 sm:pt-2 md:pt-3 lg:pt-6 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-end justify-between gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-4">
                      <div className="w-full sm:w-auto sm:flex-1">
                        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mb-0 hidden sm:block">Starting from</div>
                        <div className="text-[10px] sm:text-xs md:text-base lg:text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight leading-none truncate">
                          {formattedPrice}
                        </div>
                        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">per person</div>
                      </div>

                      {/* ─── CLEAN "View Details" LINK (same style as Featured Tours) ─── */}
                      <Link
                        href={`/cruises/${cruise.id}`}
                        className="text-[10px] sm:text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-0.5 sm:gap-1 transition-all w-full sm:w-auto sm:flex-shrink-0 justify-start sm:justify-end"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-16">
          <Link href="/cruises">
            <Button variant="primary" size="lg" className="rounded-2xl px-8 md:px-10 py-3 md:py-3.5 text-sm md:text-base font-medium">
              View All Luxury Cruises
              <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}