import { notFound } from 'next/navigation';
import { restaurants } from '@/lib/restaurant-data';
import { Star, MapPin, Phone, Clock, Utensils, DollarSign, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import FavoriteButton from '@/app/components/FavoriteButton';
import PriceDisplay from '@/app/components/PriceDisplay';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) return { title: 'Restaurant Not Found' };
  return {
    title: `${restaurant.name} - TravelHub`,
    description: restaurant.description,
  };
}

export default async function RestaurantDetail({ params }: Props) {
  const { id } = await params;
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) notFound();

  const priceSymbols = { '$': '$', '$$': '$$', '$$$': '$$$', '$$$$': '$$$$' };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 md:pt-28 pb-10 md:pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 md:mb-6"
        >
          ← Back to restaurants
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5 md:space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-3">
                <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-500 text-yellow-500" />
                  {restaurant.rating} ({restaurant.reviewsCount} reviews)
                </span>
                <span className="text-xs md:text-sm text-zinc-500">{restaurant.cuisine}</span>
                <span className="text-xs md:text-sm text-zinc-500">•</span>
                <span className="text-xs md:text-sm text-zinc-500">{restaurant.location}</span>
              </div>
            </div>

            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {restaurant.description}
            </p>

            {restaurant.menuHighlights && restaurant.menuHighlights.length > 0 && (
              <div>
                <h3 className="font-semibold text-base md:text-lg">Menu Highlights</h3>
                <ul className="list-disc list-inside text-sm md:text-base text-zinc-600 dark:text-zinc-400 space-y-1 mt-2">
                  {restaurant.menuHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
              <div>
                <h3 className="font-semibold text-base md:text-lg">Dietary Options</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {restaurant.dietaryOptions.map((d) => (
                    <span
                      key={d}
                      className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {restaurant.coordinates && (
              <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.coordinates.lng-0.01}%2C${restaurant.coordinates.lat-0.01}%2C${restaurant.coordinates.lng+0.01}%2C${restaurant.coordinates.lat+0.01}&layer=mapnik&marker=${restaurant.coordinates.lat}%2C${restaurant.coordinates.lng}`}
                  className="w-full h-56 md:h-[250px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5 md:space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h3 className="font-bold text-lg md:text-xl">Information</h3>
              <div className="space-y-3 text-sm md:text-base">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Price Range</span>
                    <p className="text-sm">
                      {priceSymbols[restaurant.priceLevel]} (<PriceDisplay price={restaurant.price} /> avg/person)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Address</span>
                    <p className="text-sm">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Phone</span>
                    <p className="text-sm">{restaurant.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Hours</span>
                    <p className="text-sm">{restaurant.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {restaurant.bookable && (
              <Link
                href={`/booking?restaurantId=${restaurant.id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 md:py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Utensils className="w-4 h-4 md:w-5 md:h-5" />
                Book a Table
              </Link>
            )}

            {restaurant.bookingUrl && (
              <a
                href={restaurant.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium py-2.5 md:py-2 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                Book via Partner <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            )}

            <FavoriteButton
              itemId={restaurant.id}
              itemType="restaurant"
              itemName={restaurant.name}
              itemImage={restaurant.image}
              itemPrice={restaurant.price}
            />

            {restaurant.destinationId && (
              <Link
                href={`/destinations/${restaurant.destinationId}`}
                className="block w-full text-center border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm md:text-base font-medium py-3 px-6 rounded-2xl transition"
              >
                View Destination
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}