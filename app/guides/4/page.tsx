'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Utensils, AlertCircle, Share2, Bookmark } from 'lucide-react';

export default function StreetFoodGuide() {
  const safetyTips = [
    { 
      title: "The High Turnover Rule", 
      desc: "Look for stalls with long lines of locals. High turnover means the food is fresh and hasn't been sitting out." 
    },
    { 
      title: "Watch the Prep", 
      desc: "Observe the vendor. Are they using separate utensils for raw and cooked meat? Is the cooking surface clean?" 
    },
    { 
      title: "Peel it or Cook it", 
      desc: "Stick to fruits you can peel yourself (like bananas or mangoes) and vegetables that have been thoroughly cooked." 
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Cinematic Header */}
      <div className="relative h-[70vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" 
          alt="Night Market Street Food"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="container mx-auto max-w-4xl">
            <Link href="/guides" className="inline-flex items-center gap-2 text-blue-400 mb-8 hover:text-blue-300 transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to Collection</span>
            </Link>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-tight">
              Street Food <br/> Safety 101
            </h1>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <Utensils size={16} className="text-blue-500" /> 
                <span className="text-white font-medium">Culinary Travel</span>
              </span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs">
                6 min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          
          <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 font-light italic border-l-4 border-blue-600 pl-6 mb-12">
              Eating like a local is the fastest way to understand a new culture, but it requires a discerning eye and a few golden rules to keep your journey on track.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Trust Your Senses</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Street food is an essential part of the travel experience, from the night markets of Bangkok to the taco stands of Mexico City. While your instinct might be to worry about hygiene, most vendors rely on their reputation and high volume to stay in business.
            </p>

            {/* Safety Checklist Cards */}
            <div className="my-12 grid grid-cols-1 gap-4">
              {safetyTips.map((tip, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-start gap-4 transition-all hover:shadow-md">
                  <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{tip.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Water & Ice</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Often, it’s not the food that causes issues, but the water. In many regions, tap water isn't safe for travelers. Be cautious with iced drinks unless the ice is factory-made (look for uniform shapes like cylinders with holes in the middle).
            </p>

            {/* Callout Image Box */}
            <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden my-16 group shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" 
                alt="Cooking street food"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-2 text-blue-400 mb-2 font-bold uppercase tracking-widest text-xs">
                  <AlertCircle size={16} />
                  <span>Crucial Tip</span>
                </div>
                <h4 className="text-2xl font-bold text-white">Heat is Your Friend</h4>
                <p className="text-white/70 text-sm max-w-sm mt-2">Always opt for food that is cooked fresh in front of you at high temperatures.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Pack the Essentials</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-20">
              Carry hand sanitizer and use it before you eat. It’s a simple habit that significantly reduces the risk of cross-contamination from handling local currency or public transport railings.
            </p>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Return To</span>
               <Link href="/guides" className="text-xl font-bold hover:text-blue-600 transition-colors">
                 All Travel Guides
               </Link>
             </div>
             <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <Bookmark size={18} className="text-gray-500" />
                </button>
                <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <Share2 size={18} className="text-gray-500" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}