import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'How to Track Rental Property Repairs | Simple System',
  description: 'Track every rental property repair from request to completion. Maintenance OS gives landlords one system for issues, contractors, quotes, and history.',
  alternates: {
    canonical: '/track-rental-property-repairs',
  },
};

const steps = [
  { num: '1', title: 'Capture issues', body: 'Tenants submit with photos and details in one place.' },
  { num: '2', title: 'Dispatch fast', body: 'Send to multiple contractors at once via SMS + email.' },
  { num: '3', title: 'Compare quotes', body: 'See pricing and timelines side by side.' },
  { num: '4', title: 'Track progress', body: 'Follow jobs from scheduled to completion.' },
  { num: '5', title: 'Store history', body: 'Searchable record with dates, costs, photos, invoices.' },
];

export default function TrackRentalPropertyRepairsPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-14 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track rental repairs without losing anything
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            One system for issues, contractors, quotes, and costs across all properties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
          </div>
          <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>
        </div>

        {/* Steps */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            The system in 5 steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.num} className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FreeCTA variant="dark" heading="Start tracking repairs today" subheading="Every repair, contractor, and cost — organized in one place." />
      </main>
    </PublicLayout>
  );
}
