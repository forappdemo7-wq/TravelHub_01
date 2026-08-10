import { restaurants } from '@/lib/restaurant-data';
import RestaurantCard from '@/app/components/restaurants/RestaurantCard';
import RestaurantFilter from '@/app/components/restaurants/RestaurantFilter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Dining Experiences | TravelHub',
  description: 'Discover the finest restaurants in top travel destinations. Book tables and enjoy culinary excellence.',
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams Promise
  const params = await searchParams;
  
  const cuisine = (params.cuisine as string) || 'All';
  const priceLevel = (params.price as string) || 'All';
  const dietary = (params.dietary as string) || 'All';
  const sort = (params.sort as string) || 'rating';
  const search = (params.search as string) || '';

  let filtered = [...restaurants];

  // Filter by cuisine
  if (cuisine !== 'All') {
    filtered = filtered.filter(r => r.cuisine === cuisine);
  }
  // Filter by price level
  if (priceLevel !== 'All') {
    filtered = filtered.filter(r => r.priceLevel === priceLevel);
  }
  // Filter by dietary
  if (dietary !== 'All') {
    filtered = filtered.filter(r => r.dietaryOptions?.some(d => d === dietary));
  }
  // Search
  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(lower) ||
      r.cuisine.toLowerCase().includes(lower) ||
      r.location.toLowerCase().includes(lower)
    );
  }

  // Sorting
  switch (sort) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'reviews':
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Curated Dining Experiences
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 max-w-2xl mx-auto">
            Handpicked restaurants for travelers who appreciate exceptional cuisine.
            From Michelin stars to hidden gems.
          </p>
        </div>

        {/* Filters */}
        <RestaurantFilter />

        {/* Results */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-zinc-500 dark:text-zinc-400">No restaurants match your criteria.</p>
              <p className="text-sm text-zinc-400">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}