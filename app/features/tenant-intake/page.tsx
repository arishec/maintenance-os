import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Tenant Intake — Stop Chasing Tenants for Maintenance Details',
  description:
    'Collect every maintenance request in one place with the exact information you need, upfront. No more texts, calls, or missing details.',
  alternates: {
    canonical: '/features/tenant-intake',
  },
};

export default function TenantIntakePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HERO ───── */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Chasing Tenants for Maintenance Details
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Collect every request in one place — with the exact information you need, upfront. No more texts, calls, or missing details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get Started Free
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
            Maintenance requests come in messy and incomplete
          </h2>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700 text-lg">
              Your tenants call, text, email, and leave voicemails. One reports a leak. Another mentions a broken lock. Now you&apos;re juggling messages across multiple channels.
            </p>
            <p className="text-gray-700 text-lg">When you finally look into it:</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              <p className="text-gray-700">You don&apos;t know which unit it&apos;s for</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              <p className="text-gray-700">There are no photos</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              <p className="text-gray-700">You don&apos;t know if it&apos;s urgent</p>
            </div>
          </div>

          <p className="text-gray-600 text-lg">So you go back and forth… and lose time.</p>
        </div>

        {/* ───── SOLUTION ───── */}
        <div id="how-it-works" className="mb-20">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Every request comes in organized and ready to act
            </h2>
            <p className="text-gray-700 text-lg">
              Tenants submit requests through a simple form — and you get everything you need instantly.
            </p>
          </div>
        </div>

        {/* ───── CORE BENEFITS ───── */}
        <div className="mb-20">
          <div className="space-y-6">
            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">No more back-and-forth</h3>
                <p className="text-gray-600">Get full details, photos, and urgency level upfront</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Everything in one queue</h3>
                <p className="text-gray-600">All requests appear in one organized dashboard</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Tenants stop chasing you</h3>
                <p className="text-gray-600">They know their request was received and can track progress</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Respond faster</h3>
                <p className="text-gray-600">Go from request to decision to dispatch without delays</p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── MID CTA ───── */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 text-center mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Stop chasing down details
          </h2>
          <p className="text-gray-600 mb-6 text-lg">Start getting complete requests.</p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>

        {/* ───── HOW IT WORKS ───── */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            How it actually works
          </h2>

          <div className="space-y-4">
            {[
              { step: '1', text: 'You create a simple intake form' },
              { step: '2', text: 'Share the link with tenants' },
              { step: '3', text: 'Requests come in fully structured' },
              { step: '4', text: 'You review and dispatch instantly' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex-shrink-0">
                  {item.step}
                </span>
                <p className="text-gray-800 text-lg">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-500 mt-6 text-lg font-medium">That&apos;s it.</p>
        </div>

        {/* ───── REAL EXAMPLE ───── */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            What this looks like in real life
          </h2>

          <div className="space-y-6">
            {/* Tenant submits */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-500">Tenant submits:</p>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="font-bold text-gray-700 w-24 flex-shrink-0">Property:</span>
                  <span className="text-gray-600">123 Main Street, Unit 2B</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-700 w-24 flex-shrink-0">Issue:</span>
                  <span className="text-gray-600">Plumbing</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-700 w-24 flex-shrink-0">Description:</span>
                  <span className="text-gray-600">Water leaking under sink</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-700 w-24 flex-shrink-0">Urgency:</span>
                  <span className="text-gray-600">Needs attention soon</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-gray-700 w-24 flex-shrink-0">Photos:</span>
                  <span className="text-gray-600">Attached</span>
                </div>
              </div>
            </div>

            {/* You receive */}
            <div className="border border-green-200 rounded-lg overflow-hidden bg-green-50">
              <div className="px-6 py-3 border-b border-green-200">
                <p className="text-sm font-medium text-green-700">You receive:</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  New request → fully detailed → ready to act
                </p>
                <p className="text-gray-700 mt-2">
                  You review → dispatch contractor → tenant is notified
                </p>
                <p className="text-gray-600 mt-3 font-medium">
                  No calls. No confusion. No delays.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── WHY THIS MATTERS ───── */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Why this changes your workflow
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Save hours every week</h3>
                <p className="text-gray-600">No more chasing missing details or clarifying requests</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Reduce calls and emails</h3>
                <p className="text-gray-600">Tenants know their request is in the system</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Make better decisions</h3>
                <p className="text-gray-600">You have all the information before taking action</p>
              </div>
            </div>

            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <div>
                <h3 className="font-bold text-gray-900">Keep tenants happier</h3>
                <p className="text-gray-600">Clear communication reduces frustration</p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── CUSTOMIZATION (compressed) ───── */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Flexible to your properties</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">Assign properties and units</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">Set issue categories</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">Add custom questions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">Customize confirmation messages</p>
            </div>
          </div>
        </div>

        {/* ───── RELATED FEATURES ───── */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related features</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">Receive requests, then dispatch to contractors immediately</p>
            </Link>

            <Link
              href="/features/job-tracking"
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Job Tracking</h3>
              <p className="text-gray-600 text-sm">Follow every repair from request to completion</p>
            </Link>

            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Repair History</h3>
              <p className="text-gray-600 text-sm">Every request becomes part of your property record</p>
            </Link>
          </div>
        </div>

        {/* ───── FINAL CTA ───── */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-10 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Give your tenants a better way to report issues
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-xl mx-auto">
            And give yourself a faster, cleaner way to manage them.
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
