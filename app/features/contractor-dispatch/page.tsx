import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Contractor Dispatch — Stop Chasing Contractors',
  description:
    'Send maintenance requests to multiple contractors in seconds and get replies without phone calls, voicemails, or email chains.',
  alternates: {
    canonical: '/features/contractor-dispatch',
  },
};

const problems = [
  'You call one contractor \u2014 no answer',
  'You leave voicemails \u2014 no callback',
  'You email \u2014 slow responses',
  'You chase updates \u2014 constantly',
];

const steps = [
  {
    number: '1',
    title: 'Report an issue',
    body: 'Add details, photos, and priority level.',
  },
  {
    number: '2',
    title: 'Select contractors',
    body: 'Choose one or multiple contractors for quotes.',
  },
  {
    number: '3',
    title: 'Send instantly',
    body: 'Dispatch via SMS and/or email in one click.',
  },
  {
    number: '4',
    title: 'Contractors respond',
    body: 'They accept, ask questions, or send quotes.',
  },
  {
    number: '5',
    title: 'You choose and move forward',
    body: 'Compare responses and hire the best option.',
  },
];

const benefits = [
  {
    title: 'No more phone tag',
    body: 'Stop calling, waiting, and following up.',
  },
  {
    title: 'Faster responses',
    body: 'Contractors reply quickly via SMS.',
  },
  {
    title: 'Everything in one place',
    body: 'All replies show up in your dashboard.',
  },
  {
    title: 'Multiple quotes instantly',
    body: 'Get competitive pricing without extra work.',
  },
];

const whatGetsSent = [
  'Issue description',
  'Property location',
  'Photos (if included)',
  'Contact details',
  'Quick reply options',
];

const useCases = [
  {
    title: 'Urgent repairs',
    body: 'Dispatch immediately and get same-day responses.',
  },
  {
    title: 'Getting multiple quotes',
    body: 'Send to 3 contractors at once \u2014 compare instantly.',
  },
  {
    title: 'Managing multiple properties',
    body: 'Dispatch across properties without confusion.',
  },
];

export default function ContractorDispatchPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop Chasing Contractors.
            <br className="hidden sm:block" />{' '}
            Get Responses Fast.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Send maintenance requests to multiple contractors in seconds &mdash;
            and get replies without phone calls, voicemails, or email chains.
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

        {/* Problem */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            The problem with contractor coordination
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
            Everything takes longer than it should.
          </p>
        </section>

        {/* Solution */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dispatch requests instantly
          </h2>
          <div className="rounded-xl border border-green-100 bg-green-50 p-5 sm:p-6">
            <p className="text-gray-900 font-bold mb-2">
              Send one request &rarr; reach multiple contractors &rarr; get
              responses fast
            </p>
            <p className="text-gray-600 text-sm">
              No calls. No back-and-forth. No chaos.
            </p>
          </div>
        </section>

        {/* Early CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Send your first dispatch in seconds.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors mt-3"
          >
            Start Free
          </Link>
        </section>

        {/* How it works */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How contractor dispatch works
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why this saves you hours
          </h2>
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

        {/* What gets sent */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Everything contractors need &mdash; automatically
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {whatGetsSent.map((item) => (
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
          <p className="text-gray-900 font-bold text-sm">
            No back-and-forth needed.
          </p>
        </section>

        {/* Use cases */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Common scenarios
          </h2>
          <div className="space-y-4">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-xl p-5"
              >
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Simple pricing
          </h2>
          <div className="space-y-3 max-w-xl">
            <p className="text-gray-900">
              <span className="font-bold text-lg">SMS dispatch included during beta</span>
            </p>
            <p className="text-gray-600 text-sm">
              No monthly fees. No per-message charges. No surprises.
            </p>
            <p className="text-gray-900 font-bold text-sm">
              Everything is free while we&apos;re building.
            </p>
          </div>
        </section>

        {/* Related features */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Works even better with
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/features/quote-comparison"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Quote Comparison</h3>
              <p className="text-gray-600 text-sm">
                Compare contractor bids side by side.
              </p>
            </Link>
            <Link
              href="/features/property-maintenance-tracking"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Property Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track issues before and after dispatch.
              </p>
            </Link>
            <Link
              href="/features/tenant-intake"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Tenant Intake</h3>
              <p className="text-gray-600 text-sm">
                Collect requests, then dispatch instantly.
              </p>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start dispatching to contractors" subheading="Send one request, reach your whole network." />
        </section>
      </main>
    </PublicLayout>
  );
}
