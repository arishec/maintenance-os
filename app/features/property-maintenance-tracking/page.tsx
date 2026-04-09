import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Property Maintenance Tracking — Never Lose Track of a Repair',
  description:
    'Track every maintenance issue, contractor, and update across your properties — all in one place. Free forever.',
  alternates: {
    canonical: '/features/property-maintenance-tracking',
  },
};

const whyItMatters = [
  'Issues get lost in texts and emails',
  'You forget what was done and when',
  'Contractors fall through the cracks',
  'Costs spiral without visibility',
];

const painPoints = [
  'You\u2019re digging through messages',
  'You\u2019re guessing what\u2019s done',
  'You\u2019re reacting instead of managing',
];

const capabilities = [
  {
    title: 'Track issues from start to finish',
    body: 'Report problems instantly with photos, descriptions, and severity.',
  },
  {
    title: 'Automatic categorization',
    body: 'Know exactly what type of issue it is and what contractor you need.',
  },
  {
    title: 'Set priorities',
    body: 'Urgent vs normal vs low \u2014 organize your workload instantly.',
  },
  {
    title: 'Real-time status tracking',
    body: 'See every issue move from reported \u2192 dispatched \u2192 completed.',
  },
  {
    title: 'Attach everything',
    body: 'Photos, invoices, contractor notes, and history \u2014 all in one place.',
  },
];

const valueProps = [
  {
    title: 'Never forget an issue',
    body: 'Everything stays in one system.',
  },
  {
    title: 'Instant visibility',
    body: 'See what\u2019s open, in progress, and done.',
  },
  {
    title: 'Search anything',
    body: 'Find repairs by property, type, contractor, or date.',
  },
  {
    title: 'Build a full repair history',
    body: 'Perfect for resale, insurance, and planning.',
  },
];

const audiences = [
  {
    title: 'Homeowners',
    body: 'Know exactly what\u2019s been fixed and when.',
  },
  {
    title: 'Landlords',
    body: 'Manage repairs across multiple properties without chaos.',
  },
  {
    title: 'Property managers',
    body: 'Track everything and report with confidence.',
  },
];

export default function PropertyMaintenanceTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Never Lose Track of a Repair Again
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Track every maintenance issue, contractor, and update across your
            properties &mdash; all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>
          <div className="mt-3 flex justify-center gap-3 text-sm text-gray-500">
            <span>No credit card</span>
            <span aria-hidden="true">·</span>
            <span>Set up in 2 minutes</span>
            <span aria-hidden="true">·</span>
            <span>Works for 1 property or 100</span>
          </div>
        </div>

        {/* Why this matters */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why property maintenance tracking matters
          </h2>
          <div className="space-y-3 mb-4">
            {whyItMatters.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3"
              >
                <svg
                  className="h-5 w-5 flex-shrink-0 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm">
            <span className="font-bold text-gray-900">With a proper system:</span>{' '}
            <span className="text-gray-600">You see everything, instantly.</span>
          </p>
        </section>

        {/* What this fixes */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Stop managing maintenance the hard way
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
              <p className="font-bold text-gray-900 mb-3 text-sm">Without a system:</p>
              <div className="space-y-2">
                {painPoints.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-5">
              <p className="font-bold text-gray-900 mb-3 text-sm">With Maintenance OS:</p>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-gray-700 text-sm font-medium">
                  Everything is tracked automatically.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Early CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Start organizing your maintenance today.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors mt-3"
          >
            Start Free
          </Link>
        </section>

        {/* Core capabilities */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Everything you need to track maintenance
          </h2>
          <div className="space-y-4">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
              >
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What you get with proper tracking
          </h2>
          <div className="space-y-4">
            {valueProps.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <div>
                  <span className="font-bold text-gray-900">{item.title}</span>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who this is for */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Built for anyone managing property maintenance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-xl p-5"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related features */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Powerful features that work together
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">
                Send requests instantly via SMS and email.
              </p>
            </Link>
            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Repair History</h3>
              <p className="text-gray-600 text-sm">
                Every issue becomes part of a searchable timeline.
              </p>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start tracking maintenance" subheading="Every repair, every property — one system." />
        </section>
      </main>
    </PublicLayout>
  );
}
