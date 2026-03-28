import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Tenant Maintenance Intake',
  description:
    'Provide tenants with simple forms to request maintenance. Collect details systematically and organize requests by property.',
  alternates: {
    canonical: 'https://ifbids.com/features/tenant-intake',
  },
};

export default function TenantIntakePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tenant Maintenance Intake
          </h1>
          <p className="text-xl text-gray-600">
            Give tenants a simple way to report maintenance issues. Collect details systematically and respond
            faster.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge With Tenant Requests</h2>

          <div className="space-y-3">
            <p className="text-gray-700">
              Your tenants call, text, email, leave voicemails. One tenant reports a leaky faucet on Monday.
              Another calls about a broken lock on Wednesday. You're juggling messages across multiple channels.
            </p>
            <p className="text-gray-700">
              When you finally get around to it, you realize the tenant didn't specify which bathroom or provide
              photos. Was it urgent or cosmetic?
            </p>
            <p className="text-gray-700">
              You need a way to collect maintenance requests that's consistent, organized, and gives you the
              details you need upfront.
            </p>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Tenant Intake Forms Solve This</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Simple Web Forms</h3>
              <p className="text-gray-600">
                Give your tenants a link to a form. No login required. They describe the issue, provide photos
                if needed, and submit. Simple and intuitive.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Consistent Information</h3>
              <p className="text-gray-600">
                Every request captures the same information: property, unit, issue type, description, contact
                info, urgency. No missing details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Organized Queue</h3>
              <p className="text-gray-600">
                All maintenance requests appear in your dashboard. Filter by property, unit, or date. Prioritize
                urgent issues.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Automatic Confirmation</h3>
              <p className="text-gray-600">
                Tenant submits a request. They immediately get a confirmation with their submission number and
                expected timeline. They know you got it.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Track Progress for Tenants</h3>
              <p className="text-gray-600">
                Tenants can check the status of their requests. "In Progress," "Dispatched to Contractor,"
                "Completed." Transparency reduces complaints.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">✓ Reduce Calls and Emails</h3>
              <p className="text-gray-600">
                When maintenance is systematic and tracked, tenants stop calling to ask "Did you see my request?"
                They know it's in the system and being handled.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How the Intake Process Works</h2>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">For Landlords/Managers</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Create a maintenance intake form in Maintenance OS</li>
                <li>Customize it with your properties, units, and issue categories</li>
                <li>Share the form link with tenants (via email, lease, website, etc.)</li>
                <li>Requests appear in your dashboard automatically</li>
                <li>Review, prioritize, and dispatch to contractors</li>
              </ol>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">For Tenants</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click the maintenance request link</li>
                <li>Select their unit and the issue type</li>
                <li>Describe the problem and upload photos if needed</li>
                <li>Submit the form</li>
                <li>Get a confirmation email with status and timeline</li>
                <li>Can check status anytime without contacting you</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Form Customization */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customize Your Form</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Properties & Units</h3>
              <p className="text-gray-600 text-sm mb-4">
                List all your properties and units. Tenants select theirs so you know exactly where the issue is.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Issue Categories</h3>
              <p className="text-gray-600 text-sm mb-4">
                Plumbing, Electrical, Heating/Cooling, General Repairs, etc. Pre-set categories or add your own.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Custom Fields</h3>
              <p className="text-gray-600 text-sm mb-4">
                Add questions specific to your properties. "When is the issue most noticeable?" or "Any water
                damage visible?"
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Response Template</h3>
              <p className="text-gray-600 text-sm mb-4">
                Customize the confirmation message. Let tenants know your typical response time and next steps.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits for Landlords</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl">😌</span>
              <div>
                <h3 className="font-bold text-gray-900">Fewer direct complaints</h3>
                <p className="text-gray-600">
                  Tenants use the form instead of calling. One organized queue instead of random calls.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">⏱️</span>
              <div>
                <h3 className="font-bold text-gray-900">Better information upfront</h3>
                <p className="text-gray-600">
                  Photos, descriptions, and context. You can triage and prioritize without back-and-forth.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-bold text-gray-900">Legal protection</h3>
                <p className="text-gray-600">
                  Dated records of all tenant-reported issues. Protect yourself in disputes about pre-existing
                  conditions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl">😊</span>
              <div>
                <h3 className="font-bold text-gray-900">Happier tenants</h3>
                <p className="text-gray-600">
                  Transparent process. They see their requests are being tracked and handled. Reduces resentment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Request */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Example: Bathroom Leak</h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">Tenant submits form:</p>
              <div className="bg-white rounded border border-gray-300 p-4 text-sm">
                <div className="mb-3">
                  <strong>Property:</strong> 123 Main Street, Unit 2B
                </div>
                <div className="mb-3">
                  <strong>Issue Type:</strong> Plumbing
                </div>
                <div className="mb-3">
                  <strong>Description:</strong> Water dripping from under the sink. Wet spot on cabinet floor.
                </div>
                <div className="mb-3">
                  <strong>Urgency:</strong> Standard (not emergency, but needs attention soon)
                </div>
                <div>
                  <strong>Photos:</strong> 2 images attached
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
              <p className="text-sm text-gray-500 mb-2">You receive notification:</p>
              <p className="text-gray-700">
                New maintenance request from Unit 2B at 123 Main Street. Plumbing issue. Under the sink. Photos
                attached. Status: New. Action: Review and dispatch.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-green-50">
              <p className="text-sm text-gray-500 mb-2">You review and dispatch:</p>
              <p className="text-gray-700">
                You see the photos. It's a leak under the sink. Dispatch to your plumber with one click. Tenant
                gets notified that a contractor has been dispatched.
              </p>
            </div>
          </div>
        </div>

        {/* Related Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Works Well With</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">
                Receive tenant intake forms, then dispatch to contractors immediately
              </p>
            </Link>

            <Link
              href="/guides/how-to-manage-rental-property-maintenance"
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">Guide: Landlord Maintenance</h3>
              <p className="text-gray-600 text-sm">
                Best practices for collecting and managing tenant maintenance requests
              </p>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Give your tenants an easy way to report maintenance
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Simple forms. Organized requests. Happier tenants.
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
