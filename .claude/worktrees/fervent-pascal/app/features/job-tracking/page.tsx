import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Job Tracking — Know What\u2019s Happening With Every Job',
  description:
    'No more chasing contractors. See what\u2019s scheduled, in progress, and completed across all your properties in real time.',
  alternates: {
    canonical: '/features/job-tracking',
  },
};

const problems = [
  'You don\u2019t know if the contractor actually started',
  'Updates come through texts, calls, and emails',
  'You forget which jobs are still open',
  'There\u2019s no single place to see everything',
];

const benefits = [
  {
    title: 'See every job\u2019s status instantly',
    body: 'Know what\u2019s scheduled, in progress, and completed across all properties.',
  },
  {
    title: 'Never lose track of open work',
    body: 'Jobs stay visible until they\u2019re done \u2014 nothing disappears.',
  },
  {
    title: 'All updates in one place',
    body: 'Photos, notes, and progress updates tied directly to each job.',
  },
  {
    title: 'Know when something is stuck',
    body: 'See delays, missed responses, or stalled jobs immediately.',
  },
];

const whyItMatters = [
  {
    title: 'Avoid missed or forgotten work',
    body: 'Every job stays visible until completion.',
  },
  {
    title: 'Save time',
    body: 'No more chasing contractors for updates.',
  },
  {
    title: 'Stay in control',
    body: 'Know exactly what\u2019s happening without asking.',
  },
  {
    title: 'Look professional',
    body: 'Have a clear record of work for owners, tenants, or resale.',
  },
];

export default function JobTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Know Exactly What&apos;s Happening
            <br className="hidden sm:block" />{' '}
            With Every Job
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            No more chasing contractors. No more guessing. See what&apos;s
            scheduled, in progress, and completed &mdash; across all your
            properties in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Track Jobs Free
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
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Repair jobs are hard to stay on top of
          </h2>
          <div className="space-y-3 mb-4">
            {problems.map((item) => (
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
          <p className="text-gray-900 font-bold text-sm">
            Things fall through the cracks &mdash; and you&apos;re left
            guessing.
          </p>
        </section>

        {/* Solution */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Everything in one place. Always up to date.
          </h2>
          <div className="rounded-xl border border-green-100 bg-green-50 p-5 sm:p-6">
            <p className="text-gray-700 text-sm">
              Track every job from start to finish with a clear, real-time view.
            </p>
          </div>
        </section>

        {/* Core benefits */}
        <section className="mb-12 sm:mb-16">
          <div className="space-y-4">
            {benefits.map((item) => (
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

        {/* Mid CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Stop chasing updates.
          </p>
          <p className="text-gray-600 mb-3">
            Start tracking everything in one place.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </section>

        {/* Example */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What this actually looks like
          </h2>
          <p className="text-gray-700 text-sm mb-6">
            You open your dashboard and see:
          </p>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-6">
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-3 p-4">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">3 jobs</span> in progress
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">1 job</span> waiting on contractor
                  response
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">2 completed</span> this week
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">1 job</span> hasn&apos;t been
                  updated in 5 days &mdash;{' '}
                  <span className="text-red-600 font-bold">flagged as overdue</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-1">
            Instead of texting or calling&hellip;
          </p>
          <p className="text-gray-900 font-bold text-sm">
            You already know what needs attention.
          </p>
        </section>

        {/* Why it matters */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why job tracking matters
          </h2>
          <div className="space-y-4 max-w-2xl">
            {whyItMatters.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
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
                  <span className="font-bold text-gray-900">{item.title}</span>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Works seamlessly with
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">
                Contractor Dispatch
              </h3>
              <p className="text-gray-600 text-sm">
                Send jobs and track responses in one place.
              </p>
            </Link>
            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Repair History</h3>
              <p className="text-gray-600 text-sm">
                Every completed job becomes part of your long-term record.
              </p>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Stop wondering if jobs are getting done
          </h2>
          <p className="text-gray-600 mb-6">
            See everything clearly. Catch issues early. Stay in control.
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
