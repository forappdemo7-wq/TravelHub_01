// lib/data/cruises.ts
export interface Cruise {
  id: number;
  name: string;
  ship: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
}

export const cruises: Cruise[] = [
  // ... (your cruises array)
];