import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Job Tracking — Stay on Top of Every Repair',
  description:
    'Track repair jobs from start to finish. Know what\u2019s scheduled, what\u2019s in progress, and what\u2019s completed — without chasing contractors.',
  alternates: {
    canonical: '/features/job-tracking',
  },
};

const problems = [
  'You don\u2019t know if the contractor actually started',
  'Updates come through texts, calls, and emails',
  'You forget which jobs are still open',
  'No way to see everything at a glance',
];

const solutions = [
  {
    title: 'See every job\u2019s status in real time',
    body: 'Know instantly what\u2019s scheduled, what\u2019s in progress, and what\u2019s done \u2014 across all properties.',
  },
  {
    title: 'Never lose track of open work',
    body: 'Every dispatched job stays visible until it\u2019s marked complete. Nothing falls through the cracks.',
  },
  {
    title: 'Keep notes and updates in one place',
    body: 'Add progress notes, photos, and cost updates as work happens. Everything attached to the job.',
  },
  {
    title: 'Know when things are overdue',
    body: 'If a contractor hasn\u2019t responded or a job has stalled, you\u2019ll see it. No more wondering.',
  },
];

const features = [
  'Status tracking (scheduled, in progress, completed)',
  'Timeline of every update per job',
  'Contractor response tracking',
  'Photo and note attachments',
  'Overdue job alerts',
  'Multi-property job overview',
];

export default function JobTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stay on Top of Every Job
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl">
            Once work begins, track progress without chasing updates. Know
            what&apos;s scheduled, what&apos;s in progress, and what&apos;s
            completed &mdash; all in real time.
          </p>
        </div>

        {/* Problem */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            The problem with tracking repair jobs
          </h2>
          <div className="space-y-3">
            {problems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
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
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How Maintenance OS keeps you in control
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

        {/* Features */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What&apos;s included
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <svg
                  className="h-5 w-5 flex-shrink-0 text-blue-600"
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
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Works well with
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">
                Send requests to contractors and track their responses.
              </p>
            </Link>
            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Repair History</h3>
              <p className="text-gray-600 text-sm">
                Completed jobs become part of your searchable repair history.
              </p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Stop wondering if jobs are getting done
          </h2>
          <p className="text-gray-600 mb-6">
            Track every repair from start to finish. Free to get started.
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
