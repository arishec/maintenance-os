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

const aiHighlights = [
  {
    icon: (
      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
      </svg>
    ),
    title: 'Photo diagnosis',
    body: 'Upload a photo — AI describes the damage and severity',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
    title: 'Auto-classification',
    body: 'Instantly sorts by trade, urgency, and timeframe',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: 'Quote parsing',
    body: 'Reads contractor SMS/email and extracts the numbers',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'Quote comparison',
    body: 'Analyzes bids and recommends the best value',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
    title: 'Multi-issue detection',
    body: 'List multiple problems at once — AI splits them apart or groups them for one contractor',
  },
];

const features = [
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

        {/* AI Showcase */}
        <section className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-6 sm:p-8 lg:p-10 mb-16 sm:mb-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              AI-Powered
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            AI built into every step of the repair process
          </h2>
          <p className="text-gray-600 mb-6">
            Not a chatbot. Real AI that classifies issues, reads contractor replies, compares quotes, and extracts invoices &mdash; automatically.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {aiHighlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl bg-white border border-purple-100 p-3.5">
                <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/features/ai-powered-maintenance"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            See all 8 AI features
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </section>

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
