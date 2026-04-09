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

const features = [
  {
    title: 'Organize by property & contractor',
    body: 'See what needs fixing and who\'s handling it across your portfolio.',
  },
  {
    title: 'Request quotes from multiple contractors',
    body: 'Send one request, get multiple responses, compare side-by-side.',
  },
  {
    title: 'Track costs in real time',
    body: 'Monitor spending across repairs and properties at a glance.',
  },
  {
    title: 'Complete repair history',
    body: 'Every repair, quote, and cost documented for your records.',
  },
  {
    title: 'Works for 1 property or 100',
    body: 'Scale without complexity as your portfolio grows.',
  },
  {
    title: 'Built for self-managed landlords',
    body: 'No expensive property management software required.',
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
            Track repairs, manage contractors, and organize maintenance across all your properties—without expensive software or scattered conversations.
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

        {/* Features Grid */}
        <section className="mb-14 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((item) => (
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

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start managing maintenance across your properties" subheading="Built for landlords managing 1 to 50+ rental units." />
        </section>
      </main>
    </PublicLayout>
  );
}
