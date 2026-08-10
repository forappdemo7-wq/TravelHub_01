'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, ArrowLeft, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export default function AdminTestimonials() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Authentication + Data Fetch
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setAuthChecking(false);
    fetchTestimonials(token);
  }, [router]);

  const fetchTestimonials = async (token: string) => {
    try {
      const res = await fetch('/api/testimonials', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch testimonials');

      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      alert('Failed to load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete testimonial');

      await fetchTestimonials(token!);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete testimonial. Please try again.');
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

          <h1 className="text-2xl font-bold">Manage Testimonials</h1>

          <Link
            href="/admin/testimonials/new"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <Plus size={18} />
            Add Testimonial
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {testimonials.map((testimonial) => (
                  <tr 
                    key={testimonial.id} 
                    className="hover:bg-gray-800/70 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-700"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 
                            'https://via.placeholder.com/48x48/374151/9CA3AF?text=User';
                        }}
                      />
                    </td>
                    <td className="px-6 py-5 font-medium text-white">{testimonial.name}</td>
                    <td className="px-6 py-5 text-gray-400">{testimonial.location}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-semibold">{testimonial.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-400 max-w-md truncate">
                      {testimonial.comment}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
                          className="text-blue-400 hover:text-blue-300 transition p-2 hover:bg-gray-800 rounded-lg"
                          title="Edit Testimonial"
                        >
                          <Edit size={20} />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deletingId === testimonial.id}
                          className="text-red-400 hover:text-red-300 transition p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
                          title="Delete Testimonial"
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
        {testimonials.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Testimonials Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't added any customer testimonials yet. 
              Share positive experiences from your travelers.
            </p>
            <Link
              href="/admin/testimonials/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-medium"
            >
              <Plus size={20} />
              Add First Testimonial
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}