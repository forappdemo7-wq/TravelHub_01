// lib/destinations.ts
export interface Destination {
  id: number;
  slug: string;
  name: string;
  country: string;
  image: string;
  description: string;
  price: number; // per person
  duration: string; // e.g., "7 Days"
  rating: number;
  reviewsCount: number;
  highlights: string[];
  activities: string[];
  size?: 'lg' | 'sm';
}

export const destinations: Destination[] = [
  {
    id: 1,
    slug: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop',
    description: 'White-washed houses clinging to volcanic cliffs, overlooking the deep blue Aegean Sea. A romantic paradise with stunning sunsets, crystal-clear waters, and world-class cuisine.',
    price: 1200,
    duration: '6 Days',
    rating: 4.9,
    reviewsCount: 234,
    highlights: ['Caldera views', 'Sunset in Oia', 'Volcano tour', 'Wine tasting'],
    activities: ['Sailing', 'Hiking', 'Wine tours', 'Beach hopping'],
    size: 'lg'
  },
  {
    id: 2,
    slug: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
    description: 'Ancient temples, zen gardens, and traditional tea houses. Kyoto is the cultural heart of Japan, where history meets tranquility. Experience the beauty of cherry blossoms and authentic Japanese culture.',
    price: 950,
    duration: '5 Days',
    rating: 4.8,
    reviewsCount: 187,
    highlights: ['Kinkaku-ji Temple', 'Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Geisha performances'],
    activities: ['Temple tours', 'Tea ceremonies', 'Sushi making', 'Samurai experience'],
    size: 'sm'
  },
  {
    id: 3,
    slug: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?q=80&w=2000&auto=format&fit=crop',
    description: 'Dramatic cliffs, pastel-colored villages, and turquoise waters. The Amalfi Coast is Italy\'s most glamorous seaside escape, perfect for romance and relaxation.',
    price: 1400,
    duration: '7 Days',
    rating: 4.9,
    reviewsCount: 156,
    highlights: ['Positano', 'Ravello', 'Capri boat tour', 'Lemon groves'],
    activities: ['Coastal drives', 'Boat tours', 'Hiking the Path of the Gods', 'Italian cooking'],
    size: 'sm'
  },
  {
    id: 4,
    slug: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop',
    description: 'The Island of the Gods – with rice terraces, volcanic mountains, and vibrant culture. A spiritual and tropical haven for adventure and relaxation.',
    price: 850,
    duration: '8 Days',
    rating: 4.9,
    reviewsCount: 312,
    highlights: ['Ubud rice terraces', 'Mount Batur sunrise', 'Uluwatu Temple', 'Beach clubs'],
    activities: ['Surfing', 'Yoga', 'Volcano hiking', 'Temple tours'],
    size: 'lg'
  },
  // Add more destinations to match restaurants (optional)
  {
    id: 5,
    slug: 'new-york',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop',
    description: 'The city that never sleeps – towering skyscrapers, world-class theatre, and endless culinary diversity.',
    price: 1100,
    duration: '5 Days',
    rating: 4.7,
    reviewsCount: 420,
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Broadway'],
    activities: ['City tours', 'Museum visits', 'Broadway shows', 'Shopping'],
    size: 'sm'
  },
  {
    id: 6,
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop',
    description: 'Romance, art, and gastronomy – the City of Light awaits with iconic landmarks and hidden gems.',
    price: 980,
    duration: '6 Days',
    rating: 4.8,
    reviewsCount: 298,
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine cruise'],
    activities: ['Art tours', 'French cooking', 'Champagne tastings', 'Boat tours'],
    size: 'sm'
  },
];