import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Property Maintenance Software for Landlords',
  description:
    'Manage maintenance across multiple rental properties. Dispatch to contractors, collect tenant requests, and maintain detailed repair records.',
  alternates: {
    canonical: '/for-landlords',
  },
};

export default function ForLandlordsPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Property Maintenance Software for Landlords
          </h1>
          <p className="text-xl text-gray-600">
            Manage maintenance chaos across multiple properties. Coordinate contractors and tenants in one
            system.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Challenge of Multi-Property Management</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">🏠🏠🏠</div>
              <div>
                <h3 className="font-bold text-gray-900">Multiple properties, multiple problems</h3>
                <p className="text-gray-600">
                  Property 1 has a leak, property 2 has a broken heater, property 3 needs painting. Keep track
                  of which issue is where? Impossible.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">📞</div>
              <div>
                <h3 className="font-bold text-gray-900">Tenant requests are disorganized</h3>
                <p className="text-gray-600">
                  Tenants call, text, email. You're juggling messages across multiple channels. Some requests
                  get lost.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">🔧</div>
              <div>
                <h3 className="font-bold text-gray-900">Contractor coordination is a nightmare</h3>
                <p className="text-gray-600">
                  You call Jim the plumber for property 1, Sarah the electrician for property 2. They respond
                  at different times. Nothing's coordinated.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">🤯</div>
              <div>
                <h3 className="font-bold text-gray-900">No central record of work done</h3>
                <p className="text-gray-600">
                  Which contractor fixed the roof at property 2? When? Cost? You end up with scattered
                  invoices and no system.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="font-bold text-gray-900">You're paying more than you should</h3>
                <p className="text-gray-600">
                  Without comparing quotes, you accept the first price. You have no record of contractor
                  performance to negotiate better rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Maintenance OS Solves This</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Manage unlimited properties in one place</h3>
              <p className="text-gray-600">
                Each property gets its own dashboard. See at a glance which properties have open issues, what's
                in progress, and what's done. Zoom out to see all properties at once.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Collect tenant requests systematically</h3>
              <p className="text-gray-600">
                Give tenants a simple form to submit maintenance requests. Instead of texts and calls, you have
                one organized queue of issues with details and photos.
              </p>
              <Link
                href="/features/tenant-intake"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more about tenant intake →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Dispatch to contractors in seconds</h3>
              <p className="text-gray-600">
                Send maintenance requests to your contractors via SMS and email with one click. They respond
                quickly. No phone tag, no email chains.
              </p>
              <Link
                href="/features/contractor-dispatch"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more about contractor dispatch →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Compare quotes and control costs</h3>
              <p className="text-gray-600">
                Get multiple quotes for the same job. Compare prices side by side. Make data-driven decisions.
                Negotiate better rates by showing contractors you compare.
              </p>
              <Link
                href="/features/quote-comparison"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more about quote comparison →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Keep a searchable repair history</h3>
              <p className="text-gray-600">
                Every repair, every contractor, every cost is recorded. Filter by property, date, or
                contractor. Track contractor performance over time. Perfect for legal records and tenant
                disputes.
              </p>
              <Link
                href="/features/repair-history"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more about repair history →
              </Link>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Perfect For...</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Small Landlords (2–10 Properties)</h3>
              <p className="text-gray-600 mb-4">
                Managing a few rental units? Keep all maintenance organized without complex software. Track
                tenant requests and contractor work in one place.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Property Managers</h3>
              <p className="text-gray-600 mb-4">
                Managing properties for others? Maintenance OS helps you coordinate repairs efficiently, respond
                to tenant requests quickly, and maintain detailed records for owners.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Vacation Rental Owners</h3>
              <p className="text-gray-600 mb-4">
                Manage turnover maintenance and guest-reported issues across multiple vacation properties.
                Dispatch to local contractors quickly and keep records for owners.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Self-Managed Landlords (Cost-Conscious)</h3>
              <p className="text-gray-600 mb-4">
                Self-managing to save on fees? Maintenance OS replaces expensive property management software
                for coordination and record-keeping.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Benefits for Landlords</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-2xl">📊</div>
              <div>
                <h3 className="font-bold text-gray-900">Better data = better decisions</h3>
                <p className="text-gray-600">
                  See maintenance costs per property. Identify contractors who consistently deliver on time
                  and budget.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-2xl">⏱️</div>
              <div>
                <h3 className="font-bold text-gray-900">Save hours of admin work</h3>
                <p className="text-gray-600">
                  Instead of juggling spreadsheets and emails, Maintenance OS automates coordination. Dispatch
                  in seconds, compare quotes instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-2xl">😌</div>
              <div>
                <h3 className="font-bold text-gray-900">Happier tenants</h3>
                <p className="text-gray-600">
                  Tenants see their requests in the system. They know when contractors are coming. You respond
                  faster. Fewer complaints.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-2xl">📜</div>
              <div>
                <h3 className="font-bold text-gray-900">Proof when you need it</h3>
                <p className="text-gray-600">
                  Tenant dispute? Property sale? Insurance claim? You have a complete, dated record of all work
                  done.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-2xl">💵</div>
              <div>
                <h3 className="font-bold text-gray-900">Control costs</h3>
                <p className="text-gray-600">
                  Compare quotes. Negotiate with contractors. Track spending per property. No more overpaying
                  for maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Features Built for Multi-Property Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/features/tenant-intake"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Tenant Intake</h3>
              <p className="text-gray-600 text-sm">Simple forms for tenants to request maintenance</p>
            </Link>

            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">Send requests to contractors via SMS and email</p>
            </Link>

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
              <p className="text-gray-600 text-sm">Searchable timeline per property</p>
            </Link>

            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Multi-Property Tracking</h3>
              <p className="text-gray-600 text-sm">Manage all properties in one dashboard</p>
            </Link>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Contractor Network</h3>
              <p className="text-gray-600 text-sm">Keep contractor contacts and history organized</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Transparent Pricing for Property Managers</h2>
          <ul className="space-y-3 mb-6 text-gray-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span>
                <strong>Free tier:</strong> Up to 1 property. Report issues, track repairs, keep records.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-606 font-bold">✓</span>
              <span>
                <strong>Professional tier:</strong> Up to 5 properties. Add SMS contractor dispatch for
                $0.50–0.75 per SMS.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-606 font-bold">✓</span>
              <span>
                <strong>No monthly fees.</strong> Only pay for the SMS dispatches you send.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Landlord Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/guides/how-to-manage-rental-property-maintenance"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">How to Manage Rental Property Maintenance</h3>
              <p className="text-gray-600 text-sm">
                Best practices for organizing tenant requests, dispatching to contractors, and keeping
                records.
              </p>
            </Link>

            <Link
              href="/guides/how-to-compare-contractor-quotes"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">How to Compare Contractor Quotes</h3>
              <p className="text-gray-600 text-sm">
                Evaluate bids, negotiate pricing, and make data-driven decisions to control maintenance costs.
              </p>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Simplify maintenance for all your properties
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Free for 1 property. Professional tier for up to 5. Scale with your portfolio.
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
