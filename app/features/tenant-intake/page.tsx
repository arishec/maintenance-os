import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Tenant Intake — Stop Chasing Tenants for Maintenance Details',
  description:
    'Collect every maintenance request in one place with the exact information you need, upfront. No more texts, calls, or missing details.',
  alternates: {
    canonical: '/features/tenant-intake',
  },
};

export default function TenantIntakePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Stop Chasing Tenants for Details</h1>
          <p className="text-base text-gray-600 mb-5">Collect complete requests in one place — with photos, urgency, and unit info upfront.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm">Run your next repair through this — free</Link>
        </div>

        {/* PROBLEM & SOLUTION */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Mess</h2>
          <p className="text-gray-700 mb-4">Requests come in via texts, emails, calls — missing photos, wrong units, unclear urgency. You end up chasing tenants for details.</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-5 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">The Fix</h2>
            <p className="text-gray-700 text-sm">Tenants fill a simple form. Everything you need arrives organized and ready to act.</p>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Full details upfront</p><p className="text-gray-600 text-xs">Photos, unit, issue, urgency at once</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">One organized queue</p><p className="text-gray-600 text-xs">Single dashboard, no back-and-forth</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Tenants stop chasing</p><p className="text-gray-600 text-xs">They track progress in real time</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Dispatch faster</p><p className="text-gray-600 text-xs">Request to contractor in minutes</p></div>
          </div>
        </div>

        {/* HOW IT WORKS - CONDENSED */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4 Steps</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-bold">1.</span> You create a form</p>
            <p><span className="font-bold">2.</span> Share it with tenants</p>
            <p><span className="font-bold">3.</span> Requests come in structured</p>
            <p><span className="font-bold">4.</span> Review and dispatch instantly</p>
          </div>
        </div>

        {/* REAL EXAMPLE - COMPRESSED */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real Example</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2 mb-3">
            <div className="flex justify-between"><span className="font-bold">Property:</span> 123 Main St, Unit 2B</div>
            <div className="flex justify-between"><span className="font-bold">Issue:</span> Water leak under sink</div>
            <div className="flex justify-between"><span className="font-bold">Urgency:</span> Soon</div>
            <div className="flex justify-between"><span className="font-bold">Photos:</span> Attached</div>
          </div>
          <p className="text-gray-700 text-sm font-medium">Result: You dispatch immediately. Tenant gets notified. No calls needed.</p>
        </div>

        {/* WHY IT MATTERS */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Impact</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Save hours every week on clarification back-and-forth</li>
            <li>Fewer tenant calls and emails</li>
            <li>Better decisions with complete information</li>
            <li>Faster repairs, happier tenants</li>
          </ul>
        </div>

        {/* CUSTOMIZATION */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Flexible</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded p-3"><p className="font-medium text-gray-900">Assign properties</p></div>
            <div className="bg-gray-50 rounded p-3"><p className="font-medium text-gray-900">Set categories</p></div>
            <div className="bg-gray-50 rounded p-3"><p className="font-medium text-gray-900">Custom questions</p></div>
            <div className="bg-gray-50 rounded p-3"><p className="font-medium text-gray-900">Confirm messages</p></div>
          </div>
        </div>

        {/* RELATED */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related</h2>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Link href="/features/job-tracking" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Tracking</p><p className="text-gray-600">Dispatch to completion</p></Link>
            <Link href="/features/repair-history" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">History</p><p className="text-gray-600">Permanent record</p></Link>
            <Link href="/compare-contractor-quotes" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Quotes</p><p className="text-gray-600">Compare fast</p></Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Get Complete Requests</h2>
          <p className="text-gray-600 text-sm mb-3">Stop chasing details. Start managing.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">Run your next repair through this — free</Link>
        </div>
      </main>
    </PublicLayout>
  );
}
