'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditTestimonial() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: '',
    comment: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/testimonials/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFormData({
      name: data.name,
      location: data.location,
      rating: data.rating,
      comment: data.comment,
      image: data.image,
    });
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/testimonials/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        rating: Number(formData.rating),
      }),
    });
    if (res.ok) {
      router.push('/admin/testimonials');
    } else {
      alert('Failed to update testimonial');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link href="/admin/testimonials" className="text-white hover:text-gray-300">← Back to Testimonials</Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Testimonial</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating (1-5)</label>
            <input
              type="number"
              step="1"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (profile picture)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
            <textarea
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/testimonials" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}