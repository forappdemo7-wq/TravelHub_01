'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
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

export default function FeaturedTours() {
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/tours', { signal: abortController.signal });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Tour[] = await res.json();
        if (isMounted) setTours(data);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching tours:', error);
        if (isMounted) setError('Unable to load tours. Please try again.');
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

  const handleToggleFavorite = async (tour: Tour) => {
    if (!session) {
      alert('Please sign in to add to favorites.');
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

  if (loading) {
    return <div className="py-12 md:py-20 text-center text-gray-500 dark:text-gray-400">Loading featured tours...</div>;
  }

  if (error) {
    return (
      <div className="py-12 md:py-20 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()} className="rounded-2xl">
          Retry
        </Button>
      </div>
    );
  }

  const featuredTours = tours.slice(0, 4);

  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
            <span className="gradient-text">Featured Tours</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Discover our most popular travel experiences handpicked just for you
          </p>
        </div>

        {/* ─── Grid ─── */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {featuredTours.map((tour) => {
            const formattedPrice = formatPrice(tour.price);
            const isFav = isFavorite(tour.id, 'tour');
            const isLoading = favLoadingId === tour.id;

            return (
              <Card
                key={tour.id}
                className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Section - Reduced base height slightly on mobile to balance proportions */}
                <div className="relative h-24 sm:h-36 md:h-48 lg:h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full shadow flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-xs md:text-sm font-semibold">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                    {tour.rating}
                  </div>

                  {/* Heart Button - Added Flex Center for consistent icon placement */}
                  <button
                    onClick={() => handleToggleFavorite(tour)}
                    disabled={isLoading}
                    className="absolute top-1.5 sm:top-2 md:top-3 left-1.5 sm:left-2 md:left-3 p-1 sm:p-1.5 md:p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm disabled:opacity-70 flex items-center justify-center"
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

                  {/* Duration Badge */}
                  <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 left-1.5 sm:left-2 md:left-3 bg-black/70 backdrop-blur-md text-white text-[8px] sm:text-[10px] md:text-sm font-medium px-1.5 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
                    <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">{tour.duration}</span>
                  </div>
                </div>

                {/* Content Section - Reduced base padding from p-2 to p-1.5 to maximize space */}
                <div className="p-1.5 sm:p-3 md:p-4 lg:p-6 flex flex-col flex-1">
                  
                  {/* Location - Added truncate so it doesn't wrap awkwardly */}
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-[8px] sm:text-[10px] md:text-xs lg:text-sm mb-1 sm:mb-2 md:mb-4 overflow-hidden">
                    <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-4 md:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                    <span className="truncate">{tour.location}</span>
                  </div>

                  {/* Title - Fixed line heights to prevent uneven cards when text wraps */}
                  <h3 className="text-[9px] min-[360px]:text-[10px] leading-tight sm:text-xs md:text-base lg:text-xl font-semibold mb-1 sm:mb-2 md:mb-4 line-clamp-2 h-[22px] min-[360px]:h-[26px] sm:h-auto sm:min-h-[2rem] md:min-h-[3.25rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tour.name}
                  </h3>

                  {/* Description - Still hidden on mobile as requested previously */}
                  <p className="text-gray-600 dark:text-gray-400 text-[8px] sm:text-[10px] md:text-xs lg:text-[15px] line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3 md:mb-8 flex-1 hidden sm:block">
                    {tour.description}
                  </p>

                  <div className="mt-auto pt-1 sm:pt-2 md:pt-3 lg:pt-6 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-3 lg:gap-4">
                      
                      {/* Price Area */}
                      <div>
                        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mb-0 hidden sm:block">Starting from</div>
                        {/* Adjusted price font size and used truncate to handle large numbers safely */}
                        <div className="text-[10px] sm:text-xs md:text-base lg:text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight leading-none truncate">
                          {formattedPrice}
                        </div>
                        <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">per person</div>
                      </div>

                      {/* Button - Added flex-row, justify-center, and whitespace-nowrap to fix the stacking visual bug in the screenshot */}
                      <Link href={`/tours/${tour.id}`} className="block mt-0.5 sm:mt-0">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full flex flex-row items-center justify-center gap-0.5 sm:gap-1 rounded-md sm:rounded-xl md:rounded-2xl py-1 sm:py-1.5 md:py-2 lg:py-3 px-1 sm:px-2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-medium transition-all hover:shadow-lg active:scale-[0.98] whitespace-nowrap overflow-hidden"
                        >
                          <span className="truncate">View Details</span>
                          <ArrowRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-4 md:h-4 inline transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </Button>
                      </Link>

                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Button */}
        <div className="text-center mt-8 md:mt-16">
          <Link href="/tours">
            <Button variant="primary" size="lg" className="rounded-2xl px-8 md:px-10 py-3 md:py-3.5 text-sm md:text-base font-medium">
              View All Tours
              <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}