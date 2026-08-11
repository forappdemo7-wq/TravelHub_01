'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Compass, User, ChevronDown, LogOut, BookOpen, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeToggle from '../ui/DarkModeToggle';
import CurrencySwitcher from '../ui/CurrencySwitcher';
import { useChatbot } from '@/app/context/ChatbotContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isChatbotVisible, toggleChatbot } = useChatbot();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Cruises', href: '/cruises' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;
  const userAvatar = session?.user?.avatar as string | null | undefined;
  const userName = session?.user?.name || 'User';

  const menuVariants = {
    hidden: { opacity: 0, y: -15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Dropdown items
  const dropdownItems = [
    { label: 'Profile', icon: User, href: '/dashboard' },
    { label: 'My Bookings', icon: BookOpen, href: '/my-bookings' },
    { label: isChatbotVisible ? 'Hide Chatbot' : 'Show Chatbot', icon: MessageSquare, action: toggleChatbot },
    { label: 'Sign Out', icon: LogOut, action: () => signOut({ callbackUrl: '/' }) },
  ];

  const handleDropdownClick = (item: typeof dropdownItems[0]) => {
    if (item.action) {
      item.action();
    }
    if (item.href) {
      // Use window.location for navigation
      window.location.href = item.href;
    }
    setDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/10 py-2 md:py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
          : 'bg-transparent border-b border-transparent py-2 md:py-5'
      }`}
    >
      <nav className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* ─── Logo ─── */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg md:rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-shadow duration-300"
              >
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 text-white" />
              </motion.div>
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent hidden sm:block">
  TravelHub
</span>
            </Link>
          </div>

          {/* ─── Desktop Navigation ─── */}
          <div className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-black/5 dark:border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-300 whitespace-nowrap ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {isActive(item.href) && (
                  <motion.div
                    layoutId="desktop-active-nav"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* ─── Right Actions ─── */}
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1 md:gap-3">
              <CurrencySwitcher />
              <div className="w-px h-4 md:h-6 bg-gray-300 dark:bg-gray-700" />
              <DarkModeToggle />
            </div>

            {/* ─── User Dropdown ─── */}
            <div className="ml-1 md:ml-2 relative" ref={dropdownRef}>
              {status === 'loading' ? (
                <div className="w-24 sm:w-28 md:w-32 h-8 md:h-10 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" />
              ) : session ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 md:gap-2 bg-gray-900 dark:bg-white/10 dark:hover:bg-white/20 dark:border dark:border-white/10 text-white py-1.5 px-2.5 md:py-2 md:px-4 rounded-full text-xs md:text-sm font-semibold transition-colors shadow-lg hover:bg-gray-800"
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 dark:bg-black/20 overflow-hidden flex-shrink-0 flex items-center justify-center ring-2 ring-white/10">
                      {userAvatar ? (
                        <img
                          key={userAvatar}
                          src={userAvatar}
                          alt={userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white dark:text-gray-300" />
                      )}
                    </div>
                    <span className="max-w-[60px] sm:max-w-[80px] md:max-w-[100px] truncate hidden xs:inline">
                      {userName}
                    </span>
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* ─── Dropdown Menu ─── */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-1.5 sm:p-2">
                          {dropdownItems.map((item, index) => {
                            const Icon = item.icon;
                            const isLast = index === dropdownItems.length - 1;
                            if (item.href) {
                              return (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setDropdownOpen(false)}
                                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    isLast
                                      ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                                  }`}
                                >
                                  <Icon className="w-4 h-5" />
                                  <span>{item.label}</span>
                                </Link>
                              );
                            }
                            return (
                              <button
                                key={item.label}
                                onClick={() => handleDropdownClick(item)}
                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                  isLast
                                    ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                                }`}
                              >
                                <Icon className="w-4 h-5" />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/auth/signin">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                  >
                    Sign In
                  </motion.div>
                </Link>
              )}
            </div>

            {/* ─── Mobile Menu Toggle ─── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 sm:p-2.5 bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Dropdown Menu ─── */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 top-[56px] sm:top-[60px] md:top-[76px] bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="md:hidden absolute left-3 right-3 sm:left-4 sm:right-4 top-[60px] sm:top-[68px] md:top-[84px] z-50 overflow-hidden"
              >
                <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3 shadow-2xl space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={menuItemVariants}>
                      <Link
                        href={item.href}
                        className={`block px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium transition-all ${
                          isActive(item.href)
                            ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={menuItemVariants}
                    className="pt-3 mt-3 border-t border-gray-200/50 dark:border-white/10 flex items-center justify-between px-2 sm:px-4 pb-2"
                  >
                    <CurrencySwitcher />
                    <DarkModeToggle />
                  </motion.div>

                  {/* ─── Mobile dropdown items ─── */}
                  <motion.div variants={menuItemVariants} className="pt-2 space-y-1">
                    {session ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          Profile
                        </Link>
                        <Link
                          href="/my-bookings"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          <BookOpen className="w-5 h-5" />
                          My Bookings
                        </Link>
                        <button
                          onClick={() => {
                            toggleChatbot();
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                        >
                          <MessageSquare className="w-5 h-5" />
                          {isChatbotVisible ? 'Hide Chatbot' : 'Show Chatbot'}
                        </button>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' });
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/signin"
                        className="flex items-center justify-center w-full bg-blue-600 text-white py-3.5 rounded-xl sm:rounded-2xl font-semibold active:scale-[0.98] transition-transform shadow-lg shadow-blue-600/20"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}