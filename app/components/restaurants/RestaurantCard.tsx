'use client';

import { Restaurant } from '@/app/types';
import Link from 'next/link';
import { MapPin, Star, Utensils, DollarSign } from 'lucide-react';
import FavoriteButton from '@/app/components/FavoriteButton';
import { useCurrency } from '@/app/context/CurrencyContext';

interface Props {
  restaurant: Restaurant;
  compact?: boolean;
}

export default function RestaurantCard({ restaurant, compact = false }: Props) {
  const { formatPrice } = useCurrency();
  const priceSymbols = {
    '$': '$',
    '$$': '$$',
    '$$$': '$$$',
    '$$$$': '$$$$'
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <Link href={`/restaurants/${restaurant.id}`} className="block relative h-56 overflow-hidden flex-shrink-0">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Favorite Button - Top Left */}
        <div className="absolute top-3 left-3 z-20" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton
            itemId={restaurant.id}
            itemType="restaurant"
            itemName={restaurant.name}
            itemImage={restaurant.image}
            itemPrice={restaurant.price}
            variant="compact"
          />
        </div>

        {/* Rating Badge - Top Right */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {restaurant.rating} ({restaurant.reviewsCount})
        </div>

        {/* Dietary Options - Bottom Left */}
        {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap z-10">
            {restaurant.dietaryOptions.slice(0, 2).map((diet) => (
              <span key={diet} className="bg-emerald-500/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                {diet}
              </span>
            ))}
            {restaurant.dietaryOptions.length > 2 && (
              <span className="bg-emerald-500/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                +{restaurant.dietaryOptions.length - 2}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/restaurants/${restaurant.id}`} className="hover:text-blue-600 transition">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{restaurant.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          <Utensils className="w-4 h-4" />
          <span>{restaurant.cuisine}</span>
          <span className="mx-1">•</span>
          <MapPin className="w-4 h-4" />
          <span className="truncate">{restaurant.location}</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {formatPrice(restaurant.price)} avg
          </span>
          <span className="ml-2 text-sm text-zinc-400">
            {priceSymbols[restaurant.priceLevel]}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-3">
          <Link
            href={`/restaurants/${restaurant.id}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Details →
          </Link>

          {restaurant.bookable && (
            <Link
              href={`/booking?restaurantId=${restaurant.id}`}
              className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition shadow-md hover:shadow-lg inline-flex items-center gap-1"
            >
              <Utensils className="w-3 h-3" />
              Book a Table
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}