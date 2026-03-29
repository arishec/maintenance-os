import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Contractor Dispatch',
  description:
    'Dispatch maintenance requests to contractors via SMS and email with one click. Get quick responses without phone calls or endless emails.',
  alternates: {
    canonical: '/features/contractor-dispatch',
  },
};

export default function ContractorDispatchPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contractor Dispatch
          </h1>
          <p className="text-xl text-gray-600">
            Send maintenance requests to contractors via SMS and email in seconds. Get responses fast without
            phone tag.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Dispatch Works</h2>

          <div className="space-y-8">
            <div>
              <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 inline-block font-bold mb-3">
                Step 1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Report an Issue</h3>
              <p className="text-gray-600">
                You've reported a maintenance issue in the system. Now you need to get it fixed.
              </p>
            </div>

            <div>
              <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 inline-block font-bold mb-3">
                Step 2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Select Contractors</h3>
              <p className="text-gray-600">
                Choose which contractors you want to dispatch to. You can add multiple contractors for competitive
                quotes or select one if you have a preferred vendor.
              </p>
            </div>

            <div>
              <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 inline-block font-bold mb-3">
                Step 3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Send with One Click</h3>
              <p className="text-gray-600">
                Click "Dispatch." Maintenance OS automatically sends an SMS or email (or both) to each contractor
                with:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-3 space-y-1">
                <li>Description of the issue</li>
                <li>Location and property details</li>
                <li>Photos (if provided)</li>
                <li>Your contact information</li>
                <li>Contractor's reply token for quick responses</li>
              </ul>
            </div>

            <div>
              <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 inline-block font-bold mb-3">
                Step 4
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contractors Respond</h3>
              <p className="text-gray-600">
                Contractors can reply via SMS with a simple token response. They might accept the job, ask
                questions, or provide a preliminary quote. All responses appear in your Maintenance OS dashboard.
              </p>
            </div>

            <div>
              <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 inline-block font-bold mb-3">
                Step 5
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Coordinate and Hire</h3>
              <p className="text-gray-600">
                See all responses in one place. Compare quotes if you have multiple bids. Accept a contractor and
                update the issue status.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Works */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 sm:p-8 lg:p-12 border border-green-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Dispatch Saves Time</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl">⏱️</span>
              <div>
                <h3 className="font-bold text-gray-900">No more phone tag</h3>
                <p className="text-gray-600">
                  You don't call contractors, they don't call you back three days later. Async communication that
                  works.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-bold text-gray-900">Contractors prefer SMS</h3>
                <p className="text-gray-600">
                  Busy contractors can respond quickly via text. They get the details without having to call you or
                  search their email.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="font-bold text-gray-900">Batch dispatch multiple contractors</h3>
                <p className="text-gray-600">
                  Need competitive quotes? Dispatch to 3 contractors at once. They all get the same job details and
                  can bid independently.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-bold text-gray-900">Simple pricing</h3>
                <p className="text-gray-600">
                  Only pay per SMS sent. Dispatching to 2 contractors = 2 SMSes ≈ $1.50. Transparent, no hidden
                  charges.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-bold text-gray-900">See all responses in one place</h3>
                <p className="text-gray-600">
                  Instead of scattered texts and emails, all contractor responses show up in your dashboard for easy
                  comparison.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What You Can Dispatch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">📋 Issue Details</h3>
              <p className="text-gray-600 text-sm">
                Full description of the problem, category, priority level, and property location automatically
                included.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">📸 Photos</h3>
              <p className="text-gray-600 text-sm">
                If you attached photos to the issue, they're included in the dispatch so contractors can assess
                the problem.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">📍 Location & Access</h3>
              <p className="text-gray-600 text-sm">
                Address, property details, and any special instructions (gate codes, contact names, access hours)
                are automatically sent.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">💬 Quick Reply Tokens</h3>
              <p className="text-gray-600 text-sm">
                Contractors can reply with simple codes to accept, decline, or provide quotes without writing long
                messages.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Scenarios</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Urgent Repairs (Same Day)</h3>
              <p className="text-gray-600">
                Water leak discovered. Dispatch to your trusted plumber immediately. Get a response within hours.
                Work starts that afternoon.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Competitive Quotes</h3>
              <p className="text-gray-600">
                Need the roof inspected. Dispatch to 3 different roofers at once. All get the same details. Get 3
                quotes for comparison.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Multi-Property Dispatch</h3>
              <p className="text-gray-600">
                You have 5 properties and issues at 3 of them. Dispatch to the right contractors per property in
                seconds. They know which property they're going to.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-gray-900 mb-2">Tenant-Reported Issues</h3>
              <p className="text-gray-600">
                Tenant reports a broken heater via your intake form. Review the details, dispatch to HVAC
                contractor. Tenant gets an update that it's being fixed.
              </p>
            </div>
          </div>
        </div>

        {/* Related Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Works Well With</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/features/quote-comparison"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Quote Comparison</h3>
              <p className="text-gray-600 text-sm">Compare multiple contractor bids side by side</p>
            </Link>

            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Property Tracking</h3>
              <p className="text-gray-600 text-sm">Report issues before dispatching to contractors</p>
            </Link>

            <Link
              href="/features/tenant-intake"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Tenant Intake</h3>
              <p className="text-gray-600 text-sm">Collect maintenance requests from tenants, then dispatch</p>
            </Link>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 sm:p-8 lg:p-12 border border-yellow-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">SMS Dispatch Pricing</h2>
          <p className="text-gray-700 mb-6">
            <strong>$0.50–$0.75 per SMS</strong> depending on destination and carrier. That's it. No monthly
            minimums. You only pay for the SMSes you send.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Example:</strong> Dispatch to 3 contractors = 3 SMSes ≈ $2.25
          </p>
          <Link
            href="/pricing"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            See full pricing →
          </Link>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 lg:p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Stop playing phone tag with contractors
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Dispatch to contractors in seconds. Get responses faster.
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
