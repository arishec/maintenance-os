import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Landlord Maintenance Software | Track Rental Property Repairs',
  description:
    'Maintenance software built for landlords. Track repairs, manage contractors, compare quotes, and organize maintenance across all your rental properties.',
  alternates: {
    canonical: '/landlord-maintenance-software',
  },
};

const manageAcrossProperties = [
  {
    title: 'Organize by property',
    body: 'See what needs fixing at each property without digging through messages.',
  },
  {
    title: 'Track by contractor',
    body: 'Know who\'s handling what and when they\'re scheduled.',
  },
  {
    title: 'Monitor costs in real time',
    body: 'Watch your spending across all repairs and properties.',
  },
  {
    title: 'One dashboard for everything',
    body: 'View open issues, in-progress work, and completed repairs at a glance.',
  },
];

const stopChasingContractors = [
  {
    title: 'Send bulk requests',
    body: 'Reach multiple contractors at once instead of texting individually.',
  },
  {
    title: 'Get faster responses',
    body: 'Contractors reply directly to your request with quotes and availability.',
  },
  {
    title: 'No more follow-ups',
    body: 'Track responses in one place. Know who\'s replied and who hasn\'t.',
  },
  {
    title: 'Compare instantly',
    body: 'See all quotes side-by-side to make decisions quickly.',
  },
];

const makeFasterDecisions = [
  {
    title: 'See pricing side-by-side',
    body: 'Compare what each contractor is charging for the same work.',
  },
  {
    title: 'Review timelines together',
    body: 'Know how long the job takes from each contractor.',
  },
  {
    title: 'Understand scope differences',
    body: 'See what\'s included in each quote and negotiate from there.',
  },
  {
    title: 'Make smarter choices',
    body: 'Choose the best value, not just the lowest price.',
  },
];

const useCases = [
  {
    title: 'Managing 2–10 properties',
    body: 'Keep maintenance organized across your portfolio without complex software.',
  },
  {
    title: 'Self-managed landlords',
    body: 'Handle tenants and contractors without expensive property management platforms.',
  },
  {
    title: 'Property managers',
    body: 'Coordinate between owners, tenants, and contractors seamlessly.',
  },
  {
    title: 'Vacation rental owners',
    body: 'Manage turnover repairs and guest-reported issues quickly.',
  },
];

const benefits = [
  {
    title: 'Save hours every week',
    body: 'Stop juggling texts, emails, and spreadsheets. Everything is in one place.',
  },
  {
    title: 'Reduce maintenance costs',
    body: 'Compare quotes and negotiate with real data instead of guessing.',
  },
  {
    title: 'Respond faster to tenants',
    body: 'Fix issues quickly when everything is organized and visible.',
  },
  {
    title: 'Have proof and records when needed',
    body: 'Every repair, cost, and contractor is documented for your protection.',
  },
  {
    title: 'Scale without adding complexity',
    body: 'Handle more properties as your portfolio grows without chaos.',
  },
];

export default function LandlordMaintenanceSoftwarePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Maintenance Software Built for Landlords
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Maintenance OS helps landlords track repairs, manage contractors, and
            organize maintenance across all their properties — without expensive
            property management software or scattered conversations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Start managing maintenance
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Manage Across Properties */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage maintenance across properties
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              Every repair stays organized by property, contractor, and cost. See what's open,
              what's in progress, and what's completed across your entire portfolio in one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {manageAcrossProperties.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stop Chasing Contractors */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Stop chasing contractors
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              Send one request and receive multiple responses instead of texting contractors
              individually. Compare pricing and timelines in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stopChasingContractors.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Make Faster Decisions */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Make faster, smarter decisions
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              Compare contractor quotes, timelines, and scope side by side. Know exactly what
              you're paying and why.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {makeFasterDecisions.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Built for how landlords actually work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-2xl p-5 sm:p-6"
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

        {/* Resources */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Learn how to manage maintenance better
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/property-maintenance-software"
              className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Property Maintenance Software Hub</h3>
            </Link>
            <Link
              href="/track-rental-property-repairs"
              className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Track Rental Property Repairs</h3>
            </Link>
            <Link
              href="/compare-contractor-quotes"
              className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Compare Contractor Quotes</h3>
            </Link>
            <Link
              href="/guides/how-to-manage-rental-property-maintenance"
              className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">How to Manage Rental Property Maintenance</h3>
            </Link>
            <Link
              href="/how-it-works"
              className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">How It Works</h3>
            </Link>
            <Link
              href="/features"
              className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Features</h3>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start managing maintenance across your properties" subheading="Built for landlords managing 1 to 50+ rental units." />
        </section>
      </main>
    </PublicLayout>
  );
}
