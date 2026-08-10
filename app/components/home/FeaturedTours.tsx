'use client';

import { useEffect, useState, useCallback } from 'react';
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
  const { data: session, status } = useSession();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch tours (with abort controller) ──────────────────────────
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
        if (isMounted) {
          setTours(data);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching tours:', error);
        if (isMounted) {
          setError('Unable to load tours. Please check your connection and try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTours();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // ─── Handle toggle favorite ──────────────────────────────────────
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
    return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading featured tours...</div>;
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()} className="rounded-2xl">
          Retry
        </Button>
      </div>
    );
  }

  const featuredTours = tours.slice(0, 4);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Tours</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Discover our most popular travel experiences handpicked just for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.map((tour) => {
            const formattedPrice = formatPrice(tour.price);
            const isFav = isFavorite(tour.id, 'tour');
            const isLoading = favLoadingId === tour.id;

            return (
              <Card
                key={tour.id}
                className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden rounded-t-3xl">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1 rounded-2xl shadow flex items-center gap-1 text-sm font-semibold">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {tour.rating}
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(tour)}
                    disabled={isLoading}
                    className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-sm disabled:opacity-70"
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                        }`}
                      />
                    )}
                  </button>

                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-sm font-medium px-4 py-1.5 rounded-2xl flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {tour.duration}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="line-clamp-1">{tour.location}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 line-clamp-2 min-h-[3.25rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tour.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-[15px] line-clamp-3 mb-8 flex-1">
                    {tour.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tighter leading-none break-words">
                          {formattedPrice}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">per person</div>
                      </div>

                      <Link href={`/tours/${tour.id}`} className="block">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full rounded-2xl py-3 text-sm font-medium transition-all hover:shadow-lg active:scale-[0.98]"
                        >
                          View Details
                          <ArrowRight className="ml-2 w-4 h-4 inline transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link href="/tours">
            <Button variant="primary" size="lg" className="rounded-2xl px-10 py-3.5 text-base font-medium">
              View All Tours
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}