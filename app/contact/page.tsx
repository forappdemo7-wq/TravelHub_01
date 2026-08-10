'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Globe, ArrowRight } from 'lucide-react';
import Button from '@/app/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-24 px-6">
        <div className="max-w-md w-full p-12 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">Message Received</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Our travel concierges are reviewing your request. Expect a personalized response within 24 hours.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            className="w-full py-6 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-[1.02] transition-transform"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      {/* Cinematic Header */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <MessageSquare size={14} />
            <span>Concierge Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
            Let's Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Next Story.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Whether it's a hidden heritage trek or a luxury cruise, our team is ready to craft your perfect itinerary.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          
          {/* Contact Info Bento */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Speak with Us</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">+1 (234) 567-890</p>
              <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-bold">Mon - Fri • 9am - 6pm EST</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email Inquiries</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">concierge@travelhub.com</p>
              <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-bold">24/7 Digital Support</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Headquarters</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                123 Voyage Plaza, Manhattan<br />New York, NY 10001
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-900/5">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Planning a luxury getaway"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder:text-slate-400"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your dream destination..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all resize-none placeholder:text-slate-400"
                  ></textarea>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                    <Globe size={16} className="text-blue-500" />
                    <span>Global travel experts available across all timezones.</span>
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto px-10 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 group">
                    <span className="flex items-center gap-2">
                      Send Inquiry
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}