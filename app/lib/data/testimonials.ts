// lib/data/testimonials.ts
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  // ... (your testimonials array)
];