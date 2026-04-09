import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: "Repair History -- Never Lose Track of What's Been Done",
  description:
    'Every repair, cost, and contractor in one searchable timeline. Perfect for resale, insurance claims, tenant disputes, and long-term planning.',
  alternates: {
    canonical: '/features/repair-history',
  },
};

export default function RepairHistoryPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Never Lose Track of What's Been Done</h1>
          <p className="text-base text-gray-600 mb-5">Every repair, cost, and contractor in one searchable timeline. Know what was done, when, and why.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm">Start Tracking Free</Link>
        </div>

        {/* PROBLEM */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">The Problem</h2>
          <p className="text-sm text-gray-700 mb-3">Did we fix the water heater? Cost? Who did it? Records scattered, lost, buried in emails.</p>
          <div className="text-xs text-gray-700 space-y-1 mb-4">
            <p><span className="font-bold">Selling:</span> You need proof of recent repairs.</p>
            <p><span className="font-bold">Insurance:</span> No documentation. You scramble.</p>
            <p><span className="font-bold">Dispute:</span> You can't prove what was done before.</p>
            <p><span className="font-bold">Planning:</span> You don't know what's due next.</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-1">The Solution</h3>
            <p className="text-gray-700 text-xs">A complete, searchable history. Nothing lost. Always findable.</p>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Everything in one place</p><p className="text-gray-600 text-xs">All repairs, costs, contractors, photos organized</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Find anything instantly</p><p className="text-gray-600 text-xs">Search by date, type, contractor, or cost</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Always have proof</p><p className="text-gray-600 text-xs">For buyers, insurance, disputes -- at your fingertips</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Plan better repairs</p><p className="text-gray-600 text-xs">See patterns. Know what to replace vs patch.</p></div>
          </div>
        </div>

        {/* REAL SCENARIOS */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Real Scenarios</h2>
          <div className="space-y-2 text-xs">
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Selling</p><p className="text-gray-600">Pull 5 years of repairs. Show proof. Build buyer trust.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Insurance</p><p className="text-gray-600">Full docs with dates, photos, contractors. No scrambling.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Dispute</p><p className="text-gray-600">Prove when repairs were made. Protect yourself.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Planning</p><p className="text-gray-600">HVAC repaired 3 times? Time to replace.</p></div>
          </div>
        </div>

        {/* IMPACT */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-2">The Impact</h2>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>Avoid costly surprises by knowing what's been done</li>
            <li>Increase property value with documented maintenance</li>
            <li>Protect yourself legally with proof</li>
            <li>Get peace of mind -- never wonder "did we fix that?"</li>
          </ul>
        </div>

        {/* INCLUDED */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Included</h2>
          <div className="grid grid-cols-2 gap-2 text-xs"><div className="bg-gray-50 rounded p-2"><p className="font-medium text-gray-900">Timeline</p></div><div className="bg-gray-50 rounded p-2"><p className="font-medium text-gray-900">Costs</p></div><div className="bg-gray-50 rounded p-2"><p className="font-medium text-gray-900">Contractors</p></div><div className="bg-gray-50 rounded p-2"><p className="font-medium text-gray-900">Photos</p></div></div>
        </div>

        {/* RELATED */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related</h2>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Link href="/features/tenant-intake" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Intake</p><p className="text-gray-600">Start from request</p></Link>
            <Link href="/features/job-tracking" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Tracking</p><p className="text-gray-600">Start to finish</p></Link>
            <Link href="/compare-contractor-quotes" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Quotes</p><p className="text-gray-600">Keep on record</p></Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Stop Losing Track</h2>
          <p className="text-gray-600 text-sm mb-3">Know your property inside and out -- without digging through emails.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">Start Free</Link>
        </div>
      </main>
    </PublicLayout>
  );
}
