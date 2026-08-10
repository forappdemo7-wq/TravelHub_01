'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditTour() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    duration: '',
    price: '',
    rating: '',
    image: '',
    description: '',
    highlights: [''],
    included: [''],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTour();
  }, []);

  const fetchTour = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/tours/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFormData({
      name: data.name,
      location: data.location,
      duration: data.duration,
      price: data.price,
      rating: data.rating,
      image: data.image,
      description: data.description,
      highlights: data.highlights?.length ? data.highlights : [''],
      included: data.included?.length ? data.included : [''],
    });
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/tours/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        highlights: formData.highlights.filter(h => h),
        included: formData.included.filter(i => i),
      }),
    });
    if (res.ok) {
      router.push('/admin/tours');
    } else {
      alert('Failed to update tour');
    }
    setSubmitting(false);
  };

  const handleArrayChange = (field: 'highlights' | 'included', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'highlights' | 'included') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link href="/admin/tours" className="text-white hover:text-gray-300">← Back to Tours</Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Tour</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tour Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Highlights</label>
            {formData.highlights.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                placeholder={`Highlight ${index + 1}`}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white mb-2"
              />
            ))}
            <button type="button" onClick={() => addArrayItem('highlights')} className="text-blue-400 text-sm">
              + Add Highlight
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">What's Included</label>
            {formData.included.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('included', index, e.target.value)}
                placeholder={`Included ${index + 1}`}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white mb-2"
              />
            ))}
            <button type="button" onClick={() => addArrayItem('included')} className="text-blue-400 text-sm">
              + Add Included Item
            </button>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/tours" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}