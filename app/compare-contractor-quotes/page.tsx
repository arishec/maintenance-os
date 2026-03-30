import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Compare Contractor Quotes Side by Side | Maintenance OS',
  description:
    'Stop comparing contractor quotes across texts, emails, and PDFs. Maintenance OS organizes every quote into one clean comparison view.',
  alternates: {
    canonical: '/compare-contractor-quotes',
  },
};

export default function CompareContractorQuotesPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-20 sm:py-24">
        {/* ───── HEADER ───── */}
        <div className="mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-950 mb-6">
            Compare Contractor Quotes Without the Mess
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl leading-relaxed">
            Comparing contractor quotes manually is messy — different formats, unclear pricing, inconsistent timelines. One contractor texts a number, another emails a PDF, a third gives a verbal estimate. Maintenance OS organizes everything into one clean comparison view so you can make smarter decisions faster.
          </p>
        </div>

        {/* ───── SECTION: Why Comparing is Hard ───── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-8">
            Why comparing quotes is so hard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Different formats</h3>
              <p className="text-slate-600">
                Texts, emails, PDFs, verbal estimates — nothing is in the same place
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Unclear what&apos;s included</h3>
              <p className="text-slate-600">
                Is labor included? Materials? Permits? You&apos;re left guessing at the scope
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Inconsistent timelines</h3>
              <p className="text-slate-600">
                One contractor says tomorrow, another says next week — hard to compare apples to apples
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">No single view</h3>
              <p className="text-slate-600">
                You&apos;re digging through messages trying to remember who quoted what and for how much
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Easy to lose information</h3>
              <p className="text-slate-600">
                Delete a text by accident, and you lose a quote. No record of what you decided and why
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Decision fatigue</h3>
              <p className="text-slate-600">
                You end up choosing whoever responds first, not who&apos;s actually the best option
              </p>
            </div>
          </div>
        </section>

        {/* ───── SECTION: How Maintenance OS Fixes This ───── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-8">
            How Maintenance OS fixes this
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Send one repair request to multiple contractors at once
                </h3>
                <p className="text-slate-600">
                  Describe the job once — with photos, location, urgency, and notes. Then select the contractors you want to reach and send it out with a single click.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Quotes come back into the same workflow
                </h3>
                <p className="text-slate-600">
                  As contractors reply via email, their quotes are automatically organized in one place. No more hunting through your inbox or texts.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  See pricing, timeline, scope, and notes side by side
                </h3>
                <p className="text-slate-600">
                  Compare what matters: price, availability, what&apos;s included, and contractor notes. Everything lines up so you can make a real comparison.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Choose the best option — not just the first one who responded
                </h3>
                <p className="text-slate-600">
                  Select the contractor that makes the most sense for your job, budget, and timeline. Accept their quote and move to scheduling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───── SECTION: Visual Example ───── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-8">
            See it in action
          </h2>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 bg-slate-100 px-6 py-4 font-semibold text-slate-900 text-sm">
              <div>Contractor</div>
              <div>Price</div>
              <div>Timeline</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-200">
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-4 px-6 py-5 items-center hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">Mike&apos;s Plumbing</p>
                  <p className="text-xs text-slate-500">Responds same-day</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">$180</p>
                </div>
                <div>
                  <p className="text-slate-700">Tomorrow</p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Accepted
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-4 px-6 py-5 items-center hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">QuickFix Pro</p>
                  <p className="text-xs text-slate-500">24h response time</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">$140</p>
                  <p className="text-xs text-slate-500">Cheapest option</p>
                </div>
                <div>
                  <p className="text-slate-700">3 days</p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    Accepted
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-4 px-6 py-5 items-center hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">Elite Plumbing</p>
                  <p className="text-xs text-slate-500">Premium service</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">$220</p>
                </div>
                <div>
                  <p className="text-slate-700">Next week</p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="px-6 py-4 bg-blue-50 border-t border-slate-200">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Notice:</span> All quotes visible at once with price, timeline, and contractor notes — no more context switching between emails and texts.
              </p>
            </div>
          </div>
        </section>

        {/* ───── SECTION: The Impact ───── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-8">
            Stop guessing. Start comparing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-3">💰</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Save money</h3>
              <p className="text-slate-700">
                When you compare quotes properly, you find better options and avoid overpaying for the first response.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
              <div className="text-3xl font-bold text-slate-600 mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Make faster decisions</h3>
              <p className="text-slate-700">
                With everything in one place, you spend less time searching and more time deciding what matters.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
              <div className="text-3xl font-bold text-slate-600 mb-3">📋</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Keep a record</h3>
              <p className="text-slate-700">
                Every quote is saved and tied to the job, so you always know what you chose and why.
              </p>
            </div>
          </div>
        </section>

        {/* ───── RELATED FEATURES ───── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold text-slate-950 mb-8">
            Works with every part of your workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/property-maintenance-software"
              className="group block bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-2">
                Maintenance OS hub →
              </h3>
              <p className="text-slate-600">
                See how quote comparison fits into the full repair management system.
              </p>
            </Link>

            <Link
              href="/track-rental-property-repairs"
              className="group block bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-2">
                Track repairs →
              </h3>
              <p className="text-slate-600">
                Once you choose a contractor, track the work from start to finish.
              </p>
            </Link>

            <Link
              href="/features/quote-comparison"
              className="group block bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-2">
                Quote comparison features →
              </h3>
              <p className="text-slate-600">
                Dive deep into how the comparison tool works and what you can do with it.
              </p>
            </Link>

            <Link
              href="/how-it-works"
              className="group block bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-2">
                How it works →
              </h3>
              <p className="text-slate-600">
                Learn the full intake-to-completion workflow at a glance.
              </p>
            </Link>
          </div>
        </section>

        {/* ───── CTA SECTION ───── */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center border border-blue-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Compare quotes in one system
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Stop chasing contractors across texts, emails, and PDFs. Get started free — no credit card, no limits.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
          >
            Get started free
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}
