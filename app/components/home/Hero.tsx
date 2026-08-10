'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';

export default function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  // ─── Cloudinary Video URLs ──────────────────────────────────────────
  const videoSrc = isLight
    ? 'https://res.cloudinary.com/dqz2aoygf/video/upload/v1786361934/hero_2_owmved.mp4'   // light theme
    : 'https://res.cloudinary.com/dqz2aoygf/video/upload/v1786361660/hero_erexue.mp4';      // dark theme

  const posterImage =
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=90';

  return (
    <section className="relative h-screen min-h-[760px] overflow-hidden bg-black flex items-center">

      {/* ================= Background ================= */}

      <div className="absolute inset-0 overflow-hidden">

        <video
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          poster={posterImage}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            scale-105
            brightness-[1.15]
            contrast-[1.08]
            saturate-[1.15]
            transition-all
            duration-700
          "
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Cinematic Overlay */}

        <div
          className={`absolute inset-0 transition-all duration-700 ${
            isLight
              ? 'bg-gradient-to-r from-white/10 via-transparent to-black/15'
              : 'bg-gradient-to-r from-black/25 via-black/5 to-black/15'
          }`}
        />

        {/* Top Fade */}

        <div
          className={`absolute inset-x-0 top-0 h-48 transition-all duration-700 ${
            isLight
              ? 'bg-gradient-to-b from-white/15 to-transparent'
              : 'bg-gradient-to-b from-black/20 to-transparent'
          }`}
        />

        {/* Bottom Fade */}

        <div
          className={`absolute inset-x-0 bottom-0 h-56 transition-all duration-700 ${
            isLight
              ? 'bg-gradient-to-t from-white/5 to-transparent'
              : 'bg-gradient-to-t from-black/30 to-transparent'
          }`}
        />

        {/* Soft vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.10)_100%)]" />
      </div>

      {/* ================= Content ================= */}

      <div className="relative z-10 container mx-auto px-6">

        <div className="max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          >

            <h1
              className={`
                text-6xl
                md:text-7xl
                lg:text-8xl
                xl:text-[6rem]
                font-black
                tracking-tight
                leading-[0.92]
                mb-8
                transition-all
                duration-500
                ${
                  isLight
                    ? 'text-slate-900 drop-shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
                    : 'text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]'
                }
              `}
            >
              Discover Your Next

              <span
                className={`
                  block
                  bg-clip-text
                  text-transparent
                  transition-all
                  duration-500
                  ${
                    isLight
                      ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600'
                      : 'bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-400'
                  }
                `}
              >
                Adventure
              </span>

            </h1>

          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            className={`
              max-w-2xl
              text-xl
              md:text-2xl
              leading-relaxed
              mb-12
              transition-all
              duration-500
              font-bold
              ${
                isLight
                  ? 'text-black drop-shadow-[0_1px_2px_rgba(255,255,255,1)]'
                  : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
              }
            `}
          >
            Curated luxury travel experiences to the world's most
            extraordinary destinations. Create unforgettable memories
            through hand-picked adventures, luxury cruises and
            exclusive stays crafted for modern explorers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
            }}
            className="flex flex-col sm:flex-row gap-5"
          >

            <Link href="/tours">

              <Button
                size="lg"
                className={`
                  group
                  rounded-2xl
                  px-10
                  py-7
                  text-lg
                  transition-all
                  duration-300
                  hover:scale-105
                  ${
                    isLight
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-xl shadow-blue-700/25'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-600/30'
                  }
                `}
              >
                <span className="flex items-center">

                  Explore Tours

                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />

                </span>

              </Button>

            </Link>

            <Link href="/cruises">

              <Button
                size="lg"
                variant="outline"
                className={`
                  rounded-2xl
                  px-10
                  py-7
                  text-lg
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  ${
                    isLight
                      ? 'bg-white/70 border-slate-300 text-slate-900 hover:bg-white'
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  }
                `}
              >
                Explore Cruises
              </Button>

            </Link>

          </motion.div>
        </div>
      </div>

      {/* ================= Scroll Indicator ================= */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1,
          duration: 1,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth',
            })
          }
          className="group flex flex-col items-center"
        >
          <span
            className={`
              text-[11px]
              uppercase
              tracking-[0.45em]
              transition-all
              duration-500
              ${
                isLight
                  ? 'text-slate-700 group-hover:text-blue-700'
                  : 'text-white/60 group-hover:text-sky-300'
              }
            `}
          >
            Scroll
          </span>

          <div
            className={`
              mt-3
              relative
              h-14
              w-[2px]
              overflow-hidden
              rounded-full
              transition-all
              duration-500
              ${
                isLight
                  ? 'bg-slate-300'
                  : 'bg-white/20'
              }
            `}
          >
            <motion.div
              animate={{
                y: [-18, 42],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: 'easeInOut',
              }}
              className={`
                absolute
                left-0
                top-0
                h-6
                w-full
                rounded-full
                ${
                  isLight
                    ? 'bg-gradient-to-b from-blue-700 to-blue-500'
                    : 'bg-gradient-to-b from-sky-400 to-blue-500'
                }
              `}
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
}