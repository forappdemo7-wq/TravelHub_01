'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, Ship, Utensils, CloudLightning, ShieldAlert, LifeBuoy, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const policies = [
  {
    title: 'Tours & Destinations',
    icon: <Map className="w-6 h-6 text-blue-500" />,
    bg: 'bg-blue-500/10',
    rules: [
      { text: 'Free cancellation up to 48 hours before departure.', highlight: '48 hours' },
      { text: 'Cancellations within 48 hours incur a 50% fee.', highlight: '50% fee' },
      { text: 'No-shows are strictly non-refundable.', highlight: 'non-refundable' },
    ]
  },
  {
    title: 'Cruises & Voyages',
    icon: <Ship className="w-6 h-6 text-cyan-500" />,
    bg: 'bg-cyan-500/10',
    rules: [
      { text: 'Free cancellation up to 7 days before embarkation.', highlight: '7 days' },
      { text: 'Cancellations within 7 days are non-refundable (100% fee).', highlight: 'non-refundable' },
    ]
  },
  {
    title: 'Restaurant Reservations',
    icon: <Utensils className="w-6 h-6 text-rose-500" />,
    bg: 'bg-rose-500/10',
    rules: [
      { text: 'Free cancellation up to 24 hours before reservation time.', highlight: '24 hours' },
      { text: 'Cancellations within 24 hours incur a $25/person fee.', highlight: '$25/person' },
    ]
  },
  {
    title: 'Force Majeure',
    icon: <CloudLightning className="w-6 h-6 text-purple-500" />,
    bg: 'bg-purple-500/10',
    rules: [
      { text: 'If canceled due to weather or events beyond our control:', highlight: 'weather' },
      { text: 'You will receive a full refund or a free rebooking.', highlight: 'full refund' },
    ]
  }
];

export default function CancellationPolicyClient() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden pt-32 pb-24">
      {/* Stealth Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We offer flexible cancellation terms tailored to each experience type. 
            Please review the policy below that applies to your specific booking.
          </p>
        </motion.div>

        {/* Policy Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {policies.map((policy, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="h-full bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl ${policy.bg} dark:bg-white/5 border border-transparent dark:border-white/10`}>
                    {policy.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {policy.title}
                  </h2>
                </div>
                <ul className="space-y-4">
                  {policy.rules.map((rule, idx) => {
                    // Simple logic to bold the highlight text dynamically
                    const parts = rule.text.split(rule.highlight);
                    return (
                      <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/50 flex-shrink-0" />
                        <p className="leading-relaxed">
                          {parts[0]}
                          <span className="font-semibold text-gray-900 dark:text-gray-200">{rule.highlight}</span>
                          {parts[1]}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How to Cancel & Support Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/5 dark:to-transparent backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">How to Cancel</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You can instantly manage or cancel your reservations directly from your dashboard. Refunds for eligible cancellations are processed automatically.
            </p>
            <Link href="/my-bookings" className="inline-flex w-fit items-center px-6 py-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm">
              Go to My Bookings
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="bg-blue-600 dark:bg-blue-900/40 backdrop-blur-xl border border-transparent dark:border-blue-500/20 rounded-3xl p-8 flex flex-col justify-center text-white">
            <div className="flex items-center gap-3 mb-4">
              <LifeBuoy className="w-6 h-6 text-blue-200" />
              <h3 className="text-lg font-bold">Need Help?</h3>
            </div>
            <p className="text-blue-100 mb-6 text-sm leading-relaxed">
              For urgent, last-minute cancellations or special circumstances, our support team is available 24/7.
            </p>
            <div className="space-y-2 text-sm font-medium">
              <a href="mailto:hello@travelhub.com" className="block hover:text-blue-200 transition-colors">
                hello@travelhub.com
              </a>
              <a href="tel:+1234567890" className="block hover:text-blue-200 transition-colors">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}