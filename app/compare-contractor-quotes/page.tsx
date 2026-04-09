import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Compare Contractor Quotes Side by Side',
  description:
    'Stop comparing contractor quotes across texts, emails, and PDFs. Maintenance OS organizes every quote into one clean comparison view.',
  alternates: {
    canonical: '/compare-contractor-quotes',
  },
};

export default function CompareContractorQuotesPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Compare Quotes Without the Mess</h1>
          <p className="text-base text-gray-600 mb-5">One contractor texts a number. Another emails a PDF. A third gives a verbal estimate. Maintenance OS puts them all in one comparison view.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm">Run your next repair through this — free</Link>
        </div>

        {/* THE PROBLEM */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Why It's Hard</h2>
          <div className="text-xs text-gray-700 space-y-1">
            <p><span className="font-bold">Formats:</span> Texts, emails, PDFs, verbal — nothing in same place</p>
            <p><span className="font-bold">Scope:</span> Is labor included? Materials? Permits? Guessing.</p>
            <p><span className="font-bold">Timelines:</span> One says tomorrow, another next week. Can't compare.</p>
            <p><span className="font-bold">No single view:</span> Dig through messages trying to remember who quoted what</p>
            <p><span className="font-bold">Easy to lose:</span> Delete a text and quote is gone. No record.</p>
            <p><span className="font-bold">Decision fatigue:</span> Pick whoever responds first, not who's best</p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">The Fix (4 Steps)</h2>
          <div className="space-y-2 text-xs">
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">1. Send one request to multiple contractors</p><p className="text-gray-600">Describe job once with photos, location, urgency. Click send.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">2. Quotes arrive in one place</p><p className="text-gray-600">Replies auto-organize. No hunting through texts.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">3. See them side by side</p><p className="text-gray-600">Price, timeline, scope, notes line up for comparison.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">4. Choose the best option</p><p className="text-gray-600">Pick the contractor that makes sense. Accept and schedule.</p></div>
          </div>
        </div>

        {/* EXAMPLE TABLE */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What It Looks Like</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-3 gap-2 bg-gray-100 p-2 font-bold text-gray-900"><div>Contractor</div><div>Price</div><div>Timeline</div></div>
            <div className="divide-y divide-gray-200">
              <div className="grid grid-cols-3 gap-2 p-2"><div><p className="font-bold text-gray-900">Mike's Plumbing</p><p className="text-gray-500 text-xs">Same-day</p></div><div><p className="font-bold">$180</p></div><div><p className="text-gray-700">Tomorrow</p></div></div>
              <div className="grid grid-cols-3 gap-2 p-2"><div><p className="font-bold text-gray-900">QuickFix Pro</p><p className="text-gray-500 text-xs">24h</p></div><div><p className="font-bold">$140</p><p className="text-gray-600 text-xs">Cheapest</p></div><div><p className="text-gray-700">3 days</p></div></div>
              <div className="grid grid-cols-3 gap-2 p-2"><div><p className="font-bold text-gray-900">Elite Plumbing</p><p className="text-gray-500 text-xs">Premium</p></div><div><p className="font-bold">$220</p></div><div><p className="text-gray-700">Next week</p></div></div>
            </div>
          </div>
          <p className="text-gray-700 text-xs mt-2 font-medium">All visible at once — price, timeline, notes. No switching.</p>
        </div>

        {/* WHY IT MATTERS */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">The Impact</h2>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="border border-gray-200 rounded p-3"><p className="text-xl font-bold text-blue-600">💰</p><p className="font-bold text-gray-900">Save money</p><p className="text-gray-600">Proper comparison finds better options</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="text-xl font-bold text-blue-600">⚡</p><p className="font-bold text-gray-900">Faster</p><p className="text-gray-600">Everything in one place</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="text-xl font-bold text-blue-600">📋</p><p className="font-bold text-gray-900">Keep record</p><p className="text-gray-600">Every quote saved and tied to job</p></div>
          </div>
        </div>

        {/* RELATED */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Works With</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link href="/features/tenant-intake" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Intake</p><p className="text-gray-600">Get detailed requests</p></Link>
            <Link href="/features/job-tracking" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Tracking</p><p className="text-gray-600">Track work start to finish</p></Link>
            <Link href="/features/repair-history" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">History</p><p className="text-gray-600">Keep costs on record</p></Link>
            <Link href="/property-maintenance-software" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Platform</p><p className="text-gray-600">See full workflow</p></Link>
          </div>
        </div>

        {/* FINAL CTA - FreeCTA COMPONENT */}
        <FreeCTA variant="dark" heading="Compare quotes the smart way" subheading="Send one request, get multiple quotes, pick the best." />
      </main>
    </PublicLayout>
  );
}
