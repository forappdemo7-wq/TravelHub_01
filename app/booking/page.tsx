'use client';

import Link from 'next/link';
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { BookingFormData } from '@/app/types';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { useCurrency } from '@/app/context/CurrencyContext';

function BookingContent() {
  const { data: session, status: sessionStatus } = useSession();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tourId = searchParams.get('tourId');
  const cruiseId = searchParams.get('cruiseId');
  const restaurantId = searchParams.get('restaurantId');
  const destinationId = searchParams.get('destinationId'); 

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [type, setType] = useState<'tour' | 'cruise' | 'restaurant' | 'destination' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loadingItem, setLoadingItem] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();
  const travelers = watch('travelers', 1);

  // Redirect if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/booking' + window.location.search);
    }
  }, [sessionStatus, router]);

  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setValue('email', session.user.email);
    }
  }, [session, setValue]);

  // Fetch the selected item
  useEffect(() => {
    const fetchItem = async () => {
      setLoadingItem(true);
      try {
        let endpoint = '';
        if (tourId) endpoint = `/api/tours/${tourId}`;
        else if (cruiseId) endpoint = `/api/cruises/${cruiseId}`;
        else if (restaurantId) endpoint = `/api/restaurants/${restaurantId}`;
        else if (destinationId) endpoint = `/api/destinations/${destinationId}`;
        
        if (endpoint) {
          const res = await fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            if (destinationId) {
              setSelectedItem({
                id: data.slug,
                name: data.name,
                image: data.image,
                price: data.price,
                description: data.description,
                location: data.country, 
                duration: data.duration,
              });
              setType('destination');
            } else {
              setSelectedItem(data);
              setType(tourId ? 'tour' : cruiseId ? 'cruise' : 'restaurant');
            }
          } else {
            setSelectedItem(null);
          }
        }
      } catch (err) {
        console.error(err);
        setSelectedItem(null);
      } finally {
        setLoadingItem(false);
      }
    };
    fetchItem();
  }, [tourId, cruiseId, restaurantId, destinationId]);

  // Auto scroll to top when booking is successfully submitted
  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  const onSubmit = async (data: BookingFormData) => {
    if (!session?.user?.email || !selectedItem) return;

    const totalPrice = selectedItem.price * data.travelers;

    const bookingData = {
      id: `BK-${Date.now()}`,
      userId: session.user.email,
      userName: data.name,
      userEmail: session.user.email,
      userPhone: data.phone,
      itemId: selectedItem.id,
      itemType: type,
      itemName: selectedItem.name,
      itemImage: selectedItem.image,
      itemPrice: selectedItem.price,
      travelers: data.travelers,
      totalPrice: totalPrice,
      travelDate: data.date,
      specialRequests: data.specialRequests || '',
      status: 'pending',
      bookingDate: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        const savedBooking = await res.json();
        setBookingId(savedBooking.id || `BK-${Date.now()}`);
        setSubmitted(true);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  // -------------------------------------------------------------
  // RENDER STATES
  // -------------------------------------------------------------

  if (sessionStatus === 'loading' || loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" />
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading your experience...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 pt-24">
        <Card className="max-w-lg w-full p-10 text-center shadow-2xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900 rounded-3xl">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-gray-900 dark:text-white">Booking Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Your request has been successfully submitted. We will notify you once the admin approves your reservation.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
            <p className="font-mono font-medium text-gray-900 dark:text-gray-200">{bookingId}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/my-bookings" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full py-3">View My Bookings</Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full py-3">Return Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedItem && !loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 pt-24 px-4">
        <Card className="max-w-md w-full p-8 text-center shadow-lg rounded-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-3 dark:text-white">Experience Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We couldn't find the item you're trying to book. It may have been removed or the link is invalid.
          </p>
          <Link href="/">
            <Button className="w-full py-3">Browse Experiences</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Determine display fields
  let locationField = '';
  if (type === 'tour') locationField = selectedItem.location;
  else if (type === 'cruise') locationField = selectedItem.ship;
  else if (type === 'restaurant') locationField = selectedItem.address;
  else if (type === 'destination') locationField = selectedItem.location;

  const maxGuests = type === 'restaurant' ? 20 : 10;
  const currentTotal = selectedItem.price * (travelers || 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {type === 'restaurant' ? 'Secure Your Table' : 'Review & Confirm'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Almost there! Please enter your details below to complete your reservation.
          </p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
          {/* LEFT COLUMN: FORM */}
          <div className="flex-1">
            <Card className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
                Primary Guest Information
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input
                      {...register('phone', { required: 'Phone number is required' })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {type === 'restaurant' ? 'Reservation Date' : 'Travel Date'}
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                  </div>
                </div>

                {/* Number of Guests (Full Width) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Number of Guests (Max {maxGuests})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={maxGuests}
                    {...register('travelers', {
                      required: 'Number of guests is required',
                      min: { value: 1, message: 'At least 1 guest' },
                      max: { value: maxGuests, message: `Maximum ${maxGuests} guests` }
                    })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                  />
                  {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers.message}</p>}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    {...register('specialRequests')}
                    rows={4}
                    placeholder="Dietary restrictions, accessibility needs, or celebrations..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white resize-none"
                  />
                </div>

                {/* Mobile Submit Button (Hidden on Desktop, shown via flex order if needed, but placed here naturally) */}
                <div className="pt-6 lg:hidden border-t border-gray-100 dark:border-gray-800">
                  <Button type="submit" size="lg" className="w-full py-4 text-lg font-semibold rounded-xl">
                    {type === 'restaurant' ? `Reserve Table • ${formatPrice(currentTotal)}` : `Confirm Booking • ${formatPrice(currentTotal)}`}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* RIGHT COLUMN: STICKY SUMMARY */}
          <div className="lg:w-[400px] xl:w-[450px] shrink-0">
            <div className="sticky top-24">
              <Card className="overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
                {/* Header Image */}
                <div className="relative h-56 w-full">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded-md mb-2 inline-block">
                      {type}
                    </span>
                    <h2 className="text-2xl font-bold text-white shadow-sm leading-tight">
                      {selectedItem.name}
                    </h2>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-gray-400">📍</div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-gray-200 font-medium">{locationField}</p>
                      </div>
                    </div>

                    {type === 'destination' && selectedItem.duration && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">⏱</div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="text-gray-900 dark:text-gray-200 font-medium">{selectedItem.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Price Details</h3>
                    <div className="flex justify-between items-center mb-3 text-gray-600 dark:text-gray-300">
                      <span>{formatPrice(selectedItem.price)} × {travelers || 1} guest{(travelers > 1) ? 's' : ''}</span>
                      <span className="font-medium">{formatPrice(selectedItem.price * (travelers || 1))}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-500">
                        {formatPrice(currentTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Submit Button (Linked to Form via API or triggers form submission) */}
                  <Button 
                    type="button" 
                    size="lg" 
                    className="w-full mt-8 py-4 text-lg font-semibold rounded-xl hidden lg:block shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                    onClick={() => {
                      const form = document.querySelector('form');
                      if (form) form.requestSubmit();
                    }}
                  >
                    {type === 'restaurant' ? 'Reserve Table' : 'Confirm Booking'}
                  </Button>
                  <p className="text-center text-xs text-gray-500 mt-4 hidden lg:block">
                    You won't be charged yet
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}