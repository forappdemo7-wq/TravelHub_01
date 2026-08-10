'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Card from '../ui/Card';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        setError('Could not load testimonials at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevTestimonial();
      } else if (e.key === 'ArrowRight') {
        nextTestimonial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testimonials.length]);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative z-0 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white before:to-gray-50 dark:before:from-gray-900 dark:before:to-gray-800 before:-z-10 -mb-px flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return null; // Or show a graceful fallback
  }

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative z-0 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white before:to-gray-50 dark:before:from-gray-900 dark:before:to-gray-800 before:-z-10 -mb-px">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
            Real stories from real adventurers who explored with us
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="p-8 md:p-12 bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            {/* Decorative Quote Icon */}
            <div className="absolute top-10 left-10 text-blue-500/10">
              <Quote className="w-24 h-24" />
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Profile Image */}
              <div className="relative mb-6">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 
                      'https://via.placeholder.com/120x120/cccccc/666666?text=Traveler';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white dark:border-gray-800">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 transition-colors ${
                      i < current.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic leading-relaxed mb-8 max-w-2xl">
                "{current.comment}"
              </blockquote>

              {/* Author Info */}
              <div>
                <h4 className="font-semibold text-2xl text-gray-900 dark:text-white mb-1">
                  {current.name}
                </h4>
                <p className="text-gray-500 dark:text-gray-400">{current.location}</p>
              </div>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:bg-blue-600 hover:text-white group border border-gray-100 dark:border-gray-700"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-white" />
            </button>

            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:bg-blue-600 hover:text-white group border border-gray-100 dark:border-gray-700"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-white" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-10 bg-blue-600' 
                    : 'w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}