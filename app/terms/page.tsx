'use client';

import Link from 'next/link';
import { Calendar, ShieldCheck, AlertTriangle, FileText, Users, Clock } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "April 02, 2026";

  return (
    <main className="pt-24 pb-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
            Welcome to TravelHub. By accessing or using our website and services, you agree to be bound by these Terms of Service.
          </p>

          {/* Section 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">1. Acceptance of Terms</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>
                By using TravelHub, you confirm that you have read, understood, and agree to these Terms of Service 
                and our Privacy Policy. If you do not agree, please do not use our services.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">2. Our Role</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>
                TravelHub acts as an intermediary platform connecting you with third-party travel providers 
                (airlines, hotels, cruise lines, tour operators, etc.). We do not own or operate these services.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">3. Bookings and Payments</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300 space-y-4">
              <ul className="list-disc pl-6 space-y-3">
                <li>You are responsible for ensuring all passenger names and details exactly match official travel documents.</li>
                <li>Prices shown are subject to change until your booking is confirmed and payment is successfully processed.</li>
                <li>A booking is only confirmed once you receive an official confirmation email with a booking reference number.</li>
                <li>Payments are processed securely through our trusted payment partners.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">4. Cancellations &amp; Refunds</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                Cancellation and refund policies vary by provider (airline, hotel, cruise line, tour operator).
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Some bookings may be non-refundable as per the supplier’s terms.</li>
                <li>TravelHub may charge a reasonable administrative fee for processing cancellations or modifications.</li>
                <li>Refunds, when applicable, will be processed according to the original payment method.</li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">5. Travel Documents &amp; Responsibility</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <ul className="list-disc pl-6 space-y-3">
                <li>It is your sole responsibility to obtain valid passports, visas, and other required travel documents.</li>
                <li>We strongly recommend purchasing comprehensive travel insurance for all trips.</li>
                <li>TravelHub is not liable for any costs arising from denied boarding, health issues, or trip interruptions.</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">6. Prohibited Activities</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-3 mt-4">
                <li>Make speculative or fraudulent bookings</li>
                <li>Use automated tools (bots) to scrape pricing or availability</li>
                <li>Post false, misleading, or defamatory content</li>
                <li>Violate any applicable laws or third-party rights</li>
              </ul>
            </div>
          </div>

          {/* Section 7 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-3xl font-semibold dark:text-white">7. Limitation of Liability</h2>
            </div>
            <div className="pl-16 text-gray-700 dark:text-gray-300">
              <p>
                To the maximum extent permitted by law, TravelHub shall not be liable for any indirect, incidental, 
                or consequential damages arising from the use of our platform or third-party travel services, 
                including delays, cancellations, or issues caused by "Force Majeure" events.
              </p>
            </div>
          </div>

          {/* Final Note */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-16">
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              We reserve the right to update these Terms of Service at any time. 
              Continued use of TravelHub after changes are posted constitutes your acceptance of the updated terms.
            </p>
            
            <p className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
              If you have any questions about these Terms, please contact us at{' '}
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