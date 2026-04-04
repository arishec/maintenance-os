import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

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
    description: 'Every repair is recorded with photos, cost, contractor info, and notes. No more digging through old texts or trying to remember when the roof was last patched.',
    icon: 'history',
  },
  {
    title: 'Know who fixed what — and when',
    description: 'Quickly look up past repairs instead of guessing. See the full timeline of work done on your home, organized by date, contractor, and cost.',
    icon: 'timeline',
  },
  {
    title: 'Make smarter decisions on contractors',
    description: 'Compare quotes and timelines before choosing a contractor. See side-by-side pricing so you\'re not just going with whoever answers first.',
    icon: 'compare',
  },
  {
    title: 'Everything in one place',
    description: 'Your home\'s complete maintenance record — accessible anytime. Photos, invoices, contractor details, costs, and notes all tied together.',
    icon: 'organize',
  },
];

export default function HomeRepairTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ───── HERO ───── */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Home Repairs and Maintenance in One Place
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Maintenance OS helps homeowners organize repairs, compare contractor quotes, and keep a complete history of every job done on their home — so you always know what was fixed, when, and by whom.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Start tracking your home repairs
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* ───── FEATURES ───── */}
        <div className="space-y-6 sm:space-y-8 mb-14 sm:mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* ───── INTERNAL LINKS SECTION ───── */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Learn more
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/property-maintenance-software"
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Property Maintenance Software</h3>
              <p className="text-gray-600 text-sm">Complete overview of maintenance management tools.</p>
            </Link>
            <Link
              href="/compare-contractor-quotes"
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Compare Contractor Quotes</h3>
              <p className="text-gray-600 text-sm">Make smarter decisions when choosing contractors.</p>
            </Link>
            <Link
              href="/guides/how-to-track-home-repairs"
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">How to Track Home Repairs</h3>
              <p className="text-gray-600 text-sm">Best practices for organizing your maintenance records.</p>
            </Link>
            <Link
              href="/features"
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Full Features</h3>
              <p className="text-gray-600 text-sm">Explore everything Maintenance OS can do.</p>
            </Link>
          </div>
        </section>

        {/* ───── BENEFITS ───── */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8 lg:p-10 mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why track repairs with Maintenance OS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">Never lose documentation</span>
                <p className="text-gray-600 text-sm mt-1">Keep receipts, photos, and contractor info forever.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">Make better contractor decisions</span>
                <p className="text-gray-600 text-sm mt-1">Compare quotes and timelines side-by-side.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">Proof for home sales or claims</span>
                <p className="text-gray-600 text-sm mt-1">Organized repair history when you need it.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
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
                <span className="font-bold text-gray-900">One dashboard, zero spreadsheets</span>
                <p className="text-gray-600 text-sm mt-1">Everything accessible in one place, anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───── FINAL CTA ───── */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Ready to organize your home repairs?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Start tracking today — free for one property. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start tracking your home repairs
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}
