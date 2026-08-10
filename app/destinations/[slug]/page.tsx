import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Star, CheckCircle, ArrowLeft, Compass } from 'lucide-react';
import Link from 'next/link';
import { destinations } from '@/lib/destinations';
import { restaurants } from '@/lib/restaurant-data';
import RestaurantCard from '@/app/components/restaurants/RestaurantCard';
import { Metadata } from 'next';
import FavoriteButton from '@/app/components/FavoriteButton';
import PriceDisplay from '@/app/components/PriceDisplay';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return destinations.map((dest) => ({ slug: dest.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find(d => d.slug === slug);
  if (!destination) return { title: 'Destination Not Found' };
  return {
    title: `${destination.name} - TravelHub`,
    description: destination.description,
  };
}

export default async function DestinationDetail({ params }: Props) {
  const { slug } = await params;
  const destination = destinations.find(d => d.slug === slug);
  if (!destination) notFound();

  const destinationRestaurants = restaurants.filter(r => r.destinationId === destination.slug);

  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Back to destinations
        </Link>

        {/* Hero */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <MapPin size={16} />
              <span>{destination.country}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {destination.rating} ({destination.reviewsCount} reviews)
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
              {destination.name}
            </h1>
            <p className="mt-2 text-lg text-white/80 max-w-2xl">{destination.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destination.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Activities</h2>
              <div className="flex flex-wrap gap-3">
                {destination.activities.map((activity) => (
                  <span
                    key={activity}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {destinationRestaurants.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Dining Experiences in {destination.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destinationRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sticky Booking Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-4 sticky top-28">
              <h3 className="font-bold text-xl">Book This Destination</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Duration</span>
                  <span className="font-medium">{destination.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Price per person</span>
                  <span className="font-bold text-blue-600">
                    <PriceDisplay price={destination.price} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Rating</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {destination.rating} ({destination.reviewsCount})
                  </span>
                </div>
              </div>

              <Link
                href={`/booking?destinationId=${destination.slug}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Compass className="w-5 h-5" />
                Book Now
              </Link>

              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
                Flexible cancellation • Best price guarantee
              </p>

              <FavoriteButton
                itemId={destination.slug}
                itemType="destination"
                itemName={destination.name}
                itemImage={destination.image}
                itemPrice={destination.price}
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}