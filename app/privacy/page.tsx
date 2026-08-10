'use client';

import { Calendar, Shield, Users, Eye, Trash2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const lastUpdated = "April 02, 2026";

  return (
    <main className="pt-24 pb-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
            At TravelHub, we respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
          </p>

          {/* Section 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">1. Information We Collect</h2>
            </div>
            <div className="pl-16 space-y-6 text-gray-700 dark:text-gray-300">
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and mailing address.</li>
                <li><strong>Travel Details:</strong> Passport information, date of birth, and travel preferences (required for bookings).</li>
                <li><strong>Payment Information:</strong> Processed securely through our payment partners. We do not store full credit card details.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage data collected via cookies.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">2. How We Use Your Information</h2>
            </div>
            <div className="pl-16 space-y-4 text-gray-700 dark:text-gray-300">
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Process and confirm your bookings</li>
                <li>Send important updates, itineraries, and travel alerts</li>
                <li>Provide customer support and respond to your inquiries</li>
                <li>Improve our website and personalize your experience</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">3. Sharing Your Information</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p className="mb-4">We do <strong>not</strong> sell your personal data to third parties.</p>
              <p>We may share your information only when necessary with:</p>
              <ul className="list-disc pl-6 space-y-3 mt-4">
                <li>Airlines, hotels, and tour operators to fulfill your bookings</li>
                <li>Payment processors for secure transactions</li>
                <li>Government authorities when required by law (e.g., immigration or customs)</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">4. Data Security</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>
                We use industry-standard security measures including SSL encryption, secure servers, 
                and regular security audits to protect your information.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">5. Your Rights</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-3 mt-4">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal obligations)</li>
                <li>Opt-out of marketing communications at any time</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">6. Cookies & Tracking</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>
                Our website uses cookies to enhance your experience, remember preferences, 
                and analyze site usage. You can manage cookie preferences through your browser settings.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-16">
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                info@travelhub.com
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}