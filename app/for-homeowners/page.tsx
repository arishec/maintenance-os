import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Home Repair Tracker for Homeowners',
  description:
    'Send one request, get multiple quotes, and keep every repair organized — without texts, spreadsheets, or guesswork.',
  alternates: {
    canonical: '/for-homeowners',
  },
};

const problems = [
  {
    title: 'Contractors respond in different places',
    body: 'One texts, one emails, one calls. Now you\u2019re searching for that quote again.',
  },
  {
    title: 'Spreadsheets don\u2019t actually solve it',
    body: 'You try to track things, but it quickly becomes confusing and outdated.',
  },
  {
    title: 'You forget what was done',
    body: 'Was the bathroom fixed last year\u2026 or two years ago? Who did it? What did it cost?',
  },
  {
    title: 'No proof when you need it',
    body: 'Selling your home or filing a claim? You don\u2019t have clean records.',
  },
  {
    title: 'Comparing quotes takes too long',
    body: 'You\u2019re copying numbers across texts and emails just to compare options.',
  },
];

const solutions = [
  {
    title: 'Everything in one place',
    body: 'See every issue, update, and job in a single dashboard \u2014 no more digging through messages.',
  },
  {
    title: 'Send one request to multiple contractors',
    body: 'Stop reaching out one by one. Send once and get responses faster.',
  },
  {
    title: 'Compare quotes instantly',
    body: 'See prices, timelines, and details side-by-side. Make decisions in minutes, not hours.',
  },
  {
    title: 'Track every repair from start to finish',
    body: 'Know what\u2019s scheduled, what\u2019s in progress, and what\u2019s done \u2014 at all times.',
  },
  {
    title: 'Keep a complete repair history',
    body: 'Every repair, cost, photo, and note saved automatically for future reference.',
  },
];

const useCases = [
  {
    title: 'Just bought a home',
    body: 'Start tracking everything from day one so nothing gets lost.',
  },
  {
    title: 'Preparing to sell',
    body: 'Show a clean, organized repair history to buyers.',
  },
  {
    title: 'Filing insurance claims',
    body: 'Find receipts, photos, and contractor details instantly.',
  },
  {
    title: 'Managing multiple quotes',
    body: 'Compare contractors without juggling texts and emails.',
  },
];

export default function ForHomeownersPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop losing track of home repairs
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Send one request, get multiple quotes, and keep every repair
            organized &mdash; without texts, spreadsheets, or guesswork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Problem */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Home repairs get messy fast
          </h2>
          <div className="space-y-4">
            {problems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-4 sm:p-5"
              >
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400"
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
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Here&apos;s how Maintenance OS fixes it
          </h2>
          <div className="space-y-4">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-green-100 bg-green-50 p-4 sm:p-5"
              >
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
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Perfect for homeowners who want control
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-xl p-5 sm:p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Features Snapshot */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            What you can do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/features/quote-comparison"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-bold text-gray-900 mb-2">Compare quotes side-by-side</h3>
            </Link>
            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-bold text-gray-900 mb-2">Keep a searchable repair timeline</h3>
            </Link>
            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-bold text-gray-900 mb-2">Track issues from report to completion</h3>
            </Link>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8 lg:p-10 mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Simple pricing
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">Free forever for 1 property</span>
                <p className="text-gray-600 text-sm">Track repairs, compare quotes, unlimited issues.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">Optional SMS dispatch</span>
                <p className="text-gray-600 text-sm">
                  Pay only when you send messages to contractors (~$0.50&ndash;$0.75 per SMS).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">No monthly fees</span>
                <p className="text-gray-600 text-sm">Your repair history stays available forever.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Guides */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Learn how to manage repairs better
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/guides/how-to-track-home-repairs"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">How to track home repairs</h3>
            </Link>
            <Link
              href="/guides/how-to-compare-contractor-quotes"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">How to compare contractor quotes</h3>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Get all your home repairs organized
          </h2>
          <p className="text-gray-600 mb-6">
            Start today &mdash; free for one property. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}
