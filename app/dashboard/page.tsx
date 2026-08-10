'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPinned, Anchor, LogOut, 
  Compass, User, Trash2, Globe, Sailboat, Luggage, Headset, UserCog, Settings, Utensils
} from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useTheme } from 'next-themes';
import { useFavorites } from '@/app/hooks/useFavorites';

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const { formatPrice } = useCurrency();
  const { resolvedTheme } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  // When favorites are loaded, stop loading
  useEffect(() => {
    if (sessionStatus !== 'loading') {
      setLoading(false);
    }
  }, [sessionStatus]);

  // ─── Remove favorite ──────────────────────────────────────────────
  const removeFavorite = async (id: string) => {
    const fav = favorites.find(f => f.id === id);
    if (!fav) return;

    await toggleFavorite({
      itemId: fav.itemId,
      itemType: fav.itemType as any,
      itemName: fav.itemName,
      itemImage: fav.itemImage,
      itemPrice: fav.itemPrice,
    });
  };

  // ─── Theme-aware styles ──────────────────────────────────────────
  const bgClass = isLight ? 'bg-slate-50' : 'bg-[#0B0F19]';
  const cardBg = isLight ? 'bg-white/80' : 'bg-gray-800/40';
  const cardBorder = isLight ? 'border-slate-200/60' : 'border-gray-700/50';
  const cardHoverBorder = isLight ? 'hover:border-slate-300' : 'hover:border-gray-500/50';
  const textClass = isLight ? 'text-slate-900' : 'text-white';
  const subTextClass = isLight ? 'text-slate-600' : 'text-gray-400';
  const mutedText = isLight ? 'text-slate-500' : 'text-gray-500';

  // ─── Skeleton loading ────────────────────────────────────────────
  if (sessionStatus === 'loading' || loading) {
    return (
      <div className={`min-h-screen ${bgClass} pt-24 pb-12 px-6 transition-colors duration-500`}>
        <div className="container mx-auto max-w-6xl animate-pulse">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-4 items-center">
              <div className={`w-16 h-16 ${isLight ? 'bg-slate-200' : 'bg-gray-800'} rounded-full`} />
              <div className="space-y-3">
                <div className={`h-6 w-48 ${isLight ? 'bg-slate-200' : 'bg-gray-800'} rounded-md`} />
                <div className={`h-4 w-32 ${isLight ? 'bg-slate-200' : 'bg-gray-800'} rounded-md`} />
              </div>
            </div>
            <div className={`h-10 w-24 ${isLight ? 'bg-slate-200' : 'bg-gray-800'} rounded-lg`} />
          </div>
          <div className={`h-8 w-40 ${isLight ? 'bg-slate-200' : 'bg-gray-800'} rounded-md mb-6`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-32 ${isLight ? 'bg-slate-200' : 'bg-gray-800'} rounded-2xl`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Unauthenticated state ──────────────────────────────────────
  if (sessionStatus === 'unauthenticated') {
    return (
      <div className={`min-h-screen ${bgClass} pt-24 pb-12 flex items-center transition-colors duration-500`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className={`p-10 text-center ${cardBg} backdrop-blur-xl border ${cardBorder} shadow-2xl`}>
              <div className={`w-16 h-16 ${isLight ? 'bg-blue-100' : 'bg-blue-500/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <User size={32} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
              </div>
              <h1 className={`text-3xl font-bold mb-3 ${textClass}`}>Welcome Back</h1>
              <p className={`${subTextClass} mb-8 leading-relaxed`}>
                Please sign in to access your bookings, favorites, and personal travel dashboard.
              </p>
              <Link href="/auth/signin" className="block w-full">
                <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  Sign In to Continue
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'Traveler';
  const userInitial = firstName.charAt(0).toUpperCase();

  // ─── Helper functions for favorites ──────────────────────────────
  const getFavoriteIcon = (type: string, className = "w-4 h-4") => {
    const iconProps = { size: 14, className };
    switch (type) {
      case 'tour': return <MapPinned {...iconProps} className={`${className} text-emerald-400`} />;
      case 'cruise': return <Anchor {...iconProps} className={`${className} text-blue-400`} />;
      case 'restaurant': return <Utensils {...iconProps} className={`${className} text-amber-400`} />;
      case 'destination': return <Compass {...iconProps} className={`${className} text-purple-400`} />;
      default: return <MapPinned {...iconProps} className={`${className} text-gray-400`} />;
    }
  };

  const getFavoriteLink = (fav: any) => {
    switch (fav.itemType) {
      case 'tour': return `/tours/${fav.itemId}`;
      case 'cruise': return `/cruises/${fav.itemId}`;
      case 'restaurant': return `/restaurants/${fav.itemId}`;
      case 'destination': return `/destinations/${fav.itemId}`;
      default: return '#';
    }
  };

  const getFavoriteLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className={`min-h-screen ${bgClass} pb-16 pt-24 selection:bg-blue-500/30 transition-colors duration-500`}>
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* ─── HEADER ─── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${cardBg} border ${cardBorder} p-6 md:p-8 rounded-3xl backdrop-blur-md transition-colors duration-500`}>
            <div className="flex items-center gap-5">
              {session?.user?.avatar ? (
                <img
                  key={session.user.avatar}
                  src={session.user.avatar}
                  alt={session.user.name || 'User'}
                  className="w-16 h-16 rounded-full border-2 border-blue-500/50 object-cover shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className={`w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 text-2xl font-bold text-white`}>
                  {userInitial}
                </div>
              )}
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${textClass}`}>
                  Welcome, {firstName}
                </h1>
                <p className={`${subTextClass} mt-1 flex items-center gap-2`}>
                  <Compass size={16} className="text-blue-400" />
                  Your personal travel hub
                </p>
              </div>
            </div>
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              variant="outline" 
              className={`flex items-center gap-2 border ${isLight ? 'border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300' : 'border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'} transition-all`}
            >
              <LogOut size={18} /> Sign Out
            </Button>
          </div>
        </motion.div>

        {/* ─── QUICK ACTIONS ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-14"
        >
          <div className={`flex items-center gap-3 mb-6 px-2 ${textClass}`}>
            <Settings className="text-blue-400" size={24} />
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Browse Tours", href: "/tours", icon: Globe, color: "text-emerald-400", bg: isLight ? "group-hover:bg-emerald-100" : "group-hover:bg-emerald-500/20" },
              { label: "Browse Cruises", href: "/cruises", icon: Sailboat, color: "text-blue-400", bg: isLight ? "group-hover:bg-blue-100" : "group-hover:bg-blue-500/20" },
              { label: "My Bookings", href: "/my-bookings", icon: Luggage, color: "text-purple-400", bg: isLight ? "group-hover:bg-purple-100" : "group-hover:bg-purple-500/20" },
              { label: "Support", href: "/contact", icon: Headset, color: "text-rose-400", bg: isLight ? "group-hover:bg-rose-100" : "group-hover:bg-rose-500/20" },
              { label: "Edit Profile", href: "/dashboard/profile", icon: UserCog, color: "text-amber-400", bg: isLight ? "group-hover:bg-amber-100" : "group-hover:bg-amber-500/20" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="block group">
                <Card className={`h-full ${cardBg} border ${cardBorder} hover:${cardHoverBorder} p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isLight ? 'hover:shadow-slate-200' : 'hover:shadow-black/50'}`}>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`p-4 rounded-2xl mb-4 transition-colors duration-300 shadow-sm ${isLight ? 'bg-slate-100 shadow-slate-200' : 'bg-white/5 shadow-black/50 backdrop-blur-md border border-white/5'} ${action.bg}`}
                  >
                    <action.icon className={`${action.color} drop-shadow-md`} size={32} strokeWidth={1.5} />
                  </motion.div>
                  <div className={`font-medium ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-gray-200 group-hover:text-white'} transition-colors`}>
                    {action.label}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ─── FAVORITES SECTION ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className={`flex items-center gap-3 px-2 ${textClass}`}>
              <Heart className="text-rose-400" size={24} />
              <h2 className="text-2xl font-semibold">Your Favorites</h2>
              <span className={`${isLight ? 'bg-slate-200 text-slate-700' : 'bg-gray-800 text-gray-300'} text-xs py-1 px-2.5 rounded-full ml-2`}>
                {favorites.length}
              </span>
            </div>

            {favorites.length === 0 ? (
              <Card className={`p-12 ${cardBg} border ${isLight ? 'border-slate-300 border-dashed' : 'border-gray-800 border-dashed'} flex flex-col items-center justify-center text-center rounded-3xl`}>
                <div className={`w-16 h-16 ${isLight ? 'bg-slate-100' : 'bg-gray-800/50'} rounded-full flex items-center justify-center mb-4`}>
                  <Heart size={32} strokeWidth={1.5} className={isLight ? 'text-slate-400' : 'text-gray-500'} />
                </div>
                <h3 className={`text-xl font-medium ${subTextClass} mb-2`}>Your wishlist is empty</h3>
                <p className={`${mutedText} mb-6 max-w-sm`}>
                  Save your favorite tours, cruises, restaurants, and destinations here.
                </p>
                <Link href="/tours">
                  <Button className={`${isLight ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-black hover:bg-gray-200'}`}>
                    Explore Destinations
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <AnimatePresence>
                  {favorites.map((fav) => (
                    <motion.div
                      key={fav.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    >
                      <Card className={`${cardBg} border ${cardBorder} overflow-hidden group hover:${cardHoverBorder} transition-all duration-300 flex flex-col h-full rounded-2xl`}>
                        <div className="relative h-48 overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white/80 via-transparent to-transparent' : 'from-gray-900 via-transparent to-transparent'} z-10`} />
                          <img
                            src={fav.itemImage}
                            alt={fav.itemName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 ${isLight ? 'bg-white/80 text-slate-800 border-slate-200' : 'bg-black/60 text-gray-200 border-white/10'} backdrop-blur-md text-xs font-medium py-1 px-3 rounded-full border`}>
                            {getFavoriteIcon(fav.itemType, 'w-3.5 h-3.5')}
                            <span className="capitalize">{getFavoriteLabel(fav.itemType)}</span>
                          </div>
                          <button
                            onClick={() => removeFavorite(fav.id)}
                            className={`absolute top-3 right-3 z-20 p-2 ${isLight ? 'bg-white/80 text-slate-700 hover:bg-rose-500 hover:text-white' : 'bg-black/50 text-gray-300 hover:text-white hover:bg-rose-500'} backdrop-blur-md rounded-full transition-colors duration-200`}
                            title="Remove from favorites"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className={`text-xl font-semibold mb-3 line-clamp-2 ${isLight ? 'text-slate-800 group-hover:text-blue-600' : 'text-gray-100 group-hover:text-blue-400'} transition-colors`}>
                            {fav.itemName}
                          </h3>
                          <div className={`mt-auto flex justify-between items-end pt-4 border-t ${isLight ? 'border-slate-200' : 'border-gray-700/50'}`}>
                            <div>
                              <p className={`text-xs ${mutedText} mb-1`}>Starting from</p>
                              <span className={`text-lg font-bold ${textClass}`}>{formatPrice(fav.itemPrice)}</span>
                            </div>
                            <Link href={getFavoriteLink(fav)}>
                              <Button variant="outline" size="sm" className={`${isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-gray-600 hover:bg-white hover:text-black'}`}>
                                Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* ─── PROFILE INFO ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className={`flex items-center gap-3 px-2 ${textClass}`}>
              <UserCog className="text-purple-400" size={24} />
              <h2 className="text-2xl font-semibold">Account Details</h2>
            </div>
            
            <Card className={`p-6 ${cardBg} border ${cardBorder} rounded-3xl relative overflow-hidden`}>
              <div className={`absolute -right-10 -top-10 w-40 h-40 ${isLight ? 'bg-purple-200/30' : 'bg-purple-500/10'} rounded-full blur-3xl pointer-events-none`} />
              
              <div className="space-y-5 relative z-10">
                <div>
                  <label className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-gray-500'} uppercase tracking-wider mb-1 block`}>
                    Full Name
                  </label>
                  <p className={`${textClass} font-medium text-lg`}>{session?.user?.name}</p>
                </div>
                
                <div>
                  <label className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-gray-500'} uppercase tracking-wider mb-1 block`}>
                    Email Address
                  </label>
                  <p className={`${textClass} font-medium`}>{session?.user?.email}</p>
                </div>

                <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-gray-700/50'} mt-4`}>
                  <Link href="/dashboard/profile" className="block">
                    <Button className={`w-full ${isLight ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-gray-700 hover:bg-gray-600 text-white'} border-none shadow-none`}>
                      Manage Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${isLight ? 'bg-blue-50 border-blue-200' : 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-800/50'} rounded-3xl text-center border overflow-hidden relative`}>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/10 pointer-events-none" />
              <Headset size={40} strokeWidth={1.5} className={`mx-auto ${isLight ? 'text-blue-600' : 'text-blue-400'} mb-4 drop-shadow-lg relative z-10`} />
              <h3 className={`font-semibold ${textClass} mb-2 relative z-10`}>Need Assistance?</h3>
              <p className={`text-sm ${isLight ? 'text-blue-700/70' : 'text-blue-200/70'} mb-5 relative z-10`}>
                Our travel experts are available 24/7 to help you plan your next adventure.
              </p>
              <Link href="/contact" className="relative z-10">
                <Button variant="outline" size="sm" className={`w-full ${isLight ? 'border-blue-300 text-blue-700 hover:bg-blue-100' : 'border-blue-500/50 text-blue-300 hover:bg-blue-500 hover:text-white'} shadow-sm`}>
                  Contact Support
                </Button>
              </Link>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}