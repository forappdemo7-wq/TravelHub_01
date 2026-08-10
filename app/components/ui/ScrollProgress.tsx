'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  
  // Ref ensures the timer ID is preserved and cleared correctly across renders
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Update vertical progress
      if (docHeight > 0) {
        setScrollProgress((scrollTop / docHeight) * 100);
      }

      // 1. Check if we've scrolled deep enough to even need a button
      setIsPastThreshold(scrollTop > 400);

      // 2. Wake up the UI (Make bar and button visible)
      setIsActive(true);

      // 3. Clear existing timer and set a new one to hide everything
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setIsActive(false);
      }, 1500); // UI fades out after 1.5 seconds of stillness
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Logical check for the button: Needs to be deep in the page AND active
  const shouldShowButton = isPastThreshold && isActive;

  return (
    <>
      {/* Cinematic Vertical Bar */}
      <div 
        className={`fixed top-0 right-0 w-[4px] h-full z-[9999] pointer-events-none transition-all duration-700 ease-in-out
          ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        `}
      >
        <div className="absolute inset-0 bg-slate-900/10 dark:bg-white/5 backdrop-blur-sm" />
        <div
          className="w-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-150 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to Top Button - Matches your Curated Expeditions layout */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[9998] p-4 rounded-2xl backdrop-blur-xl border transition-all duration-700 group
          ${shouldShowButton 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
          }
          bg-slate-900/80 border-slate-200/10 dark:bg-white/5 dark:border-white/10
          hover:border-blue-500/50 hover:bg-blue-600/10 shadow-2xl
        `}
      >
        <ArrowUp 
          size={20} 
          className="text-slate-900 dark:text-white group-hover:text-blue-400 group-hover:-translate-y-1 transition-all" 
        />
        <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </button>
    </>
  );
}