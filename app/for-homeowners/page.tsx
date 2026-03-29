import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Home Repair Tracker for Homeowners',
  description:
    'Organize home repairs, track contractor quotes, and keep a searchable repair history. The simple maintenance tracker for homeowners.',
  alternates: {
    canonical: '/for-homeowners',
  },
};

export default function ForHomeownersPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Home Repair Tracker for Homeowners
          </h1>
          <p className="text-xl text-gray-600">
            Stop juggling repair requests and contractor quotes. Keep all your home maintenance in one place.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 lg:p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Problem With Home Repairs</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">🔄</div>
              <div>
                <h3 className="font-bold text-gray-900">Scattered across multiple texts and emails</h3>
                <p className="text-gray-600">
                  One contractor texted, another emailed, a third called. Where was that first quote again?
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="font-bold text-gray-900">Spreadsheets are a nightmare</h3>
                <p className="text-gray-600">
                  You tried a spreadsheet. It got confusing fast. Column headers, endless rows, forgotten
                  updates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">🤷</div>
              <div>
                <h3 className="font-bold text-gray-900">Can't remember what was done</h3>
                <p className="text-gray-600">
                  The bathroom was re-tiled last year... or was it two years ago? Who did it? What did it
                  cost?
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">🤐</div>
              <div>
                <h3 className="font-bold text-gray-900">No proof for insurance or resale</h3>
                <p className="text-gray-600">
                  When selling your home or filing a claim, you have no way to prove what repairs were done.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">⏰</div>
              <div>
                <h3 className="font-bold text-gray-900">Wasting hours comparing quotes</h3>
                <p className="text-gray-600">
                  Getting three quotes? Now you're copying quotes into email, word docs, trying to compare
                  them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 lg:p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Maintenance OS Solves This</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ One central dashboard for repairs</h3>
              <p className="text-gray-600">
                Report every issue in one place. See at a glance what needs attention, what's in progress, and
                what's done. No more digging through old texts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Compare contractor quotes side by side</h3>
              <p className="text-gray-600">
                Get quotes from multiple contractors and compare them instantly. See all prices, timelines, and
                contractor info in one view.
              </p>
              <Link
                href="/features/quote-comparison"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more about quote comparison →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Keep a complete repair history</h3>
              <p className="text-gray-600">
                Every repair, every invoice, every contractor detail gets stored. Search by date, issue type,
                or contractor. Perfect for home resale or insurance claims.
              </p>
              <Link
                href="/features/repair-history"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more about repair history →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Track progress in real time</h3>
              <p className="text-gray-600">
                Update status as work starts and finishes. Keep notes and photos. Know exactly when contractors
                are coming and what they'll be doing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Optional SMS dispatch (pay as you go)</h3>
              <p className="text-gray-600">
                Send dispatch requests to contractors via SMS. Only pay for the SMS you send—typically $0.50 to
                $0.75 per message.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Perfect For...</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6 lg:p-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">First-Time Homeowners</h3>
              <p className="text-gray-600 mb-4">
                New to home ownership? Keep a record of everything you learn and fix. Build a maintenance
                history as you go.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Planning a Home Sale</h3>
              <p className="text-gray-600 mb-4">
                Documenting repairs? Maintenance OS creates an audit trail of improvements. Perfect for buyer
                confidence.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Dealing With Insurance</h3>
              <p className="text-gray-600 mb-4">
                Filing a claim? Have photos, dates, and contractor invoices in one searchable place. No more
                hunting for receipts.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Managing Multiple Repair Quotes</h3>
              <p className="text-gray-600 mb-4">
                Getting bids from different contractors? Compare them instantly instead of manually copying
                numbers into a spreadsheet.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Features for Homeowners</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/features/quote-comparison"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Quote Comparison</h3>
              <p className="text-gray-600 text-sm">Compare contractor bids side by side</p>
            </Link>

            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Repair History</h3>
              <p className="text-gray-600 text-sm">Searchable timeline of all home repairs</p>
            </Link>

            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Issue Tracking</h3>
              <p className="text-gray-600 text-sm">Report, classify, and monitor repairs</p>
            </Link>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 lg:p-12 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Simple Pricing for Homeowners</h2>
          <ul className="space-y-3 mb-6 text-gray-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>
                <strong>Free tier:</strong> Report issues, track repairs, compare quotes. 1 property,
                unlimited repairs.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>
                <strong>SMS dispatch (optional):</strong> $0.50–0.75 per SMS to contractors. Pay only when you
                use it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-606 font-bold">✓</span>
              <span>
                <strong>No monthly fees.</strong> Keep repair history forever for free.
              </span>
            </li>
          </ul>
          <Link
            href="/pricing"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            See full pricing →
          </Link>
        </div>

        {/* Guides */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Homeowner Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/guides/how-to-track-home-repairs"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">How to Track Home Repairs</h3>
              <p className="text-gray-600 text-sm">
                A practical guide to organizing home maintenance, keeping records, and building a complete
                repair history.
              </p>
            </Link>

            <Link
              href="/guides/how-to-compare-contractor-quotes"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">How to Compare Contractor Quotes</h3>
              <p className="text-gray-600 text-sm">
                Learn how to evaluate multiple bids, spot red flags, and choose the best contractor for your
                repair.
              </p>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 lg:p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Get all your home repairs organized
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Free forever for 1 property. Start today, no credit card required.
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
