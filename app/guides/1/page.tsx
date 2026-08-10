'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Share2, Bookmark, CheckCircle2 } from 'lucide-react';

export default function PackingGuide() {
  const publishDate = "April 12, 2026";
  
  const packingList = [
    "Choose a versatile color palette (neutrals work best).",
    "The 5-4-3-2-1 Rule: 5 socks/underwear, 4 tops, 3 bottoms, 2 shoes, 1 hat.",
    "Wear your heaviest items (boots/jackets) on the plane.",
    "Use compression packing cubes to save 30% more space."
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Article Header / Hero */}
      <div className="relative h-[70vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1553531384-cc64ac80f931" 
          alt="Minimalist Packing"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="container mx-auto max-w-4xl">
            <Link href="/guides" className="inline-flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to Guides</span>
            </Link>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-[1.1]">
              The Art of <br/> Minimalist Packing
            </h1>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                By <span className="text-white font-medium">TravelHub Editorial</span>
              </span>
              <span>•</span>
              <span>{publishDate}</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs">
                5 min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          
          {/* Action Bar */}
          <div className="flex justify-between items-center py-6 border-y border-gray-100 dark:border-gray-800 mb-12">
            <p className="text-gray-500 italic">"Travel light, live light, spread the light, be the light."</p>
            <div className="flex gap-4">
              <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                <Share2 size={20} />
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                <Bookmark size={20} />
              </button>
            </div>
          </div>

          <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
              The secret to a stress-free journey isn't found in a better itinerary; it's found in a lighter suitcase. Minimalist packing isn't about deprivation—it's about the freedom to move effortlessly through cobblestone streets and crowded transit hubs without the anchor of excess weight.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6">1. The One-Bag Philosophy</h2>
            <p className="text-gray-600 dark:text-gray-400">
              When you commit to a single carry-on, the world opens up. No more waiting at baggage carousels, no more "lost luggage" nightmares, and significantly less strain on your back. 
            </p>

            {/* Aesthetic Pro-Tip Callout */}
            <div className="my-12 p-8 rounded-[2rem] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
              <h4 className="text-blue-600 dark:text-blue-400 font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> PRO TIP: The Rolling Method
              </h4>
              <p className="text-gray-700 dark:text-gray-300 italic mb-0">
                Instead of folding, roll your clothes tightly. This minimizes wrinkles and fills those awkward corner gaps in your suitcase that folded clothes usually leave behind.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6">2. Essential Packing List</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start with the basics and remember: you can almost always do laundry at your destination.
            </p>
            
            <ul className="space-y-4 list-none pl-0">
              {packingList.map((item, idx) => (
                <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold mt-16 mb-6">Conclusion</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-20">
              Minimalist packing is a skill that improves with every trip. Start by laying out everything you think you need, then put half of it back in the closet. Your future self, standing in front of a flight of stairs in Montmartre, will thank you.
            </p>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Up Next</span>
               <Link href="/guides/2" className="text-xl font-bold hover:text-blue-600 transition-colors">
                 Kyoto’s Hidden Tea Houses
               </Link>
             </div>
             <Link href="/guides" className="text-sm font-bold text-blue-600">
               Explore All Guides
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
}