import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Property Maintenance Software for Landlords',
  description:
    'Manage repairs, collect requests, compare quotes, and track every job across all your properties — in one place.',
  alternates: {
    canonical: '/for-landlords',
  },
};

const problems = [
  {
    title: 'Issues are scattered everywhere',
    body: 'One tenant texts, another emails, another calls. Requests get lost.',
  },
  {
    title: 'No clear system across properties',
    body: 'Property 1 has a leak. Property 2 needs HVAC. Property 3 needs painting. Nothing is centralized.',
  },
  {
    title: 'Contractor coordination is slow',
    body: 'You\u2019re calling different contractors, waiting for replies, and juggling schedules.',
  },
  {
    title: 'No record of work done',
    body: 'Who fixed what? When? How much did it cost? You\u2019re digging through old messages.',
  },
  {
    title: 'You\u2019re overpaying',
    body: 'Without comparing quotes, you accept the first price \u2014 with no leverage.',
  },
];

const solutions = [
  {
    title: 'See everything across all properties',
    body: 'View issues, jobs, and progress in one dashboard. No more guesswork.',
  },
  {
    title: 'Collect tenant requests in one place',
    body: 'Tenants submit issues through a simple system instead of texts and calls.',
  },
  {
    title: 'Dispatch to contractors instantly',
    body: 'Send requests via SMS or email in seconds \u2014 no back-and-forth.',
  },
  {
    title: 'Compare quotes before you decide',
    body: 'See pricing and timelines side-by-side. Choose the best option, not the first.',
  },
  {
    title: 'Track every job and cost',
    body: 'Know what\u2019s in progress, what\u2019s done, and how much you\u2019re spending.',
  },
];

const useCases = [
  {
    title: 'Managing 2\u201310 properties',
    body: 'Keep everything organized without needing complex software.',
  },
  {
    title: 'Property managers',
    body: 'Coordinate tenants, contractors, and owners in one system.',
  },
  {
    title: 'Vacation rentals',
    body: 'Handle turnover repairs and guest-reported issues quickly.',
  },
  {
    title: 'Self-managed landlords',
    body: 'Avoid expensive property management tools and stay in control.',
  },
];

const benefits = [
  {
    title: 'Save hours every week',
    body: 'No more juggling texts, emails, and spreadsheets.',
  },
  {
    title: 'Reduce maintenance costs',
    body: 'Compare quotes and negotiate with real data.',
  },
  {
    title: 'Respond faster to tenants',
    body: 'Keep everything organized and visible.',
  },
  {
    title: 'Have proof when you need it',
    body: 'Every repair, cost, and contractor is recorded.',
  },
  {
    title: 'Scale without chaos',
    body: 'Handle more properties without increasing complexity.',
  },
];

const featureSnapshot = [
  'Tenant intake forms',
  'Contractor dispatch (SMS + email)',
  'Quote comparison',
  'Multi-property tracking',
  'Repair history and records',
];

export default function ForLandlordsPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop chasing tenants and contractors
            <br className="hidden sm:block" />{' '}
            across properties
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Manage repairs, collect requests, compare quotes, and track every
            job &mdash; all in one place.
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
            Managing multiple properties gets chaotic fast
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
            Run maintenance like a system &mdash; not chaos
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
            Built for how landlords actually operate
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

        {/* Key Benefits */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why landlords switch to Maintenance OS
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {benefits.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
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
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Snapshot */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Everything you need to manage maintenance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureSnapshot.map((item) => (
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
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8 lg:p-10 mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Simple, transparent pricing
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Free tier</span>
                <p className="text-gray-600 text-sm">Track repairs for 1 property, unlimited issues.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Professional tier</span>
                <p className="text-gray-600 text-sm">Manage up to 5 properties.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">Optional SMS dispatch</span>
                <p className="text-gray-600 text-sm">Included during beta.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div>
                <span className="font-bold text-gray-900">No monthly commitment</span>
                <p className="text-gray-600 text-sm">Scale as you grow.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Learn how to manage maintenance better
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/guides/how-to-manage-rental-property-maintenance"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">How to manage rental property maintenance</h3>
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
            Simplify maintenance across all your properties
          </h2>
          <p className="text-gray-600 mb-6">
            Start free today. Scale as your portfolio grows.
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
