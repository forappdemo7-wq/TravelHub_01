'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Anchor, 
  Clock, 
  Utensils, 
  Compass, 
  AlertCircle, 
  XCircle, 
  CheckCircle2, 
  Clock3,
  ArrowRight,
  Filter
} from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useCurrency } from '@/app/context/CurrencyContext';

interface Booking {
  id: string;
  itemType: 'tour' | 'cruise' | 'restaurant' | 'destination';
  itemName: string;
  itemImage: string;
  travelers: number;
  totalPrice: number;
  travelDate: string;
  status: string;
  bookingDate: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// Cinematic Skeleton Loader
const SkeletonBookingCard = () => (
  <div className="rounded-3xl border border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl animate-pulse h-[440px] flex flex-col overflow-hidden">
    <div className="h-48 bg-gray-300/40 dark:bg-white/10 w-full" />
    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="h-6 bg-gray-300/40 dark:bg-white/10 rounded-full w-3/4" />
        <div className="h-4 bg-gray-300/40 dark:bg-white/10 rounded-full w-1/3" />
      </div>
      <div className="h-10 bg-gray-300/40 dark:bg-white/10 rounded-2xl w-full" />
      <div className="h-10 bg-gray-300/40 dark:bg-white/10 rounded-xl w-full" />
    </div>
  </div>
);

export default function MyBookingsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const { formatPrice } = useCurrency();

  const fetchBookings = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(session.user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchBookings();
    } else if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [sessionStatus, fetchBookings]);

  const cancelBooking = async (bookingId: string, currentStatus: string, bookingDate: string) => {
    const now = new Date();
    const bookingDateTime = new Date(bookingDate);
    const hoursSinceBooking = (now.getTime() - bookingDateTime.getTime()) / (1000 * 60 * 60);

    if (currentStatus === 'completed') {
      alert('Completed bookings cannot be cancelled.');
      return;
    }
    if (currentStatus === 'cancelled') {
      alert('This booking is already cancelled.');
      return;
    }
    if (currentStatus === 'confirmed' && hoursSinceBooking > 48) {
      alert('You can only cancel a confirmed booking within 48 hours of making it.');
      return;
    }
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(bookingId);

    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'cancelled' }),
      });
      if (res.ok) {
        await fetchBookings();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel booking.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const getDeadlineMessage = (status: string, bookingDate: string) => {
    if (status !== 'confirmed') return null;
    const deadline = new Date(new Date(bookingDate).getTime() + 48 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > deadline) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-3 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Cancellation period has expired</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mt-3 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
        <Clock3 className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Cancel before {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status.toLowerCase() === activeFilter;
  });

  // Unauthenticated State
  if (sessionStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden pt-32 pb-20 flex items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 max-w-md relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-8 text-center bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl shadow-2xl">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Sign In Required</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                Please sign in to access your itinerary, view upcoming bookings, and manage reservations.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full rounded-2xl py-3.5 text-sm font-semibold shadow-lg shadow-blue-500/25">
                  Sign In to TravelHub
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden pt-32 pb-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3"
            >
              My Bookings
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 text-lg"
            >
              Manage all your travel, dining, and experience reservations in one place
            </motion.p>
          </div>

          {/* Filter Pills */}
          {!loading && bookings.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 p-1.5 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl self-start md:self-auto overflow-x-auto"
            >
              {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-300 ${
                    activeFilter === tab
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonBookingCard key={i} />)}
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-12 text-center bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl max-w-2xl mx-auto shadow-xl">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No Bookings Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                You haven't made any reservations yet. Explore our top curated destinations, luxury cruises, and finest restaurants to get started!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                <Link href="/tours">
                  <Button variant="outline" className="w-full text-xs py-3 rounded-2xl dark:border-white/10">Tours</Button>
                </Link>
                <Link href="/cruises">
                  <Button variant="outline" className="w-full text-xs py-3 rounded-2xl dark:border-white/10">Cruises</Button>
                </Link>
                <Link href="/restaurants">
                  <Button variant="outline" className="w-full text-xs py-3 rounded-2xl dark:border-white/10">Dining</Button>
                </Link>
                <Link href="/destinations">
                  <Button variant="outline" className="w-full text-xs py-3 rounded-2xl dark:border-white/10">Explore</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ) : filteredBookings.length === 0 ? (
          /* Empty Filter State */
          <div className="text-center py-20 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-white/5">
            <Filter className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No bookings match the status "{activeFilter}".</p>
          </div>
        ) : (
          /* Bookings Grid */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredBookings.map((booking) => {
                // Determine icon & labels
                let icon;
                let typeLabel;
                switch (booking.itemType) {
                  case 'tour':
                    icon = <MapPin className="w-3.5 h-3.5 text-blue-500" />;
                    typeLabel = 'Tour';
                    break;
                  case 'cruise':
                    icon = <Anchor className="w-3.5 h-3.5 text-cyan-500" />;
                    typeLabel = 'Cruise';
                    break;
                  case 'restaurant':
                    icon = <Utensils className="w-3.5 h-3.5 text-rose-500" />;
                    typeLabel = 'Restaurant';
                    break;
                  case 'destination':
                    icon = <Compass className="w-3.5 h-3.5 text-emerald-500" />;
                    typeLabel = 'Destination';
                    break;
                  default:
                    icon = <MapPin className="w-3.5 h-3.5 text-gray-500" />;
                    typeLabel = 'Trip';
                }

                const guestLabel = booking.itemType === 'restaurant' ? 'guest(s)' : 'traveler(s)';
                const isCancelling = cancellingId === booking.id;

                return (
                  <motion.div key={booking.id} variants={itemVariants} layout>
                    <Card className="group relative bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full">
                      
                      {/* Card Image Banner */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={booking.itemImage}
                          alt={booking.itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Type Badge */}
                        <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-white">
                          {icon}
                          <span className="uppercase tracking-wider text-[10px]">{typeLabel}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm flex items-center gap-1.5 ${
                            booking.status === 'confirmed' 
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                            booking.status === 'pending' 
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                            booking.status === 'cancelled' 
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                              'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-emerald-500 animate-pulse' :
                              booking.status === 'pending' ? 'bg-amber-500' :
                              booking.status === 'cancelled' ? 'bg-rose-500' : 'bg-gray-500'
                            }`} />
                            <span className="capitalize">{booking.status}</span>
                          </span>
                        </div>

                        {/* Date Pill Overlay */}
                        <div className="absolute bottom-3 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {new Date(booking.travelDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-2 group-hover:text-blue-500 transition-colors">
                            {booking.itemName}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>{booking.travelers} {guestLabel}</span>
                          </div>
                        </div>

                        {/* Financials & Metadata */}
                        <div>
                          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-end">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Total Paid</p>
                              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                                {formatPrice(booking.totalPrice)}
                              </p>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              Booked {new Date(booking.bookingDate).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Cancellation Expiry Notice */}
                          {getDeadlineMessage(booking.status, booking.bookingDate)}

                          {/* Action Button */}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                              onClick={() => cancelBooking(booking.id, booking.status, booking.bookingDate)}
                              disabled={isCancelling}
                              className="mt-5 w-full py-3 px-4 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 active:scale-[0.98] transition-all text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {isCancelling ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Cancel Reservation
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}