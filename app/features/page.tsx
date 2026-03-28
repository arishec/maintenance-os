import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Features — Property Maintenance Made Simple',
  description:
    'Discover how Maintenance OS simplifies property maintenance with issue tracking, contractor dispatch, quote comparison, repair history, and tenant intake.',
  alternates: {
    canonical: 'https://ifbids.com/features',
  },
};

export default function FeaturesPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Features
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to manage property maintenance efficiently
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Feature 1 */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Property Maintenance Tracking
            </h2>
            <p className="text-gray-600 mb-4">
              Track every maintenance issue per property. Report problems, classify them by type,
              and monitor progress from initial report through completion.
            </p>
            <Link
              href="/features/property-maintenance-tracking"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Contractor Dispatch
            </h2>
            <p className="text-gray-600 mb-4">
              Automatically dispatch maintenance requests to contractors via SMS and email. Get
              responses quickly with simple reply tokens for accepting or declining jobs.
            </p>
            <Link
              href="/features/contractor-dispatch"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Quote Comparison
            </h2>
            <p className="text-gray-600 mb-4">
              Compare contractor quotes side by side. Review all estimates for the same job,
              compare prices and timelines, then accept the best option.
            </p>
            <Link
              href="/features/quote-comparison"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Repair History
            </h2>
            <p className="text-gray-600 mb-4">
              Keep a complete timeline of every repair and maintenance work. Search by date,
              property, or issue type. Never lose track of what was done and when.
            </p>
            <Link
              href="/features/repair-history"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Tenant Intake Forms
            </h2>
            <p className="text-gray-600 mb-4">
              Provide tenants with simple maintenance request forms. Collect details about issues
              and schedule requests in a standardized way.
            </p>
            <Link
              href="/features/tenant-intake"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              SMS & Email Integration
            </h2>
            <p className="text-gray-600 mb-4">
              Communicate with contractors and tenants through their preferred channels. SMS and
              email keep everyone in the loop without switching platforms.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Ready to simplify maintenance?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Start managing your properties more efficiently today.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
