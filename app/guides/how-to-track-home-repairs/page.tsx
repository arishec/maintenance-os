import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'How to Track Home Repairs (Without Spreadsheets or Chaos)',
  description:
    'A simple system to organize repairs, compare contractors, and never lose track of what was done.',
  alternates: {
    canonical: '/guides/how-to-track-home-repairs',
  },
};

const whyItMatters = [
  {
    title: 'Increase resale value',
    body: 'Buyers trust homes with documented maintenance history.',
  },
  {
    title: 'Protect insurance claims',
    body: 'Proof of repairs can prevent denied claims.',
  },
  {
    title: 'Avoid repeat issues',
    body: 'Spot patterns before problems get expensive.',
  },
  {
    title: 'Stay organized',
    body: 'Know exactly what was done, when, and by who.',
  },
];

const wrongWays = [
  'Texts and emails get lost',
  'Spreadsheets become outdated',
  'Receipts are scattered',
  'You forget what was done',
];

const trackingMethods = [
  {
    number: '1',
    title: 'Spreadsheets',
    body: 'Works\u2026 until you stop updating it.',
  },
  {
    number: '2',
    title: 'Folders + photos',
    body: 'Better, but hard to search and manage.',
  },
  {
    number: '3',
    title: 'A dedicated system',
    body: 'Everything organized automatically in one place.',
    highlight: true,
  },
];

const whatToTrack = [
  'Date',
  'Type of issue',
  'Location',
  'Description',
  'Contractor',
  'Cost',
  'Photos',
  'Warranty',
];

const commonMistakes = [
  'Not updating regularly',
  'Losing receipts',
  'Vague descriptions',
  'Not tracking costs',
  'Forgetting contractor details',
];

const toolOptions = [
  {
    title: 'Spreadsheets',
    verdict: 'require discipline',
  },
  {
    title: 'Notes apps',
    verdict: 'get messy fast',
  },
  {
    title: 'File storage',
    verdict: 'hard to search',
  },
];

const advancedUses = [
  'Planning upgrades',
  'Budgeting maintenance',
  'Comparing contractors',
  'Preparing for resale',
  'Filing insurance claims',
];

export default function HowToTrackHomeRepairsPage() {
  return (
    <PublicLayout>
      <ArticleJsonLd
        headline="How to Track Home Repairs (Without Spreadsheets or Chaos)"
        description="A simple system to organize repairs, compare contractors, and never lose track of what was done."
        path="/guides/how-to-track-home-repairs"
        datePublished="2026-03-27"
        dateModified="2026-03-30"
      />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How to Track Home Repairs
            <br className="hidden sm:block" />
            <span className="text-gray-500"> (Without Spreadsheets or Chaos)</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A simple system to organize repairs, compare contractors, and never
            lose track of what was done.
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
            Why tracking home repairs actually matters
          </h2>
          <div className="space-y-4">
            {whyItMatters.map((item) => (
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

        {/* The real problem */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Most people track repairs the wrong way
          </h2>
          <div className="space-y-3 mb-4">
            {wrongWays.map((item) => (
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
            Result: You lose time, money, and clarity.
          </p>
        </section>

        {/* 3 ways to track */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            There are 3 ways people usually do this
          </h2>
          <div className="space-y-4">
            {trackingMethods.map((method) => (
              <div
                key={method.number}
                className={`rounded-xl border p-4 sm:p-5 ${
                  method.highlight
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      method.highlight
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {method.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {method.title}
                      {method.highlight && (
                        <span className="ml-2 text-blue-600 text-sm font-medium">
                          (easiest)
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{method.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The easiest way */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The easiest way to track repairs today
          </h2>
          <p className="text-gray-700 mb-4">
            Instead of manually tracking everything, use a system that:
          </p>
          <div className="space-y-3 mb-4">
            {[
              'Logs every issue automatically',
              'Stores photos, receipts, and notes',
              'Tracks contractor details and costs',
              'Lets you search everything instantly',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
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
            That&apos;s exactly what Maintenance OS does.
          </p>
        </section>

        {/* Early CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Stop trying to manage repairs manually.
          </p>
          <p className="text-gray-600 mb-4">
            Start tracking everything in one place.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start Free
          </Link>
        </section>

        {/* What to track */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What you should track for every repair
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {whatToTrack.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center"
              >
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-900 font-bold text-sm mt-4">
            If you don&apos;t track these, you&apos;ll regret it later.
          </p>
        </section>

        {/* Common mistakes */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Common mistakes to avoid
          </h2>
          <div className="space-y-3 mb-4">
            {commonMistakes.map((item) => (
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
            These are the exact problems a system solves.
          </p>
        </section>

        {/* Tools */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tools that actually work
          </h2>
          <div className="space-y-3 mb-4">
            {toolOptions.map((tool) => (
              <div
                key={tool.title}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <span className="font-bold text-gray-900 text-sm">{tool.title}</span>
                <span className="text-gray-500 text-sm">&rarr; {tool.verdict}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-bold text-gray-900">Best option:</span>
          </p>
          <p className="text-gray-600 text-sm">
            Use a dedicated repair tracking system that handles everything automatically.
          </p>
        </section>

        {/* Mid-page CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Track your repairs the easy way.
          </p>
          <p className="text-gray-600 mb-4">
            No spreadsheets. No chaos.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start Free
          </Link>
        </section>

        {/* Advanced uses */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What this helps with long-term
          </h2>
          <div className="space-y-3">
            {advancedUses.map((item) => (
              <div key={item} className="flex items-center gap-3">
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

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start tracking repairs today" subheading="Put everything from this guide into practice — free." />
        </section>
      </main>
    </PublicLayout>
  );
}
