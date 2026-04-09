import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Property Maintenance Software for Landlords & Homeowners',
  description:
    'Track repairs, compare contractor quotes, and manage property maintenance in one system. Built for landlords and homeowners managing 1–50+ properties.',
  alternates: {
    canonical: '/property-maintenance-software',
  },
};

const capabilities = [
  {
    title: 'Track every repair request in one place',
    body: 'No more scattered texts, calls, or forgotten emails.',
  },
  {
    title: 'Send jobs to multiple contractors at once',
    body: 'Dispatch repair requests via SMS or email instantly.',
  },
  {
    title: 'Compare pricing and timelines side by side',
    body: 'See quotes from different contractors and make better decisions.',
  },
  {
    title: 'Track job progress from start to finish',
    body: 'Know exactly what\'s in progress, completed, or pending.',
  },
  {
    title: 'Keep a permanent repair history',
    body: 'Every repair, cost, contractor, and date is recorded and searchable.',
  },
  {
    title: 'Manage multiple properties',
    body: 'Works for 1 property or 100+ without changing approach.',
  },
];

const useCases = [
  {
    title: 'Landlords managing rental properties',
    body: 'Collect tenant requests, dispatch to contractors, track costs.',
  },
  {
    title: 'Homeowners tracking home repairs',
    body: 'Keep a complete history from estimates to invoices.',
  },
  {
    title: 'Property managers coordinating across buildings',
    body: 'Manage repairs across multiple properties without duplicated work.',
  },
];

export default function PropertyMaintenanceSoftwarePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Property Maintenance Software That Actually
            <br className="hidden sm:block" /> Keeps Repairs Organized
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Track repairs, manage contractors, and maintain a complete history of every job — without spreadsheets or guesswork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition w-full sm:w-auto"
            >
              Run your next repair through this — free
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-2xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>

          {/* Static AI Analysis Card */}
          <div className="mt-10 mx-auto max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden text-left">
              <div className="border-b border-slate-100 p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center text-2xl">
                  💧
                </div>
                <div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Repair issue + photo</div>
                  <p className="text-sm text-slate-800">Water stain on ceiling, spreading fast — about 2 feet wide now</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">AI Analysis Complete — photo + text</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Category</div>
                    <div className="text-xs font-semibold text-slate-800">Water Damage</div>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2.5">
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Urgency</div>
                    <div className="text-xs font-bold text-red-600">High</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Trade</div>
                    <div className="text-xs font-semibold text-slate-800">Plumbing</div>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">AI Assessment</div>
                  <p className="text-xs text-slate-600 leading-relaxed">Photo shows active water damage on ceiling drywall with brownish staining. Pattern indicates a slow leak — likely a supply line or roof penetration. Immediate inspection recommended.</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">AI analyzes photos and text to classify every repair automatically</p>
          </div>

          <div className="mt-3 flex justify-center gap-3 text-sm text-gray-500">
            <span>No credit card</span>
            <span aria-hidden="true">·</span>
            <span>Set up in 2 minutes</span>
            <span aria-hidden="true">·</span>
            <span>Works for 1 property or 100</span>
          </div>
        </div>

        {/* What You Can Do */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            What you can do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Who it's for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-xl p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <FreeCTA />
      </main>
    </PublicLayout>
  );
}
