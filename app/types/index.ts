// app/types/index.ts

export interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  description: string;
  highlights: string[];
  included: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  tourId: string;
  travelers: number;
  date: string;
  specialRequests?: string;
}

export type DietaryOption = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal' | 'Kosher';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  cuisine: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  price: number;
  rating: number;
  reviewsCount: number;
  location: string;
  address: string;
  phone: string;
  hours: string;
  dietaryOptions?: string[]; // ← now string[] (can be DietaryOption[] if you prefer)
  destinationId?: string;
  // --- NEW FIELDS (added in your data) ---
  coordinates?: { lat: number; lng: number };
  menuHighlights?: string[];
  bookable?: boolean;
  bookingUrl?: string;
}
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  // Tour / Cruise
  tourId?: string;
  cruiseId?: string;
  // Restaurant
  restaurantId?: string;
  travelers: number;
  date: string;
  specialRequests?: string;
}