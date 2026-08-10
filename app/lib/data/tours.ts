// lib/data/tours.ts
export interface Tour {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
}

export const tours: Tour[] = [
  {
    id: 1,
    name: "Bali Paradise Explorer",
    location: "Bali, Indonesia",
    duration: "5 Days",
    price: 899,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    description: "Experience the magic of Bali with this comprehensive tour package. Visit ancient temples, pristine beaches, and lush rice terraces.",
    highlights: [
      "Visit Uluwatu Temple",
      "Sunset dinner at Jimbaran Bay",
      "Rice terrace trekking",
      "Traditional Balinese massage"
    ],
    included: [
      "4-star accommodation",
      "Daily breakfast",
      "Private transportation",
      "English-speaking guide"
    ]
  },
  // ... (all your other tours)
];