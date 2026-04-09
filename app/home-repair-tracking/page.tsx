import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Home Repair Tracking App | Organize Maintenance Easily',
  description: 'Track home repairs and maintenance in one place. Compare contractor quotes, keep repair history, and never lose track of what was fixed.',
  alternates: {
    canonical: '/home-repair-tracking',
  },
};

const features = [
  {
    title: 'Never lose track of a repair',
    description: 'Every repair recorded with photos, cost, contractor info, and notes — searchable anytime.',
  },
  {
    title: 'Know who fixed what and when',
    description: 'Quick lookup of past repairs organized by date, contractor, and cost.',
  },
  {
    title: 'Compare contractor quotes',
    description: 'Side-by-side pricing to make smarter decisions before choosing.',
  },
  {
    title: 'Everything in one place',
    description: 'Complete maintenance record with photos, invoices, and contractor details.',
  },
  {
    title: 'Proof for home sales or claims',
    description: 'Organized repair history ready when you need documentation.',
  },
  {
    title: 'Works for 1 property or 100',
    description: 'Scale from a single home to managing multiple properties effortlessly.',
  },
];

export default function HomeRepairTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ───── HERO ───── */}
        <div className="mb-16 sm:mb-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Track Home Repairs in One Place
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Organize repairs, compare quotes, and keep a complete history of every job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors w-full sm:w-auto shadow-md"
            >
              Run your next repair through this — free
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            <span className="font-medium text-emerald-600">100% free during beta</span>
            {' • '}
            No credit card
            {' • '}
            Set up in 2 minutes
          </p>
        </div>

        {/* ───── FEATURES GRID ───── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h2>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* ───── FINAL CTA ───── */}
        <FreeCTA variant="dark" heading="Start tracking your home repairs" subheading="Everything you need to stay on top of home maintenance." />
      </main>
    </PublicLayout>
  );
}
