'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Coffee, MapPin, Share2, Info } from 'lucide-react';

export default function KyotoGuide() {
  const locations = [
    { 
      name: "Giou-ji Temple", 
      district: "Arashiyama", 
      desc: "A quiet sanctuary hidden within a lush moss forest." 
    },
    { 
      name: "Ichiriki Chaya", 
      district: "Gion", 
      desc: "One of the most famous and historic tea houses in Japan." 
    },
    { 
      name: "Kurasu Kyoto", 
      district: "Shimogyo-ku", 
      desc: "A modern fusion of specialty coffee and traditional tea ceremony." 
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Cinematic Header */}
      <div className="relative h-[70vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" 
          alt="Kyoto Tea House"
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
              Kyoto’s Hidden <br/> Tea Houses
            </h1>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <Coffee size={16} className="text-blue-500" /> 
                <span className="text-white font-medium">Cultural Exploration</span>
              </span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs">
                8 min read
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
              In the ancient capital of Japan, the tea house is not just a place for a drink; it is a meticulously designed space for mindfulness and aesthetic appreciation.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">The Wabi-Sabi Aesthetic</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stepping into a Kyoto tea house is an exercise in intentionality. The architecture follows the principle of <strong>Wabi-Sabi</strong>—finding beauty in the imperfect and the transient. From the rough texture of the hand-crafted matcha bowl to the specific way sunlight filters through shoji screens, every detail is considered.
            </p>

            {/* Selection Grid */}
            <div className="my-12 grid grid-cols-1 gap-4">
              {locations.map((loc, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-start gap-4 transition-all hover:border-blue-500/30">
                  <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{loc.name}</h4>
                    <p className="text-xs text-blue-500 uppercase font-bold tracking-widest mb-1">{loc.district}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">{loc.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Etiquette of the Ceremony</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              While many modern tea houses are welcoming to travelers, the traditional etiquette remains. Silence is encouraged, and phones are usually tucked away. This isn't about rules; it’s about creating an environment where the only thing that exists is the tea and the conversation.
            </p>

            {/* Secondary Image Box */}
            <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden my-16 group shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1528360983277-13d401cdc186" 
                alt="Zen Garden in Kyoto"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">Editor's Choice</span>
                <h4 className="text-2xl font-bold text-white">The Zen Garden Atmosphere</h4>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Finding Your Way</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-20">
              The best tea houses aren't found on the main boulevards. Look for the small wooden lattices in the alleyways of Gion or the temple grounds in Arashiyama. If you see a small sign with a steaming cup or a calligraphy scroll, you’ve found it.
            </p>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Up Next</span>
               <Link href="/guides/3" className="text-xl font-bold hover:text-blue-600 transition-colors">
                 Navigating the Swiss Alps
               </Link>
             </div>
             <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
                  <Share2 size={18} className="text-gray-500 group-hover:text-blue-600" />
                </button>
                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors group">
                  <Info size={18} className="text-gray-500 group-hover:text-blue-600" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}