'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
}

export default function AdminTours() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Authentication & Data Fetch
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setAuthChecking(false);
    fetchTours(token);
  }, [router]);

  const fetchTours = async (token: string) => {
    try {
      const res = await fetch('/api/tours', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch tours');
      
      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      alert('Failed to load tours. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`/api/tours/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete tour');

      // Refresh list
      await fetchTours(token!);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete tour. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (authChecking || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold">Manage Tours</h1>

          <Link
            href="/admin/tours/new"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <Plus size={18} />
            Add New Tour
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tour Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tours.map((tour) => (
                  <tr 
                    key={tour.id} 
                    className="hover:bg-gray-800/70 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-700"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 
                            'https://via.placeholder.com/56x56/374151/9CA3AF?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-5 font-medium text-white">{tour.name}</td>
                    <td className="px-6 py-5 text-gray-400">{tour.location}</td>
                    <td className="px-6 py-5 text-gray-400">{tour.duration}</td>
                    <td className="px-6 py-5 font-semibold text-emerald-400">
                      ${tour.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/tours/${tour.id}/edit`}
                          className="text-blue-400 hover:text-blue-300 transition p-2 hover:bg-gray-800 rounded-lg"
                          title="Edit Tour"
                        >
                          <Edit size={20} />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(tour.id)}
                          disabled={deletingId === tour.id}
                          className="text-red-400 hover:text-red-300 transition p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
                          title="Delete Tour"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {tours.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-gray-500" /> {/* You can import Compass if needed */}
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Tours Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't created any tours yet. Start building your collection by adding your first tour.
            </p>
            <Link
              href="/admin/tours/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-medium"
            >
              <Plus size={20} />
              Add Your First Tour
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}