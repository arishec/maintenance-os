import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Property Maintenance Software for Landlords & Homeowners | Maintenance OS',
  description:
    'Track repairs, compare contractor quotes, and manage property maintenance in one system. Built for landlords and homeowners managing 1–50+ properties.',
  alternates: {
    canonical: '/property-maintenance-software',
  },
};

const capabilities = [
  {
    title: 'Track every repair request in one place',
    body: 'No more scattered texts, calls, or forgotten emails. All repair requests live in one searchable system.',
  },
  {
    title: 'Send jobs to multiple contractors at once',
    body: 'Dispatch repair requests via SMS or email to your entire contractor network instantly.',
  },
  {
    title: 'Compare pricing and timelines side by side',
    body: 'See quotes from different contractors next to each other. Make informed decisions, not guesses.',
  },
  {
    title: 'Track job progress from start to finish',
    body: 'Know exactly what\'s in progress, what\'s completed, and what\'s pending.',
  },
  {
    title: 'Keep a permanent, searchable repair history',
    body: 'Every repair, cost, contractor, and timeline is recorded. Look back anytime you need it.',
  },
];

const whyNeeded = [
  {
    title: 'Repairs get lost in the chaos',
    body: 'Texts, emails, calls, and memory don\'t scale. Critical repairs fall through the cracks.',
  },
  {
    title: 'You can\'t compare contractor pricing',
    body: 'Without side-by-side quotes, you accept the first price and overpay.',
  },
  {
    title: 'No record of what was done',
    body: 'When issues pop up later, you have no proof of previous repairs or costs.',
  },
  {
    title: 'Communication takes forever',
    body: 'Coordinating contractors through phone calls and emails wastes hours every week.',
  },
  {
    title: 'You\'re flying blind on maintenance costs',
    body: 'Without a system, you never know how much you\'re really spending on repairs.',
  },
];

const useCases = [
  {
    title: 'Landlords managing rental properties',
    body: 'Collect tenant repair requests, dispatch to contractors, track costs, and maintain compliance records.',
  },
  {
    title: 'Homeowners tracking home repairs',
    body: 'Keep a complete history of everything fixed in your home, from estimates to invoices.',
  },
  {
    title: 'Property managers coordinating across buildings',
    body: 'Manage repairs across multiple properties and tenants without duplicated work.',
  },
  {
    title: 'Self-managed landlords',
    body: 'Avoid expensive property management software and stay in direct control of your properties.',
  },
];

const features = [
  'Repair request management',
  'Contractor dispatch (SMS & email)',
  'Quote comparison tools',
  'Multi-property tracking',
  'Repair history & search',
  'Cost tracking & reporting',
];

export default function PropertyMaintenanceSoftwarePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Property Maintenance Software That Actually
            <br className="hidden sm:block" /> Keeps Repairs Organized
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Maintenance OS is property maintenance software that helps landlords and homeowners track repairs, manage contractor communication, compare quotes, and maintain a complete history of every job — without spreadsheets, scattered texts, or guesswork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Start Managing Your Properties
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* What is Property Maintenance Software */}
        <section className="mb-14 sm:mb-20 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            What is property maintenance software?
          </h2>
          <p className="text-lg text-gray-600">
            Property maintenance software is a system used to track repair requests, manage contractors, compare quotes, and keep records of maintenance work across one or multiple properties. Instead of managing repairs through texts, calls, and memory, everything lives in one structured workflow.
          </p>
        </section>

        {/* Why People Need Better System */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why most people need a better system
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
            Most people manage repairs through scattered texts, phone calls, emails, and memory. This leads to missed updates, unclear pricing, lost invoices, and no record of what was fixed. Maintenance OS replaces all of that with one structured workflow.
          </p>
          <div className="space-y-4">
            {whyNeeded.map((item) => (
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

        {/* What You Can Do With Maintenance OS */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            What you can do with Maintenance OS
          </h2>
          <div className="space-y-4">
            {capabilities.map((item) => (
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

        {/* Who It's Built For */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Who it's built for
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

        {/* Key Features */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Everything included in Maintenance OS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Pages */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Learn more about managing property maintenance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/compare-contractor-quotes"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Compare Contractor Quotes</h3>
              <p className="text-gray-600 text-sm">Get better pricing by comparing multiple contractors side by side.</p>
            </Link>
            <Link
              href="/track-rental-property-repairs"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Track Rental Property Repairs</h3>
              <p className="text-gray-600 text-sm">Keep a complete history of every repair across all your properties.</p>
            </Link>
            <Link
              href="/landlord-maintenance-software"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Landlord Maintenance Software</h3>
              <p className="text-gray-600 text-sm">Specialized tools for managing multiple rental properties.</p>
            </Link>
            <Link
              href="/home-repair-tracking"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Home Repair Tracking</h3>
              <p className="text-gray-600 text-sm">Track repairs and maintenance for your home in one place.</p>
            </Link>
            <Link
              href="/features"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">See All Features</h3>
              <p className="text-gray-600 text-sm">Explore the complete feature set of Maintenance OS.</p>
            </Link>
            <Link
              href="/how-it-works"
              className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">How It Works</h3>
              <p className="text-gray-600 text-sm">Walk through the process of managing maintenance with Maintenance OS.</p>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Start managing your property maintenance in one system
          </h2>
          <p className="text-gray-600 mb-6">
            Built for landlords and homeowners managing 1 to 50+ properties.
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
