import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Repair History',
  description:
    'Keep a searchable timeline of every repair and maintenance work. Perfect for insurance, resale documentation, and future planning.',
  alternates: {
    canonical: '/features/repair-history',
  },
};

export default function RepairHistoryPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Repair History
          </h1>
          <p className="text-xl text-gray-600">
            Keep a complete, searchable timeline of every repair. Never lose track of what was done, when, or
            by whom.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 lg:p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem With Scattered Records</h2>

          <div className="space-y-3">
            <p className="text-gray-700">
              The water heater broke 3 years ago. You remember calling someone, but who? What did it cost? How
              long was the warranty?
            </p>
            <p className="text-gray-700">
              You're selling your home. The buyer asks if the roof has been maintained. You have an invoice
              somewhere, but it's in a filing cabinet or lost email.
            </p>
            <p className="text-gray-700">
              You're renting out a property. A tenant disputes how much you're charging for damages. "That wall
              was damaged before I moved in." Can you prove what was fixed after they left?
            </p>
            <p className="text-gray-700">
              You want to understand your property better for insurance. What major work has been done? When does
              the HVAC need replacement? No easy way to know.
            </p>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 lg:p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Repair History Solves This</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Everything in One Place</h3>
              <p className="text-gray-600">
                Every repair, every contractor, every invoice goes into your property's repair history. One
                searchable timeline instead of scattered documents.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Filter and Search Instantly</h3>
              <p className="text-gray-600">
                Filter by date, category (plumbing, electrical, etc.), contractor, or cost. Search for "roof" and
                instantly see all roof-related repairs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Complete Documentation</h3>
              <p className="text-gray-600">
                Each repair includes date, contractor, cost, photos, notes, and completion status. Everything you
                need to prove what was done.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Perfect for Resale</h3>
              <p className="text-gray-600">
                Selling? Export your repair history as proof of maintenance. Buyers see you've taken care of the
                property. Increases confidence and resale value.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Legal Protection for Landlords</h3>
              <p className="text-gray-600">
                Tenant disputes? Prove when repairs were made. Have a dated, documented record of all maintenance.
                Use it for security deposit disputes or insurance claims.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Plan for the Future</h3>
              <p className="text-gray-600">
                Over years, you build a complete picture of your property. See patterns. Know when major systems
                were last serviced. Plan preventative maintenance.
              </p>
            </div>
          </div>
        </div>

        {/* What Gets Recorded */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What Gets Stored in Your History</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">📅 Timeline Data</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Date reported</li>
                <li>• Date completed</li>
                <li>• Work duration</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">💰 Financial Data</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Contractor quote</li>
                <li>• Final cost</li>
                <li>• Payment method</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">👥 Contractor Details</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Contractor name</li>
                <li>• Contact info</li>
                <li>• License/insurance</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">📋 Documentation</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Photos before/after</li>
                <li>• Invoices</li>
                <li>• Warranty info</li>
                <li>• Completion notes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Real-World Scenarios</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Home Sale Disclosure</h3>
              <p className="text-gray-600">
                You're selling and need to disclose what repairs were done in the past 5 years. Pull your repair
                history. Generate a report. Buyer sees proof of maintenance. Everyone wins.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Insurance Claim</h3>
              <p className="text-gray-600">
                Roof damaged by a storm. Insurance asks for proof of maintenance history. Show them your complete
                roof maintenance record with dates, contractors, and photos.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Tenant Dispute</h3>
              <p className="text-gray-600">
                Tenant claims the refrigerator was broken when they moved in. You have a dated record showing it
                was replaced 6 months after they left. Dispute resolved.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Warranty Tracking</h3>
              <p className="text-gray-600">
                You replaced the water heater 3 years ago with a 5-year warranty. Your repair history shows the
                exact date and contractor. You can claim warranty service if needed.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Property Assessment</h3>
              <p className="text-gray-600">
                You're evaluating whether to fix the HVAC or replace it. Look at repair history. It's been fixed
                3 times in 2 years. Replacement might be smarter financially.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 sm:p-8 lg:p-12 border border-purple-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Repair History Matters</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl">📜</span>
              <div>
                <h3 className="font-bold text-gray-900">Creates a legal record</h3>
                <p className="text-gray-600">
                  Dated, documented repairs protect you in disputes and insurance claims.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">💵</span>
              <div>
                <h3 className="font-bold text-gray-900">Increases property value</h3>
                <p className="text-gray-600">
                  Buyers trust well-maintained properties. Your repair history proves it.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">🔧</span>
              <div>
                <h3 className="font-bold text-gray-900">Enables smart planning</h3>
                <p className="text-gray-600">
                  See patterns over time. Know when major systems are due for replacement.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">😌</span>
              <div>
                <h3 className="font-bold text-gray-900">Gives you peace of mind</h3>
                <p className="text-gray-600">
                  Never wonder "was that fixed already?" or "how much did that cost?" You have the answer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">History Features</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Searchable timeline</h3>
                <p className="text-gray-600">Find repairs by date, type, contractor, or cost</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Filter by category</h3>
                <p className="text-gray-600">View all plumbing work, all electrical work, etc.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Export reports</h3>
                <p className="text-gray-600">Generate a PDF or CSV for resale, insurance, or records</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Attached documentation</h3>
                <p className="text-gray-600">Store invoices, photos, and warranty cards</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Cost analysis</h3>
                <p className="text-gray-600">See total spending by property, contractor, or category</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Multi-property history</h3>
                <p className="text-gray-600">View repairs across all properties or focus on one</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Works Well With</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Property Tracking</h3>
              <p className="text-gray-600 text-sm">Report and track issues that become part of your history</p>
            </Link>

            <Link
              href="/guides/how-to-track-home-repairs"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Guide: Tracking Repairs</h3>
              <p className="text-gray-600 text-sm">Learn best practices for organizing home maintenance</p>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 lg:p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Stop losing track of repairs
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Keep a complete, searchable repair history. Free forever.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
