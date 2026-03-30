import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Repair History — Never Lose Track of What\'s Been Done',
  description:
    'Every repair, cost, and contractor in one searchable timeline. Perfect for resale, insurance claims, tenant disputes, and long-term planning.',
  alternates: {
    canonical: '/features/repair-history',
  },
};

export default function RepairHistoryPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HERO ───── */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Never Lose Track of What&apos;s Been Done to Your Property
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Every repair. Every cost. Every contractor. All in one place — so you always know what was done, when, and why.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Start Tracking Free
            </Link>
            <a
              href="#how-it-works"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* ───── PROBLEM ───── */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Most repair records are scattered or lost
          </h2>

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-800 font-medium mb-2">The water heater broke 3 years ago.</p>
              <p className="text-gray-600">
                You remember fixing it — but who did the work? What did it cost? Is it still under warranty?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-800 font-medium mb-2">You&apos;re selling your home.</p>
              <p className="text-gray-600">
                The buyer asks about the roof. You know it was fixed… but the invoice is buried in email or gone.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-800 font-medium mb-2">You&apos;re dealing with a tenant dispute.</p>
              <p className="text-gray-600">
                They claim damage wasn&apos;t theirs. Can you prove what was done before?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-800 font-medium mb-2">You want to plan ahead.</p>
              <p className="text-gray-600">
                What&apos;s been fixed recently? What&apos;s due next? You don&apos;t have a clear answer.
              </p>
            </div>
          </div>
        </div>

        {/* ───── SOLUTION ───── */}
        <div id="how-it-works" className="mb-20">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              A complete, searchable history of your property
            </h2>
            <p className="text-gray-700 text-lg">
              Every repair is recorded automatically — so nothing gets lost.
            </p>
          </div>
        </div>

        {/* ───── CORE BENEFITS ───── */}
        <div className="mb-20">
          <div className="space-y-6">
            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Everything in one place</h3>
                <p className="text-gray-600">Every repair, contractor, invoice, and photo — organized and easy to find</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Find anything instantly</h3>
                <p className="text-gray-600">Search by date, category, contractor, or cost in seconds</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Always have proof</h3>
                <p className="text-gray-600">Know exactly what was done — for buyers, insurance, or disputes</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Make smarter decisions</h3>
                <p className="text-gray-600">See patterns over time and plan repairs before problems happen</p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── MID CTA ───── */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 text-center mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Stop guessing what&apos;s been done
          </h2>
          <p className="text-gray-600 mb-6 text-lg">Start keeping a real record.</p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>

        {/* ───── REAL-WORLD MOMENTS ───── */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            When this actually matters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Selling your home</h3>
              <p className="text-gray-600 text-sm">
                Pull a clean report of repairs from the last 5 years. Show proof. Build buyer trust.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Insurance claim</h3>
              <p className="text-gray-600 text-sm">
                Provide full documentation with dates, photos, and contractors — no scrambling.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Tenant dispute</h3>
              <p className="text-gray-600 text-sm">
                Show exactly when repairs were made. Protect yourself with a clear record.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Planning ahead</h3>
              <p className="text-gray-600 text-sm">
                See that HVAC has been repaired 3 times. Decide to replace instead of patch again.
              </p>
            </div>
          </div>
        </div>

        {/* ───── WHY THIS MATTERS ───── */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Why repair history changes everything
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Avoid costly surprises</h3>
                <p className="text-gray-600">Know what&apos;s been done and what hasn&apos;t</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Increase property value</h3>
                <p className="text-gray-600">Buyers trust documented maintenance</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Protect yourself legally</h3>
                <p className="text-gray-600">Have proof when it matters most</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Get peace of mind</h3>
                <p className="text-gray-600">Never wonder &ldquo;did we fix that?&rdquo; again</p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── WHAT'S INCLUDED (compressed) ───── */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What&apos;s included</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              <p className="text-sm font-medium text-gray-900">Timeline of every repair</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-medium text-gray-900">Costs and invoices</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              <p className="text-sm font-medium text-gray-900">Contractor details</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
              <p className="text-sm font-medium text-gray-900">Photos and documentation</p>
            </div>
          </div>
        </div>

        {/* ───── RELATED FEATURES ───── */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related features</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Property Tracking</h3>
              <p className="text-gray-600 text-sm">Report and track issues that become part of your history</p>
            </Link>

            <Link
              href="/features/job-tracking"
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Job Tracking</h3>
              <p className="text-gray-600 text-sm">Follow every repair from start to finish</p>
            </Link>

            <Link
              href="/features/quote-comparison"
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Quote Comparison</h3>
              <p className="text-gray-600 text-sm">Compare costs and keep every quote on record</p>
            </Link>
          </div>
        </div>

        {/* ───── FINAL CTA ───── */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-10 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Stop losing track of repairs
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-xl mx-auto">
            Know your property inside and out — without digging through emails or files.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
