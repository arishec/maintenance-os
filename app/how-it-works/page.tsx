import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'How It Works — Property Maintenance Management Made Simple',
  description:
    'Report a repair, dispatch to contractors, compare quotes, and track the job to completion — all in one place. See how Maintenance OS works step by step.',
  alternates: {
    canonical: '/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HERO ───── */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Manage repairs without chasing contractors
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop juggling texts, calls, and emails. Put everything in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-7 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md"
            >
              Run your next repair through this — free
            </Link>
            <Link
              href="/features"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              See features
            </Link>
          </div>
          <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>
        </div>

        {/* ───── 4-STEP FLOW ───── */}
        <div className="space-y-12 mb-20">

          {/* Step 1: Report */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                1
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Report the issue</h2>
              <p className="text-gray-600">
                Add title, description, and photos. Everything captured in one place.
              </p>
            </div>
          </div>

          {/* Step 2: Dispatch */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                2
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dispatch to contractors</h2>
              <p className="text-gray-600">
                Send one request to multiple contractors. They respond with pricing, availability, and questions.
              </p>
            </div>
          </div>

          {/* Step 3: Compare */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                3
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare side by side</h2>
              <p className="text-gray-600">
                See all quotes, timelines, and details in one view. Pick the best option in minutes.
              </p>
            </div>
          </div>

          {/* Step 4: Track */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                4
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Track to completion</h2>
              <p className="text-gray-600">
                Keep a complete history: who did the work, what it cost, and when it was finished.
              </p>
            </div>
          </div>

        </div>

        {/* ───── FINAL CTA ───── */}
        <FreeCTA variant="dark" heading="Ready to try it?" subheading="Set up your first property in under 2 minutes." />
      </main>
    </PublicLayout>
  );
}
