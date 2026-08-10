'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight, Sparkles, Send } from 'lucide-react';

const GUIDES = [
  {
    id: 1,
    title: 'The Art of Minimalist Packing',
    category: 'Travel Tips',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=2000&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Kyoto’s Hidden Tea Houses',
    category: 'Cultural',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 3,
    title: 'Navigating the Swiss Alps',
    category: 'Adventure',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=2000&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Street Food Safety 101',
    category: 'Cuisine',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop',
    featured: false,
  },
];

export default function TravelGuides() {
  const featuredGuide = GUIDES.find(g => g.featured);
  const regularGuides = GUIDES.filter(g => !g.featured);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles size={16} />
            <span>The Journal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-slate-900 dark:text-white">
            Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Guides</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            Expert advice, curated itineraries, and stories from the road to help you travel deeper.
          </p>
        </div>

        {/* Featured Guide Card */}
        {featuredGuide && (
          <Link href={`/guides/${featuredGuide.id}`} className="group relative block w-full h-[600px] overflow-hidden rounded-[3rem] mb-16 shadow-2xl hover:shadow-blue-900/20 transition-all duration-500">
            <Image 
              src={featuredGuide.image} 
              alt={featuredGuide.title}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl z-10">
              <span className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-[0.2em] mb-6 inline-block shadow-lg">
                Featured Story
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 group-hover:text-blue-200 transition-colors leading-[1.1]">
                {featuredGuide.title}
              </h2>
              <div className="flex items-center gap-8 text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-blue-400">
                    <Clock size={18} />
                  </div>
                  <span>{featuredGuide.readTime}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-blue-400">
                    <BookOpen size={18} />
                  </div>
                  <span>{featuredGuide.category}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {regularGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`} className="group flex flex-col h-full">
              <div className="relative h-72 overflow-hidden rounded-[2rem] mb-8 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-900/10 transition-all duration-500">
                <Image 
                  src={guide.image} 
                  alt={guide.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 shadow-sm">
                    {guide.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {guide.title}
                </h3>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-500 mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium tracking-wide">{guide.readTime}</span>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                    Read Story
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Callout - The Sapphire "Glow" Section */}
        <div className="mt-32 relative rounded-[3.5rem] p-12 md:p-24 text-center overflow-hidden bg-slate-900 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90 transition-opacity group-hover:opacity-100" />
          
          {/* Decorative Mesh */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Never miss a <span className="text-blue-200 italic">hidden gem.</span>
            </h2>
            <p className="text-blue-100/80 text-lg md:text-xl mb-12 font-light leading-relaxed">
              Get our monthly digital magazine delivered straight to your inbox, curated with exclusive itineraries and travel inspiration.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 outline-none text-white placeholder:text-blue-100/50 focus:ring-4 focus:ring-blue-400/30 focus:bg-white/20 transition-all text-lg"
              />
              <button className="px-8 py-5 rounded-2xl bg-white text-slate-900 font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-blue-400/20 active:scale-95">
                Join Now
                <Send size={18} className="text-blue-600" />
              </button>
            </form>
            <p className="mt-6 text-xs text-blue-200/50 font-medium tracking-wide uppercase">
              Free to join • Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}