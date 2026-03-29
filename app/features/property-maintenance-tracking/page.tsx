import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Property Maintenance Tracking',
  description:
    'Track every maintenance issue per property. Report problems, classify them by type, and monitor progress from initial report through completion.',
  alternates: {
    canonical: '/features/property-maintenance-tracking',
  },
};

export default function PropertyMaintenanceTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Property Maintenance Tracking
          </h1>
          <p className="text-xl text-gray-600">
            Keep every maintenance issue organized by property. Report, classify, and track repairs from start
            to finish.
          </p>
        </div>

        {/* What It Does */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What You Can Do</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Report Issues Anywhere, Anytime</h3>
              <p className="text-gray-600">
                Spot a broken window? Water damage? Hvac problem? Report it directly in the app with a description,
                photos, and severity level. Or have tenants submit requests via simple web forms.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Automatic Categorization</h3>
              <p className="text-gray-600">
                Maintenance OS automatically categorizes issues by type: Plumbing, Electrical, HVAC, Structural,
                General Repairs, etc. Quickly identify what needs attention and what type of contractor you need.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Set Priority Levels</h3>
              <p className="text-gray-600">
                Mark issues as Urgent (safety concern, immediate action needed), Standard (normal repair), or
                Low Priority (cosmetic, can wait). Prioritize your workload.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Status in Real Time</h3>
              <p className="text-gray-600">
                Update status as issues progress: Reported → Quote Pending → Dispatched → In Progress →
                Completed. Everyone knows where things stand.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Attach Notes and Documentation</h3>
              <p className="text-gray-600">
                Add notes at any stage. Attach photos, contractor quotes, invoices, and completion reports. Keep
                everything in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 sm:p-8 lg:p-12 border border-green-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Property Tracking Matters</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl">🏠</span>
              <div>
                <h3 className="font-bold text-gray-900">Organize by property</h3>
                <p className="text-gray-600">
                  Each property has its own dashboard. You can see at a glance which properties have open issues
                  and what needs attention.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-bold text-gray-900">Never forget an issue</h3>
                <p className="text-gray-600">
                  Report it once and it stays in the system. No more lost sticky notes, forgotten voice mails, or
                  lost text conversations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="font-bold text-gray-900">Filter and search easily</h3>
                <p className="text-gray-600">
                  Need all plumbing issues across your properties? Search by category. All urgent repairs? Filter
                  by priority.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-bold text-gray-900">Build a maintenance history</h3>
                <p className="text-gray-600">
                  Over time, you'll have a complete record of what was done at each property. Perfect for
                  insurance, resale, or future planning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Who Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Who Benefits Most</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Homeowners</h3>
              <p className="text-gray-600 text-sm">
                Track repairs on your home. Know what's been done, when, and by whom. Perfect for resale or
                insurance claims.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Landlords</h3>
              <p className="text-gray-600 text-sm">
                Manage maintenance across multiple properties. Collect tenant requests in one place. Keep legal
                records.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Property Managers</h3>
              <p className="text-gray-600 text-sm">
                Coordinate maintenance for multiple owners. Track every issue and completion. Report to owners with
                confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Related Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm mb-4">
                Once you've reported an issue, dispatch it to contractors via SMS and email.
              </p>
              <span className="text-blue-600 hover:text-blue-700 text-sm">Learn more →</span>
            </Link>

            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Repair History</h3>
              <p className="text-gray-600 text-sm mb-4">
                All tracked issues become part of your searchable repair history timeline.
              </p>
              <span className="text-blue-600 hover:text-blue-700 text-sm">Learn more →</span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 lg:p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Start tracking your property maintenance today
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Free forever. No credit card required.
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
