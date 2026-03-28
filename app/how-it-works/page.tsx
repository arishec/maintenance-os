import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'How Maintenance OS Works',
  description:
    'Learn the simple 5-step workflow: Report → Classify → Dispatch → Compare → Track. Manage all your maintenance coordination in one place.',
  alternates: {
    canonical: 'https://ifbids.com/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Maintenance OS Works
          </h1>
          <p className="text-xl text-gray-600">
            A simple 5-step workflow to keep your properties maintained
          </p>
        </div>

        {/* Step 1 */}
        <div className="mb-16">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                1
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Report</h2>
              <p className="text-gray-600 mb-4">
                You or your tenant reports a maintenance issue. This could be a leaky faucet, a broken window,
                a malfunctioning HVAC system, or any property problem that needs attention. Submit the issue
                through the Maintenance OS app or web portal with a description and optional photos.
              </p>
              <p className="text-gray-600">
                The system captures all the details you provide, creating a record of the problem for your
                property.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                2
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Classify</h2>
              <p className="text-gray-600 mb-4">
                The system automatically categorizes the maintenance request. Is it plumbing? Electrical?
                General repairs? Knowing the type helps you dispatch to the right contractors and prioritize
                your workload.
              </p>
              <p className="text-gray-600">
                You can also manually adjust the classification and set priority levels (urgent, standard,
                low priority) based on the severity of the issue.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                3
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Dispatch</h2>
              <p className="text-gray-600 mb-4">
                Once classified, dispatch the request to your contractors. Maintenance OS sends SMS or email
                notifications automatically to relevant contractors with the issue details and your property
                information.
              </p>
              <p className="text-gray-600 mb-4">
                Contractors can respond quickly using simple reply tokens. They either accept the job,
                decline it, or respond with a preliminary quote. This cuts down on phone tag and email chains.
              </p>
              <Link
                href="/features/contractor-dispatch"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about contractor dispatch →
              </Link>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mb-16">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                4
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Compare</h2>
              <p className="text-gray-600 mb-4">
                When you get responses back, Maintenance OS displays all contractor quotes and proposals side
                by side. Compare prices, timelines, and contractor details at a glance.
              </p>
              <p className="text-gray-600 mb-4">
                You can easily see who quoted what, and make an informed decision. Evaluate past performance
                and ratings alongside the quotes to choose the best contractor for the job.
              </p>
              <Link
                href="/features/quote-comparison"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about quote comparison →
              </Link>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="mb-16">
          <div className="flex gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                5
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Track</h2>
              <p className="text-gray-600 mb-4">
                Once a contractor is hired, track progress through to completion. Update status as work begins,
                progresses, and finishes. Keep all documentation—photos, invoices, completion notes—in one place.
              </p>
              <p className="text-gray-600 mb-4">
                Your complete repair history stays searchable and organized. Filter by property, date, issue
                type, or contractor. Use it for maintenance planning, insurance documentation, or resale
                disclosure.
              </p>
              <Link
                href="/features/repair-history"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more about repair history →
              </Link>
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-12 border border-green-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Matters</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Less Time on Coordination:</strong> No more chasing contractors by phone or email.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Better Decisions:</strong> Compare quotes side by side instead of juggling multiple
                conversations.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Complete Record:</strong> Keep a searchable history of all repairs for every property.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Tenant Satisfaction:</strong> Tenants can report issues easily and see progress.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <strong>Scale Easily:</strong> Manage one property or dozens with the same simple system.
              </span>
            </li>
          </ul>
        </div>

        {/* Who It's For */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Homeowners</h3>
            <p className="text-gray-600 mb-4">
              Keep all your home repair information organized. Track what's been done, when, and by whom.
              Compare contractor quotes easily without spreadsheets.
            </p>
            <Link
              href="/for-homeowners"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Landlords</h3>
            <p className="text-gray-600 mb-4">
              Manage maintenance across multiple properties. Collect tenant requests systematically. Maintain
              detailed repair records for each unit.
            </p>
            <Link
              href="/for-landlords"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn more →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Ready to streamline your maintenance?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Start with our free tier today. No credit card required.
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
