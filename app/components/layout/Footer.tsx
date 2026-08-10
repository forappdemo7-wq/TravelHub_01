'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdEmail, MdPhone } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Compass, ArrowRight, Send } from 'lucide-react';

const EXPLORE_LINKS = [
  { name: 'Tours', href: '/tours' },
  { name: 'Cruises', href: '/cruises' },
  { name: 'Restaurants', href: '/restaurants' },
  { name: 'Destinations', href: '/destinations' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Cancellation Policy', href: '/cancellation' },
];

const SOCIAL_ICONS = [
  { Icon: FaFacebook, href: '#', color: 'hover:bg-[#1877f2]' },
  { Icon: FaTwitter, href: '#', color: 'hover:bg-[#1da1f2]' },
  { Icon: FaInstagram, href: '#', color: 'hover:bg-[#e4405f]' },
  { Icon: FaLinkedin, href: '#', color: 'hover:bg-[#0a66c2]' },
  { Icon: FaYoutube, href: '#', color: 'hover:bg-[#ff0000]' },
];

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60 pt-20 pb-8 overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-6">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                TravelHub
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm text-base font-light">
              Curating bespoke journeys for the modern explorer. Turn your travel dreams into reality.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_ICONS.map(({ Icon, href, color }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 ${color} hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase mb-6">Explore</h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <MdPhone size={20} />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <MdEmail size={20} />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">hello@travelhub.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase mb-6">Newsletter</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Get the latest travel inspiration and offers.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pl-5 pr-14 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Send size={18} className="rotate-[-20deg]" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-500 text-sm font-light">
            © {year} <span className="text-slate-700 dark:text-slate-300 font-medium">TravelHub</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}