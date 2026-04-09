import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: "Job Tracking -- Know What's Happening With Every Job",
  description:
    "No more chasing contractors. See what's scheduled, in progress, and completed across all your properties in real time.",
  alternates: {
    canonical: '/features/job-tracking',
  },
};

export default function JobTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Know What's Happening With Every Job</h1>
          <p className="text-base text-gray-600 mb-5">See scheduled, in progress, and completed work across all properties in real time. No more chasing contractors.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm">Start Tracking Free</Link>
        </div>

        {/* PROBLEM & SOLUTION */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">The Problem</h2>
          <p className="text-sm text-gray-700 mb-4">Jobs live in texts, emails, calls. You don't know if work started. Open jobs disappear. Nothing is in one place.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-1">The Solution</h3>
            <p className="text-gray-700 text-xs">One dashboard shows every job's status, timeline, and updates in real time.</p>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Every job's status</p><p className="text-gray-600 text-xs">Scheduled, in progress, completed across all properties</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Never lose track</p><p className="text-gray-600 text-xs">Jobs stay visible until done. Nothing disappears.</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">All updates together</p><p className="text-gray-600 text-xs">Photos, notes, progress tied to each job</p></div>
            <div className="border border-gray-200 rounded p-3"><p className="font-bold text-gray-900">Spot delays early</p><p className="text-gray-600 text-xs">See when jobs stall or deadlines slip</p></div>
          </div>
        </div>

        {/* DASHBOARD SNAPSHOT */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-3">At a Glance</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 text-xs">
            <div className="flex justify-between"><span className="font-bold">3 jobs</span><span className="text-gray-600">in progress</span></div>
            <div className="flex justify-between"><span className="font-bold">1 job</span><span className="text-gray-600">waiting on contractor</span></div>
            <div className="flex justify-between"><span className="font-bold">2 completed</span><span className="text-gray-600">this week</span></div>
            <div className="flex justify-between bg-red-50 p-2 rounded -mx-3 px-2"><span className="font-bold">1 overdue</span><span className="text-red-600 font-bold">5+ days</span></div>
          </div>
          <p className="text-gray-700 text-xs mt-2 font-medium">No texts. No calls. You already know what needs attention.</p>
        </div>

        {/* IMPACT */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-gray-900 mb-2">The Impact</h2>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>Avoid missed or forgotten work</li>
            <li>Save hours every week not chasing contractors</li>
            <li>Catch delays before they become problems</li>
            <li>Professional record for owners, tenants, resale</li>
          </ul>
        </div>

        {/* RELATED */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related</h2>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Link href="/features/tenant-intake" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Intake</p><p className="text-gray-600">Detailed requests</p></Link>
            <Link href="/features/repair-history" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">History</p><p className="text-gray-600">Track all repairs</p></Link>
            <Link href="/compare-contractor-quotes" className="border border-gray-200 rounded p-2 hover:shadow transition-shadow"><p className="font-bold text-gray-900">Quotes</p><p className="text-gray-600">Compare options</p></Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Stop Wondering</h2>
          <p className="text-gray-600 text-sm mb-3">See everything. Catch issues early. Stay in control.</p>
          <Link href="/sign-up" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm">Start Free</Link>
        </div>
      </main>
    </PublicLayout>
  );
}
