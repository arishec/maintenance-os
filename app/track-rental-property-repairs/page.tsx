import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'How to Track Rental Property Repairs | Simple System',
  description: 'Track every rental property repair from request to completion. Maintenance OS gives landlords one system for issues, contractors, quotes, and history.',
  alternates: {
    canonical: '/track-rental-property-repairs',
  },
};

export default function TrackRentalPropertyRepairsPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HEADER ───── */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Track Rental Property Repairs Without Losing Anything
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tracking repairs across rental properties gets messy fast. Scattered messages, lost invoices, unclear history, and no way to know what was fixed, when, or by whom. Maintenance OS gives you a simple, structured system that keeps everything organized from the first request to the final invoice.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Start Tracking Repairs the Right Way
          </Link>
        </div>

        {/* ───── SECTION: THE PROBLEM ───── */}
        <section className="mb-16 bg-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            The problem with how most landlords track repairs
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Scattered messages across texts, calls, and emails</h3>
                <p className="text-gray-700 text-sm">Maintenance requests come through multiple channels, making it impossible to track everything in one place.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Lost invoices and receipts</h3>
                <p className="text-gray-700 text-sm">Contractor invoices get buried in email or left in a folder, making it hard to track spending and verify work completed.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">No clear history of what was repaired, when, or how much it cost</h3>
                <p className="text-gray-700 text-sm">Without records, you forget details and can't track patterns, spending, or contractor reliability.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Difficulty knowing which contractor to call back</h3>
                <p className="text-gray-700 text-sm">You remember a contractor was good, but can't remember their name, phone, or what they specialize in.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Zero visibility across multiple properties</h3>
                <p className="text-gray-700 text-sm">When managing several rentals, you can't quickly see what's happening at each property or which ones need attention.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───── SECTION: THE SOLUTION ───── */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            A better system in 5 steps
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-200">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Capture every issue</h3>
              <p className="text-gray-700">Tenants submit requests with photos, details, and urgency in one place. You never miss anything.</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-200">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Send to contractors</h3>
              <p className="text-gray-700">Dispatch to multiple contractors at once with all the details they need to respond.</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-200">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compare responses</h3>
              <p className="text-gray-700">See pricing and timelines side by side so you can make the best decision quickly.</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-200">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track progress</h3>
              <p className="text-gray-700">Follow each job from scheduled to completed without chasing contractors for updates.</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-200 sm:col-span-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                5
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Store history</h3>
              <p className="text-gray-700">Every repair becomes a searchable record with dates, costs, contractor info, photos, and invoices.</p>
            </div>
          </div>
        </section>

        {/* ───── SECTION: WHAT GOOD LOOKS LIKE ───── */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-12 border border-blue-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            What good repair tracking looks like
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            A good system ties every repair to the property, the contractor, the cost, and the outcome. You can look up any property and see exactly what was done, when, and by whom. No digging through old texts or trying to remember which contractor fixed the HVAC last year.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900">Every repair is documented</h3>
                <p className="text-gray-700 text-sm">Date reported, date completed, issue description, photos, and contractor notes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900">Costs are tracked</h3>
                <p className="text-gray-700 text-sm">Invoice amounts, labor costs, materials — everything organized by property and time period.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900">Contractor info is centralized</h3>
                <p className="text-gray-700 text-sm">Phone, email, specialty, rates, past performance — everything you need to call them back.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900">Quick lookup by property</h3>
                <p className="text-gray-700 text-sm">Pull up any property and instantly see all repairs, current status, and total spend.</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            This level of organization makes it easy to track spending, evaluate contractor performance, identify recurring problems, and prove maintenance for tax or legal purposes.
          </p>
        </section>

        {/* ───── SECTION: DEEPER DIVE ───── */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Want to go deeper?
          </h2>
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <p className="text-gray-700 text-lg mb-4">
              This is just the foundation. If you want the full system — intake processes, triage workflows, contractor network management, cost tracking, preventative maintenance planning, and emergency procedures — check out the complete guide:
            </p>
            <Link
              href="/guides/how-to-manage-rental-property-maintenance"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              Read the Full Guide: How to Manage Rental Property Maintenance
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ───── INTERNAL LINKS SECTION ───── */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Related topics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/property-maintenance-software"
              className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">Property Maintenance Software</h3>
              <p className="text-gray-600 text-sm mb-4">Choose the right tools for tracking maintenance across multiple rentals.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more →</span>
            </Link>

            <Link
              href="/compare-contractor-quotes"
              className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">Compare Contractor Quotes</h3>
              <p className="text-gray-600 text-sm mb-4">Get multiple quotes and compare pricing and timelines side by side.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more →</span>
            </Link>

            <Link
              href="/landlord-maintenance-software"
              className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">Landlord Maintenance Software</h3>
              <p className="text-gray-600 text-sm mb-4">Software built specifically for rental property maintenance management.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more →</span>
            </Link>

            <Link
              href="/how-it-works"
              className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">How Maintenance OS Works</h3>
              <p className="text-gray-600 text-sm mb-4">See how to set up and use Maintenance OS for your properties.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more →</span>
            </Link>

            <Link
              href="/guides/how-to-manage-rental-property-maintenance"
              className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">Complete Maintenance Management Guide</h3>
              <p className="text-gray-600 text-sm mb-4">The full system for managing repairs, contractors, and records.</p>
              <span className="text-blue-600 font-medium text-sm">Learn more →</span>
            </Link>

            <Link
              href="/sign-up"
              className="rounded-2xl border-2 border-blue-600 bg-blue-600 text-white p-6 hover:bg-blue-700 transition-colors group"
            >
              <h3 className="font-bold mb-2">Get Started Now</h3>
              <p className="text-blue-100 text-sm mb-4">Start tracking repairs the right way with Maintenance OS.</p>
              <span className="font-medium text-sm">Sign up free →</span>
            </Link>
          </div>
        </section>

        {/* ───── FINAL CTA ───── */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">
            Start tracking repairs the right way
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            One system for issues, contractors, quotes, and history. Free to get started.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-bold text-lg"
          >
            Get Started Free
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}
