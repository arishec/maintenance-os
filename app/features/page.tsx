import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Property Maintenance Features — Repair Tracking, Contractor Dispatch & Quotes',
  description:
    'Track repairs, dispatch contractors via SMS and email, compare quotes side-by-side, and manage every job from issue to completion.',
  alternates: {
    canonical: '/features',
  },
};

const features = [
  {
    headline: 'AI looks at your photos and classifies the issue',
    body: 'Upload a photo and AI instantly describes what it sees \u2014 water damage, cracked drywall, a broken fixture. It uses that analysis to classify the issue, set urgency, and recommend the right trade. Contractors receive the photos and AI descriptions so they can quote accurately before showing up.',
    href: '/features/property-maintenance-tracking',
  },
  {
    headline: 'Stop losing track of repairs',
    body: 'Know exactly what\u2019s happening at every property \u2014 without digging through texts or emails. Track every issue from the moment it\u2019s reported to final completion. See status, updates, photos, and notes all in one place. No more guessing what was fixed, when, or by who.',
    href: '/features/property-maintenance-tracking',
  },
  {
    headline: 'Send one request to multiple contractors at once',
    body: 'Stop texting contractors one by one. Send the issue once and instantly reach multiple contractors. They receive the details and can respond directly with availability, pricing, or questions. Get faster responses and keep everything organized automatically.',
    href: '/features/contractor-dispatch',
  },
  {
    headline: 'Compare quotes side-by-side',
    body: 'No more juggling texts, emails, and notes. See all contractor responses in one place. Compare pricing, timelines, and details clearly so you can make a fast, confident decision. Choose the best option \u2014 without the chaos.',
    href: '/features/quote-comparison',
  },
  {
    headline: 'Stay on top of every job',
    body: 'Once work begins, track progress without chasing updates. Know what\u2019s scheduled, what\u2019s in progress, and what\u2019s completed \u2014 all in real time. No more wondering if a job is actually getting done.',
    href: '/features/job-tracking',
  },
  {
    headline: 'Keep a complete record of everything',
    body: 'Every repair, every cost, every update \u2014 stored automatically. Search by property, issue, contractor, or date. Use it for maintenance planning, taxes, insurance, or resale. Never lose your repair history again.',
    href: '/features/repair-history',
  },
];

const reasons = [
  'No more chasing contractors for updates',
  'No more scattered quotes across texts and emails',
  'No more guessing what was fixed or when',
  'Everything organized in one place',
  'Make faster, better repair decisions',
];

export default function FeaturesPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop chasing contractors.
            <br className="hidden sm:block" />{' '}
            Manage every repair in one place.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Send one request. Get multiple quotes. Track everything from issue to
            completion &mdash; without texts, spreadsheets, or guesswork.
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

        {/* Core value strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 sm:mb-20">
          {[
            'Send one issue to multiple contractors at once',
            'Compare quotes side-by-side',
            'Track every repair across all properties',
            'Never lose updates, photos, or history again',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
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
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-10 sm:space-y-14 mb-16 sm:mb-20">
          {features.map((feature, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {feature.headline}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.body}
              </p>
              <Link
                href={feature.href}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn more &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* Why this matters */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why people switch to Maintenance OS
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {reasons.map((reason) => (
              <div key={reason} className="flex items-start gap-3">
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
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Ready to simplify your maintenance?
          </h2>
          <p className="text-gray-600 mb-6">
            Start managing repairs the easy way. No credit card required.
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
