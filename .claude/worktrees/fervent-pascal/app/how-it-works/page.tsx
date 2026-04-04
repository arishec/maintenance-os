import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

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
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Most landlords manage repairs across texts, calls, and emails. Requests get lost. Contractors don&apos;t respond. You forget what was fixed.
          </p>
          <p className="text-lg text-gray-700 font-medium mb-8 max-w-2xl mx-auto">
            Maintenance OS puts everything in one place — so you can manage repairs without chasing anyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get started free
            </Link>
            <Link
              href="/features"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              See features
            </Link>
          </div>
        </div>

        {/* ───── STEPS ───── */}
        <div className="space-y-16 mb-20">

          {/* Step 1 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                1
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Report the issue</h2>
              <p className="text-gray-600 mb-3">
                Start with the problem. Add a title, description, and photos if you have them.
              </p>
              <p className="text-gray-600 mb-3">
                Whether it&apos;s a leaking sink, broken AC, or roof issue, everything gets captured in one place so you have a clear record from the start.
              </p>
              <p className="text-gray-500 text-sm">
                No more scattered notes or trying to remember what happened later.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                2
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Turn messy requests into clear jobs</h2>
              <p className="text-gray-600 mb-3">
                Maintenance OS takes whatever the tenant sends — photos, text, details — and turns it into a structured repair request.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Categorized automatically</p>
                </div>
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Prioritized by urgency</p>
                </div>
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Routed to the right type of contractor</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                No guessing what&apos;s wrong or who to call.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                3
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Send one request. Reach every contractor.</h2>
              <p className="text-gray-600 mb-3">
                Instead of texting contractors one by one, send the job once and notify multiple contractors instantly.
              </p>
              <p className="text-gray-600 mb-3">They respond with:</p>
              <div className="space-y-2 mb-3">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Pricing</p>
                </div>
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Availability</p>
                </div>
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Questions</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                All tied to the same job — in one place. No chasing. No repeating yourself.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                4
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Compare everything side by side</h2>
              <p className="text-gray-600 mb-3">
                See all contractor responses in one view: price, timeline, and details.
              </p>
              <p className="text-gray-600 mb-3">
                No scrolling through messages or trying to remember who said what.
              </p>
              <p className="text-gray-700 font-medium">
                Pick the best option in minutes, not days.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white text-lg font-bold">
                5
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Never lose track of a repair again</h2>
              <p className="text-gray-600 mb-3">
                Every job is tracked from start to finish:
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">Who did the work</p>
                </div>
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">What it cost</p>
                </div>
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p className="text-gray-600">When it was completed</p>
                </div>
              </div>
              <p className="text-gray-700 font-medium">
                So you always have a complete history — for every property.
              </p>
            </div>
          </div>
        </div>

        {/* ───── WHY THIS WORKS ───── */}
        <section className="rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8 lg:p-10 mb-20">
          <p className="text-gray-800 text-lg font-medium mb-2">
            Most landlords don&apos;t have a system — they have conversations.
          </p>
          <p className="text-gray-600 mb-6">
            Texts, emails, calls. Maintenance OS turns all of that into a system.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Why this works better</h2>
          <div className="space-y-4">
            {[
              { title: 'Stop chasing contractors', desc: 'Send one request instead of following up across texts and emails.' },
              { title: 'Make faster decisions', desc: 'Compare quotes and availability in one place.' },
              { title: 'Stay organized', desc: 'Keep a complete repair history for every property.' },
              { title: 'Reduce back-and-forth', desc: 'Everything lives in one thread tied to the issue.' },
              { title: 'Works as you scale', desc: 'Use it for one home or multiple properties.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <div>
                  <span className="font-medium text-gray-900">{item.title}:</span>{' '}
                  <span className="text-gray-600">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───── FINAL CTA ───── */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-10 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Stop managing repairs the hard way
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-xl mx-auto">
            If you&apos;re texting contractors, waiting on replies, and trying to keep track of everything in your head — this fixes that.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get started free
            </Link>
            <Link
              href="/features"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              See how it works with your first repair
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required while we&apos;re in beta.
          </p>
        </div>
      </main>
    </PublicLayout>
  );
}
