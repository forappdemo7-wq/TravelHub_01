'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mountain, Map, Info, Compass } from 'lucide-react';

export default function SwissAlpsGuide() {
  const essentials = [
    { title: "The Swiss Travel Pass", desc: "Your all-access key to trains, boats, and cable cars." },
    { title: "Elevation Awareness", desc: "Hydration is key when traversing heights above 3,000m." },
    { title: "Seasonal Timing", desc: "June to August for hiking; December to March for skiing." }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Cinematic Header (Consistent with Guide 1 & 2) */}
      <div className="relative h-[70vh] w-full">
        <Image 
          src="https://images.unsplash.com/photo-1531310197839-ccf54634509e" 
          alt="Swiss Alps"
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
              Navigating the <br/> Swiss Alps
            </h1>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <Mountain size={16} className="text-blue-500" /> 
                <span className="text-white font-medium">Adventure Series</span>
              </span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs">
                12 min read
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
              The Swiss Alps are more than just a mountain range; they are a masterclass in nature’s grandeur, perfectly synced with human engineering.
            </p>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">The Peak Experience</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Whether you’re heading to the iconic Matterhorn in Zermatt or the "Top of Europe" at Jungfraujoch, navigating Switzerland requires a blend of spontaneity and Swiss-precision planning. The rail network here is the most efficient in the world, turning even the commute into a scenic tour.
            </p>

            {/* Practical Info Card */}
            <div className="my-12 grid grid-cols-1 gap-4">
              {essentials.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                  <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                    <Map size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Beyond the Slopes</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              While the peaks draw the crowds, the alpine valleys hold the soul of the region. Villages like Lauterbrunnen, set in a valley of 72 waterfalls, offer a tranquility that feels separated from the modern world.
            </p>

            {/* Featured Image Box */}
            <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden my-16 group shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" 
                alt="Swiss Village"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <Compass size={18} className="text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Recommended Spot</span>
                </div>
                <h4 className="text-2xl font-bold text-white">Lauterbrunnen Valley</h4>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-16 mb-6 tracking-tight text-gray-900 dark:text-white">Final Advice</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-20">
              The weather can change in minutes. Always check the local webcams before taking a cable car to the summit. A clear day at the base doesn't always mean a clear view at the top!
            </p>
          </div>

          {/* Bottom Nav / Next Article */}
          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Up Next</span>
               <Link href="/guides/4" className="text-xl font-bold hover:text-blue-600 transition-colors">
                 Street Food Safety 101
               </Link>
             </div>
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
                  <Info size={18} className="text-gray-500" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}