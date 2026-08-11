import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Star, Calendar, CheckCircle, ArrowLeft, Compass } from 'lucide-react';
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 md:pt-28 pb-10 md:pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 md:mb-6"
        >
          <ArrowLeft size={16} />
          Back to destinations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5 md:space-y-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{destination.name}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-3">
                <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-500 text-yellow-500" />
                  {destination.rating} ({destination.reviewsCount} reviews)
                </span>
                <span className="text-xs md:text-sm text-zinc-500">{destination.country}</span>
                <span className="text-xs md:text-sm text-zinc-500">•</span>
                <span className="text-xs md:text-sm text-zinc-500">{destination.duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {destination.description}
            </p>

            {/* Highlights */}
            <div>
              <h3 className="font-semibold text-base md:text-lg">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {destination.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div>
              <h3 className="font-semibold text-base md:text-lg">Activities</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {destination.activities.map((activity) => (
                  <span
                    key={activity}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Restaurants */}
            {destinationRestaurants.length > 0 && (
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-3">Dining Experiences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destinationRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} compact />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5 md:space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-4 sticky top-24">
              <h3 className="font-bold text-lg md:text-xl">Book This Destination</h3>
              <div className="space-y-3 text-sm md:text-base">
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
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 md:py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Compass className="w-4 h-4 md:w-5 md:h-5" />
                Book Now
              </Link>

              <FavoriteButton
                itemId={destination.slug}
                itemType="destination"
                itemName={destination.name}
                itemImage={destination.image}
                itemPrice={destination.price}
                className="w-full"
              />

              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2">
                Flexible cancellation • Best price guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}