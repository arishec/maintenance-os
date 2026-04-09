import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Quote Comparison — Compare Contractor Quotes Without the Mess',
  description:
    'No spreadsheets. No copying and pasting. Get multiple bids organized instantly so you can choose the right contractor with confidence.',
  alternates: {
    canonical: '/features/quote-comparison',
  },
};

const problemItems = [
  'One contractor texts you',
  'Another emails a PDF',
  'Another leaves a voicemail',
];

const solutionItems = [
  'See all quotes in one place',
  'Compare pricing instantly',
  'Evaluate timelines and details',
  'Make a confident decision fast',
];

const decisionBenefits = [
  {
    title: 'See prices side by side',
    body: 'Instantly know who\u2019s cheapest and fastest.',
  },
  {
    title: 'Understand what you\u2019re actually getting',
    body: 'Compare scope, notes, and warranties.',
  },
  {
    title: 'Avoid bad decisions',
    body: 'Spot red flags before you hire.',
  },
  {
    title: 'Choose in one click',
    body: 'Accept the best quote and move forward.',
  },
];

const whyItMatters = [
  {
    title: 'Save money',
    body: 'Multiple bids often reduce costs by hundreds per job.',
  },
  {
    title: 'Save time',
    body: 'No spreadsheets, no manual comparison.',
  },
  {
    title: 'Negotiate better',
    body: 'Use competing quotes to get better pricing.',
  },
  {
    title: 'Build better contractor relationships',
    body: 'Track who performs well over time.',
  },
];

const organized = [
  'Quotes stored automatically',
  'Contractor history tracked',
  'Notes saved for future decisions',
  'Export if needed',
];

export default function QuoteComparisonPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare Contractor Quotes
            <br className="hidden sm:block" />{' '}
            Without the Mess
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            No spreadsheets. No copying and pasting. Get multiple bids organized
            instantly so you can choose the right contractor with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
            <Link
              href="#example"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See Example
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

        {/* Problem */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Getting multiple quotes is chaotic
          </h2>
          <div className="space-y-3 mb-4">
            {problemItems.map((item) => (
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
          <p className="text-gray-700 text-sm mb-1">
            Now you&apos;re piecing everything together manually.
          </p>
          <p className="text-gray-900 font-bold text-sm">
            Comparing prices, timelines, and details becomes messy &mdash; and
            easy to get wrong.
          </p>
        </section>

        {/* Solution */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All your quotes. One clean view.
          </h2>
          <p className="text-gray-700 text-sm mb-4">
            Everything is organized automatically so you can:
          </p>
          <div className="space-y-3">
            {solutionItems.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-green-600"
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
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Early CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Start comparing quotes in seconds.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors mt-3"
          >
            Get Started Free
          </Link>
        </section>

        {/* Example */}
        <section id="example" className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            See how it works (real example)
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            You dispatch a roof repair to 3 contractors.
          </p>
          <p className="text-gray-700 text-sm mb-6">
            Within 24 hours, you get:
          </p>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">
                      Contractor
                    </th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">
                      Timeline
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      Smith Roofing
                    </td>
                    <td className="py-3 px-4 text-right font-medium">$2,800</td>
                    <td className="py-3 px-4 text-gray-600">5&ndash;7 days</td>
                    <td className="py-3 px-4 text-gray-600">
                      New shingles, detailed inspection
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      Peak Repairs
                    </td>
                    <td className="py-3 px-4 text-right font-medium">$2,200</td>
                    <td className="py-3 px-4 text-gray-600">10&ndash;14 days</td>
                    <td className="py-3 px-4 text-gray-600">
                      Patch repair, may need more work
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      Honest Contractors
                    </td>
                    <td className="py-3 px-4 text-right font-medium">$2,500</td>
                    <td className="py-3 px-4 text-gray-600">7&ndash;10 days</td>
                    <td className="py-3 px-4 text-gray-600">
                      Full repair, warranty included
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-1">
            Instead of digging through messages&hellip;
          </p>
          <p className="text-gray-900 font-bold text-sm">
            You see everything side by side instantly.
          </p>
        </section>

        {/* Decision benefits */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Make better decisions, faster
          </h2>
          <div className="space-y-4">
            {decisionBenefits.map((item) => (
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

        {/* Why it matters */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why quote comparison matters
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

        {/* Everything stays organized */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Everything stays organized
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {organized.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
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
                <span className="text-gray-700 text-sm">{item}</span>
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
                Send requests and collect quotes instantly.
              </p>
            </Link>
            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Property Tracking</h3>
              <p className="text-gray-600 text-sm">
                Keep all repairs and quotes tied to each property.
              </p>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start comparing quotes" subheading="See contractor pricing side by side." />
        </section>
      </main>
    </PublicLayout>
  );
}
