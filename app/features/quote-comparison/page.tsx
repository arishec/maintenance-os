import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Contractor Quote Comparison',
  description:
    'Compare multiple contractor quotes side by side. See prices, timelines, and contractor details at a glance to make informed decisions.',
  alternates: {
    canonical: '/features/quote-comparison',
  },
};

export default function QuoteComparisonPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contractor Quote Comparison
          </h1>
          <p className="text-xl text-gray-600">
            Get multiple bids and compare them side by side. Make data-driven decisions and save money on
            repairs.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem With Getting Multiple Quotes</h2>

          <div className="space-y-3">
            <p className="text-gray-700">
              You call Contractor A. They text a quote. You call Contractor B. They email a PDF. You call
              Contractor C and they leave a voicemail. Now you have quotes scattered across text, email, and
              voicemail.
            </p>
            <p className="text-gray-700">
              You want to compare them. So you open a spreadsheet and manually type in prices. Or you copy and
              paste into a Word doc. It's messy and error-prone.
            </p>
            <p className="text-gray-700">
              What if you missed something? What if one quote includes materials and another doesn't? How do you
              really know which one is the best deal?
            </p>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Quote Comparison Solves This</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ All Quotes in One Place</h3>
              <p className="text-gray-600">
                When contractors respond to your dispatch, their quotes appear in Maintenance OS. No scattered
                texts or emails. One organized comparison view.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ See Prices Side by Side</h3>
              <p className="text-gray-600">
                A table shows contractor name, quote price, timeline, and notes. Instantly see who's cheapest and
                who's fastest. No mental math or spreadsheets.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ View Contractor Details</h3>
              <p className="text-gray-600">
                See contact info, past performance, ratings, and notes from previous jobs. Evaluate not just price,
                but reliability.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Make an Informed Decision</h3>
              <p className="text-gray-600">
                Accept the best quote with one click. Decline others respectfully. Update the issue status to
                "Hired" and move forward.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Keep Notes and Rationale</h3>
              <p className="text-gray-600">
                Document why you chose one contractor over another. "Lowest price but longer timeline" or "More
                expensive but best reviews." Track your decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Example Workflow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Example: Roof Repair</h2>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">1. You Report the Issue</h3>
              <p className="text-gray-600">
                Roof is leaking in the master bedroom. Upload photos. Mark as Urgent.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">2. You Dispatch to 3 Roofers</h3>
              <p className="text-gray-600">
                Send the issue to Smith Roofing, Peak Repairs, and Honest Contractors simultaneously.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">3. Quotes Come In</h3>
              <p className="text-gray-600">
                Within 24 hours, you have 3 responses. All appear in your Maintenance OS dashboard:
              </p>
              <div className="mt-4 bg-white rounded border border-gray-200 p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-bold">Contractor</th>
                        <th className="text-right py-2 font-bold">Price</th>
                        <th className="text-left py-2 font-bold">Timeline</th>
                        <th className="text-left py-2 font-bold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Smith Roofing</td>
                        <td className="text-right">$2,800</td>
                        <td>5-7 days</td>
                        <td className="text-sm">New shingles, detailed inspection</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">Peak Repairs</td>
                        <td className="text-right">$2,200</td>
                        <td>10-14 days</td>
                        <td className="text-sm">Patch repair, may need more work</td>
                      </tr>
                      <tr>
                        <td className="py-2">Honest Contractors</td>
                        <td className="text-right">$2,500</td>
                        <td>7-10 days</td>
                        <td className="text-sm">Full repair, warranty included</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">4. You Compare and Decide</h3>
              <p className="text-gray-600">
                Peak Repairs is cheapest but warns of potential future issues. Smith Roofing is most expensive but
                comprehensive. Honest Contractors is a middle ground with a warranty.
              </p>
              <p className="text-gray-600 mt-2">
                You've worked with Honest Contractors before. Good quality. You click "Accept" on their quote.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
              <h3 className="font-bold text-gray-900 mb-3">5. Issue Status Updates</h3>
              <p className="text-gray-600">
                The roof repair issue moves to "Dispatched - Contractor Selected." Honest Contractors gets
                notified you accepted their bid. Work starts next week.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Quote Comparison Matters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">💰 Save Money</h3>
              <p className="text-gray-600">
                On a $2,500 repair, getting 3 quotes could save you $300–500. Over years of home ownership or
                multiple rental properties, that adds up.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">⏰ Save Time</h3>
              <p className="text-gray-600">
                No spreadsheets, no copying and pasting, no manual comparison. Everything is already organized and
                ready to compare.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">🤝 Better Decisions</h3>
              <p className="text-gray-600">
                See not just price, but timelines, contractor history, and notes. Make informed decisions, not just
                cheapest-wins decisions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Data for Negotiation</h3>
              <p className="text-gray-600">
                Future jobs can reference past quotes and contractors. Build relationships with reliable ones.
                Negotiate better rates by showing you compare.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Features</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Side-by-side comparison table</h3>
                <p className="text-gray-600">Prices, timelines, contractor details all visible at once</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Contractor ratings and history</h3>
                <p className="text-gray-600">See past performance and reliability in your records</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Accept or decline with one click</h3>
                <p className="text-gray-600">No complex negotiations, just clear decisions</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Add notes for future reference</h3>
                <p className="text-gray-600">Document why you chose one contractor. Learn from decisions</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-600">✓</span>
              <div>
                <h3 className="font-bold text-gray-900">Export or print comparisons</h3>
                <p className="text-gray-600">Save for records or share with co-owners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Works Well With</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">
                Dispatch to multiple contractors to collect quotes for comparison
              </p>
            </Link>

            <Link
              href="/guides/how-to-compare-contractor-quotes"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Guide: Comparing Quotes</h3>
              <p className="text-gray-600 text-sm">
                Learn best practices for evaluating and choosing among bids
              </p>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Stop wasting time comparing quotes manually
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Get multiple bids and compare them in seconds.
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
