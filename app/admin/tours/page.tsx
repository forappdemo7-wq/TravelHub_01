'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft  // ✅ Import ArrowLeft
} from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  featured: boolean;
}

export default function AdminTours() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTours();
  }, [router]);

  const fetchTours = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/tours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tours');
      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load tours. Please try refreshing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/tours?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setTours(tours.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete tour');
    } finally {
      setDeleting(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    setToggling(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/tours?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (!res.ok) throw new Error('Failed to toggle featured');
      const updated = await res.json();
      setTours(tours.map(t => t.id === id ? updated : t));
    } catch (err) {
      alert('Failed to update featured status');
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ─── Header ─── */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          {/* Left: Back to Dashboard */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          {/* Center: Page Title */}
          <h1 className="text-2xl font-bold text-white">Manage Tours</h1>

          {/* Right: Add New Tour */}
          <Link
            href="/admin/tours/new"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-white transition"
          >
            <Plus size={18} />
            Add New Tour
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* ─── Rest of the page ─── */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {tours.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Tours Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Create your first tour to start showcasing your trips.</p>
            <Link href="/admin/tours/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
              <Plus size={18} /> Add Your First Tour
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-950/50 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {tour.image ? (
                            <img src={tour.image} alt={tour.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                              <Compass className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <span className="font-medium text-white">{tour.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-gray-300">{tour.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-gray-300">${tour.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300">{tour.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(tour.id, tour.featured)}
                          disabled={toggling === tour.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            tour.featured
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {toggling === tour.id ? <span className="inline-block animate-spin">⟳</span> : tour.featured ? <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Yes</span> : <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> No</span>}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/tours/${tour.id}`} className="p-2 text-gray-400 hover:text-blue-400 transition rounded-lg hover:bg-blue-400/10">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(tour.id)} disabled={deleting === tour.id} className="p-2 text-gray-400 hover:text-red-400 transition rounded-lg hover:bg-red-400/10 disabled:opacity-50">
                            {deleting === tour.id ? <span className="inline-block animate-spin">⟳</span> : <Trash2 size={18} />}
                          </button>
                          <Link href={`/tours/${tour.id}`} target="_blank" className="p-2 text-gray-400 hover:text-emerald-400 transition rounded-lg hover:bg-emerald-400/10">
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}