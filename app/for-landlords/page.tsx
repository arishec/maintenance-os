import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Property Maintenance Software for Landlords',
  description:
    'Manage repairs, collect requests, compare quotes, and track every job across all your properties — in one place.',
  alternates: {
    canonical: '/for-landlords',
  },
};

const features = [
  { title: 'Tenant intake', body: 'Collect requests with photos and details.' },
  { title: 'Instant dispatch', body: 'Send to multiple contractors via SMS + email.' },
  { title: 'Quote comparison', body: 'See pricing and timelines side by side.' },
  { title: 'Multi-property dashboard', body: 'Track every property in one view.' },
  { title: 'Complete history', body: 'Every repair, cost, and contractor recorded.' },
  { title: 'AI classification', body: 'Auto-categorize urgency and trade type.' },
];

export default function ForLandlordsPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop chasing tenants and contractors
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            One dashboard for repairs, requests, quotes, and costs across all your properties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-2xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>
        </div>

        {/* Features */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <FreeCTA variant="dark" heading="Simplify maintenance. Scale faster." subheading="One system for intake, dispatch, quotes, tracking, and history." />
      </main>
    </PublicLayout>
  );
}
