'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  Ship, 
  Star, 
  LogOut, 
  Plus, 
  Eye, 
  Settings,
  AlertCircle,
  Activity,
  Calendar
} from 'lucide-react';

interface Stats {
  tours: number;
  cruises: number;
  testimonials: number;
  bookings: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ tours: 0, cruises: 0, testimonials: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setAuthChecking(false);
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      setError(null);
      const [toursRes, cruisesRes, testimonialsRes, bookingsRes] = await Promise.all([
        fetch('/api/tours', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/cruises', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/testimonials', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!toursRes.ok || !cruisesRes.ok || !testimonialsRes.ok || !bookingsRes.ok) {
        throw new Error('Failed to fetch some dashboard metrics.');
      }

      const tours = await toursRes.json();
      const cruises = await cruisesRes.json();
      const testimonials = await testimonialsRes.json();
      const bookings = await bookingsRes.json();

      setStats({
        tours: Array.isArray(tours) ? tours.length : 0,
        cruises: Array.isArray(cruises) ? cruises.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        bookings: Array.isArray(bookings) ? bookings.length : 0,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Unable to load dashboard statistics. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const statCards = [
    {
      title: 'Total Tours',
      value: stats.tours,
      icon: Compass,
      href: '/admin/tours',
      linkText: 'Manage Tours',
      gradient: 'from-blue-600 to-blue-800',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-200',
    },
    {
      title: 'Total Cruises',
      value: stats.cruises,
      icon: Ship,
      href: '/admin/cruises',
      linkText: 'Manage Cruises',
      gradient: 'from-purple-600 to-purple-800',
      textColor: 'text-purple-100',
      iconColor: 'text-purple-200',
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: Star,
      href: '/admin/testimonials',
      linkText: 'Manage Testimonials',
      gradient: 'from-amber-600 to-amber-800',
      textColor: 'text-amber-100',
      iconColor: 'text-amber-200',
    },
    {
      title: 'Total Bookings',
      value: stats.bookings,
      icon: Calendar,
      href: '/admin/bookings',
      linkText: 'Manage Bookings',
      gradient: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-100',
      iconColor: 'text-emerald-200',
    }
  ];

  const quickActions = [
    { title: 'Add Tour', icon: Plus, href: '/admin/tours/new', color: 'text-blue-400', hoverBorder: 'hover:border-blue-500' },
    { title: 'Add Cruise', icon: Ship, href: '/admin/cruises/new', color: 'text-purple-400', hoverBorder: 'hover:border-purple-500' },
    { title: 'Add Review', icon: Star, href: '/admin/testimonials/new', color: 'text-amber-400', hoverBorder: 'hover:border-amber-500' },
    { title: 'Settings', icon: Settings, href: '/admin/settings', color: 'text-green-400', hoverBorder: 'hover:border-green-500' },
    { title: 'Live Site', icon: Eye, href: '/', target: '_blank', color: 'text-emerald-400', hoverBorder: 'hover:border-emerald-500' }
  ];

  if (authChecking) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 text-gray-100 selection:bg-blue-500/30 overflow-y-auto">
      <header className="bg-gray-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl">
              <Compass className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">TravelHub</span>
              <p className="text-xs text-blue-400 font-medium">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-2 text-lg">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-medium text-gray-300 shadow-sm">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}
            >
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className={`${card.textColor} text-sm font-medium tracking-wide uppercase`}>
                    {card.title}
                  </p>
                  {loading ? (
                    <div className="h-12 w-24 bg-white/20 animate-pulse rounded-lg mt-4"></div>
                  ) : (
                    <p className="text-5xl font-bold mt-4 text-white drop-shadow-sm">
                      {card.value}
                    </p>
                  )}
                </div>
                <div className={`p-4 bg-white/10 rounded-2xl backdrop-blur-sm ${card.iconColor}`}>
                  <card.icon className="w-10 h-10" />
                </div>
              </div>
              <Link 
                href={card.href} 
                className="inline-flex items-center gap-2 mt-8 text-white/80 hover:text-white text-sm font-semibold relative z-10"
              >
                {card.linkText} 
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-lg mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                href={action.href}
                target={action.target}
                className={`group bg-gray-950/50 hover:bg-gray-800/80 p-6 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 border border-white/5 ${action.hoverBorder} hover:shadow-lg`}
              >
                <div className={`p-3 rounded-xl bg-gray-900 group-hover:bg-gray-950 transition-colors ${action.color}`}>
                  <action.icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-semibold text-gray-300 group-hover:text-white text-sm">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-lg relative overflow-hidden">
          <h2 className="text-xl font-bold text-white tracking-tight mb-6 relative z-10">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center relative z-10 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-950/30">
            <div className="p-4 bg-gray-900 rounded-full mb-4">
              <Activity className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No recent activity</h3>
            <p className="text-gray-500 max-w-sm">
              This section will display the latest changes, bookings, and updates once you start managing content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}