import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Property Maintenance Tracking -- Never Lose Track of a Repair',
  description:
    'Track every maintenance issue, contractor, and update across your properties -- all in one place. Free forever.',
  alternates: {
    canonical: '/features/property-maintenance-tracking',
  },
};

const capabilities = [
  { title: 'Track issues from start to finish', body: 'Report problems instantly with photos, descriptions, and severity.' },
  { title: 'Real-time status tracking', body: 'See every issue move from reported to dispatched to completed.' },
  { title: 'Automatic categorization', body: 'Know exactly what contractor type you need.' },
  { title: 'Search everything', body: 'Find repairs by property, type, contractor, or date.' },
];

const benefits = [
  { title: 'Never lose an issue', body: 'Everything stays in one system.' },
  { title: 'Instant visibility', body: "See what's open, in progress, and done." },
  { title: 'Build repair history', body: 'Perfect for resale, insurance, and planning.' },
];

export default function PropertyMaintenanceTrackingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Never Lose Track of a Repair Again
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Track every maintenance issue, contractor, and update across your properties -- all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Run your next repair through this — free
            </Link>
            <Link
              href="#features"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">100% free during beta • No credit card • Set up in 2 minutes</p>
        </div>

        {/* The Problem */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Stop managing maintenance the hard way
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="font-bold text-gray-900 mb-3 text-sm">Without a system:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Digging through texts and emails</li>
                <li>• Guessing what's been done</li>
                <li>• Reacting instead of managing</li>
              </ul>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="font-bold text-gray-900 mb-3 text-sm">With Maintenance OS:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Everything in one system</li>
                <li>• Full visibility instantly</li>
                <li>• Proactive management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section id="features" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Everything you need to track maintenance
          </h2>
          <div className="space-y-3">
            {capabilities.map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Value Props */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {benefits.map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start tracking maintenance" subheading="Every repair, every property -- one system." />
        </section>
      </main>
    </PublicLayout>
  );
}
