'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Star, MapPin, Clock, Check, Calendar, 
  Users, Heart, ChevronLeft, ShieldCheck, 
  Info, Sparkles, Share2 
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { useCurrency } from '@/app/context/CurrencyContext';

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  highlights?: string[];
  included?: string[];
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const tourId = params.id as string;
    fetch(`/api/tours/${tourId}`)
      .then((res) => res.json())
      .then((data) => {
        setTour(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load tour:', err);
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (session?.user?.email && tour) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          const exists = data.some((fav: any) => fav.itemId === tour.id && fav.itemType === 'tour');
          setIsFavorite(exists);
        })
        .catch(console.error);
    }
  }, [session, tour]);

  const handleAddToFavorites = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + window.location.pathname);
      return;
    }
    if (!tour) return;
    
    setFavLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: tour.id,
          itemType: 'tour',
          itemName: tour.name,
          itemImage: tour.image,
          itemPrice: tour.price,
        }),
      });
      if (res.ok) setIsFavorite(true);
    } catch (error) {
      console.error(error);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Tour not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      {/* Cinematic Hero */}
      <div className="relative h-[65vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-8 left-0 right-0 z-20">
          <div className="container mx-auto px-6 flex justify-between">
            <button 
              onClick={() => router.back()}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
              <Share2 size={22} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-4 text-blue-400 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-xs font-bold uppercase tracking-widest">
                <MapPin size={14} />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-200">
                <Clock size={14} />
                <span>{tour.duration}</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter max-w-4xl drop-shadow-2xl">
              {tour.name}
            </h1>
            <div className="flex items-center text-white gap-3">
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-500 text-slate-950 font-bold">
                <Star size={18} className="fill-current" />
                <span>{tour.rating}</span>
              </div>
              <span className="text-slate-300 font-medium">Based on 120 verified traveler reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Description Card */}
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-blue-400">
                <Info size={24} />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Experience Details</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
                {tour.description}
              </p>
            </div>

            {/* Highlights Bento Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-indigo-500">
                  <Sparkles size={24} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Highlights</h2>
                </div>
                <ul className="space-y-4">
                  {tour.highlights?.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <Check size={14} />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-blue-500">
                  <ShieldCheck size={24} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">What's Included</h2>
                </div>
                <ul className="space-y-4">
                  {tour.included?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Check size={14} />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="relative">
            <div className="sticky top-32 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-900/10">
              <div className="text-center mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Starting from</div>
                <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {formatPrice(tour.price)}
                </div>
                <div className="text-slate-400 mt-1 font-medium">per guest</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Flexible Dates</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Max 15 Guests</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/booking?tourId=${tour.id}`} className="block">
                  <Button size="lg" className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg shadow-xl shadow-blue-600/20">
                    Book This Experience
                  </Button>
                </Link>

                <button
                  onClick={handleAddToFavorites}
                  disabled={favLoading || isFavorite}
                  className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  {favLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500 border-red-500' : 'group-hover:text-red-500'}`} />
                  )}
                  {isFavorite ? 'Saved to Favorites' : 'Save for Later'}
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3 justify-center text-xs text-slate-400 font-medium uppercase tracking-tighter">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Secure Booking & Instant Confirmation</span>
              </div>
            </div>
            
            <div className="mt-8 px-4 text-center">
              <p className="text-xs text-slate-400 font-mono">
                System Reference: 69a51e2cc0c1216a818de968
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}