'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, ArrowLeft, CheckCircle, XCircle, Star } from 'lucide-react';

interface Cruise {
  id: string;
  name: string;
  ship: string;
  image: string;
  price: number;
  duration: string;
  rating?: number;     // ✅ added
  featured: boolean;
}

export default function AdminCruises() {
  const router = useRouter();
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setAuthChecking(false);
    fetchCruises(token);
  }, [router]);

  const fetchCruises = async (token: string) => {
    try {
      const res = await fetch('/api/cruises', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch cruises');
      const data = await res.json();
      setCruises(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cruises:', error);
      alert('Failed to load cruises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cruise?')) return;
    setDeletingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/cruises?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchCruises(token!);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete cruise.');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    setTogglingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/cruises?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (!res.ok) throw new Error('Failed to toggle featured');
      const updated = await res.json();
      setCruises(cruises.map(c => c.id === id ? { ...c, featured: updated.featured } : c));
    } catch (error) {
      console.error('Toggle featured error:', error);
      alert('Failed to update featured status');
    } finally {
      setTogglingId(null);
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
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Manage Cruises</h1>
          <Link
            href="/admin/cruises/new"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <Plus size={18} />
            Add New Cruise
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-800">
  <tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cruise Name</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ship</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th></tr>
</thead>
              <tbody className="divide-y divide-gray-800">
                {cruises.map((cruise) => (
                  <tr key={cruise.id} className="hover:bg-gray-800/70 transition-colors group">
                    <td className="px-6 py-5">
                      <img
                        src={cruise.image}
                        alt={cruise.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-700"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://via.placeholder.com/56x56/374151/9CA3AF?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-5 font-medium text-white">{cruise.name}</td>
                    <td className="px-6 py-5 text-gray-400">{cruise.ship}</td>
                    <td className="px-6 py-5 text-gray-400">{cruise.duration}</td>
                    <td className="px-6 py-5 font-semibold text-emerald-400">
                      ${cruise.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      {cruise.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-300">{cruise.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleFeatured(cruise.id, cruise.featured)}
                        disabled={togglingId === cruise.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          cruise.featured
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                        } disabled:opacity-50`}
                      >
                        {togglingId === cruise.id ? (
                          <span className="inline-block animate-spin">⟳</span>
                        ) : cruise.featured ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> No
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/cruises/${cruise.id}/edit`}
                          className="text-blue-400 hover:text-blue-300 transition p-2 hover:bg-gray-800 rounded-lg"
                          title="Edit Cruise"
                        >
                          <Edit size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(cruise.id)}
                          disabled={deletingId === cruise.id}
                          className="text-red-400 hover:text-red-300 transition p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
                          title="Delete Cruise"
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

        {cruises.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-4xl">🚢</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Cruises Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't added any cruises yet. Start by creating your first cruise package.
            </p>
            <Link
              href="/admin/cruises/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-medium"
            >
              <Plus size={20} />
              Add Your First Cruise
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}