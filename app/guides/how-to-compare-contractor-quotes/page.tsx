import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';

export const metadata: Metadata = {
  title: 'How to Compare Contractor Quotes (Without Getting Ripped Off)',
  description:
    'Learn how to evaluate contractor bids, spot red flags, and choose the best contractor for your repair based on price, timeline, and reliability.',
  alternates: {
    canonical: '/guides/how-to-compare-contractor-quotes',
  },
};

export default function HowToCompareContractorQuotesPage() {
  return (
    <PublicLayout>
      <ArticleJsonLd
        headline="How to Compare Contractor Quotes (Without Getting Ripped Off)"
        description="Learn how to evaluate contractor bids, spot red flags, and choose the best contractor for your repair based on price, timeline, and reliability."
        path="/guides/how-to-compare-contractor-quotes"
        datePublished="2026-03-27"
        dateModified="2026-03-30"
      />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HERO ───── */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Compare Contractor Quotes (Without Getting Ripped Off)
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get multiple bids, evaluate them strategically, and choose the contractor that delivers the best value — not just the lowest price.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Start Free With Maintenance OS
          </Link>
        </div>

        {/* ───── INTRO / PAIN ───── */}
        <div className="mb-16">
          <p className="text-gray-700 text-lg mb-4">
            Most people try to track quotes in texts, emails, or spreadsheets — and that&apos;s where mistakes happen.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Contractor pricing varies wildly. For the same roof repair, you might get quotes ranging from $2,000 to $4,000. The difference is massive — but the cheapest isn&apos;t always best.
          </p>
          <p className="text-gray-700 text-lg">
            This guide shows you exactly how to compare quotes, spot red flags, and make the right call every time.
          </p>
        </div>

        {/* ───── HOW MANY QUOTES ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Many Quotes Should You Get?</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Small repairs ($100–$500):</span> 1–2 quotes. Get one from a trusted contractor. For bigger spend, get a backup.</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Medium repairs ($500–$2,000):</span> 2–3 quotes. Start to see patterns in pricing.</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 flex-shrink-0 mt-2" />
              <p className="text-gray-700"><span className="font-bold">Large repairs ($2,000+):</span> 3–4 quotes. Comparison becomes critical at this price point.</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4">
            More than 4 quotes gives diminishing returns. You&apos;ll have enough data by then.
          </p>
        </div>

        {/* ───── THE SETUP ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Quotes: The Setup</h2>
          <p className="text-gray-700 mb-4">
            Before asking for quotes, make sure you&apos;re asking for the same thing from everyone. Be specific about the problem, include photos so contractors can give accurate estimates, clarify the scope (repair vs. replace), ask for timeline, and request details on materials and warranty.
          </p>
          <p className="text-gray-700">
            The more specific you are, the more comparable the quotes will be. Vague questions get vague answers.
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              This is exactly what Maintenance OS is built for — send one request to multiple contractors and get structured quotes back automatically.
            </p>
            <Link href="/features/contractor-dispatch" className="text-blue-600 font-medium hover:underline">
              See How Dispatch Works →
            </Link>
          </div>
        </div>

        {/* ───── WHAT TO LOOK FOR ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Look For in a Quote</h2>
          <div className="space-y-3">
            {[
              { label: 'Total cost', desc: 'Does it include materials, labor, and permits — or just labor?' },
              { label: 'Scope of work', desc: '"Fix roof leak" is different from "Install new shingles on 500 sq ft section."' },
              { label: 'Materials', desc: '"30-year asphalt shingles" is different from "architectural shingles."' },
              { label: 'Timeline', desc: 'When can they start? How long will it take?' },
              { label: 'Warranty', desc: 'How long? What does it cover? Parts only or parts + labor?' },
              { label: 'Payment terms', desc: 'How much upfront? When is final payment due?' },
              { label: 'Contractor info', desc: 'License number, insurance, references.' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <p className="text-gray-700"><span className="font-bold">{item.label}:</span> {item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── RED FLAGS ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Red Flags in Quotes</h2>
          <div className="space-y-3">
            {[
              { label: 'No written quote', desc: 'Legitimate contractors give written estimates. Verbal only is a red flag.' },
              { label: 'Extremely low price', desc: "If a quote is 30%+ lower than others, ask why. Lower price often means cutting corners." },
              { label: 'Vague scope', desc: '"Roof repair — $1,500" without details. What\'s actually being done?' },
              { label: 'No warranty mentioned', desc: "Licensed contractors typically warranty their work. No warranty is suspicious." },
              { label: 'Cash only, no receipt', desc: 'A legitimate business keeps records. Cash-only jobs often have quality or legal issues.' },
              { label: 'Pressure to decide now', desc: '"This price is only good for today" is a high-pressure tactic. Walk away.' },
              { label: 'No license or insurance', desc: "Ask for proof. Licensed and insured contractors have nothing to hide." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                <p className="text-gray-700"><span className="font-bold">{item.label}:</span> {item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── MID CTA ───── */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Stop comparing quotes in your head
          </h2>
          <p className="text-gray-600 mb-6 text-lg">See every quote side-by-side in one place.</p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>

        {/* ───── SAMPLE COMPARISON ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Comparison Table</h2>
          <p className="text-gray-700 mb-4">
            Here&apos;s how to organize quotes for easy comparison (example: kitchen faucet replacement):
          </p>
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-bold text-gray-900">Contractor</th>
                  <th className="text-left p-3 font-bold text-gray-900">Price</th>
                  <th className="text-left p-3 font-bold text-gray-900">Timeline</th>
                  <th className="text-left p-3 font-bold text-gray-900">Warranty</th>
                  <th className="text-left p-3 font-bold text-gray-900">Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 text-gray-700">Jones Plumbing</td>
                  <td className="p-3 text-gray-700">$450</td>
                  <td className="p-3 text-gray-700">Next week</td>
                  <td className="p-3 text-gray-700">1 year parts</td>
                  <td className="p-3 text-gray-700">4.8/5</td>
                </tr>
                <tr className="border-b border-gray-200 bg-red-50">
                  <td className="p-3 text-gray-700">Budget Plumbing</td>
                  <td className="p-3 text-gray-700">$250</td>
                  <td className="p-3 text-gray-700">2 weeks</td>
                  <td className="p-3 text-red-600 font-medium">None</td>
                  <td className="p-3 text-gray-700">3.2/5</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="p-3 text-gray-700 font-medium">Premium Home Services</td>
                  <td className="p-3 text-gray-700">$550</td>
                  <td className="p-3 text-gray-700">Same day</td>
                  <td className="p-3 text-green-700 font-medium">2 years parts + labor</td>
                  <td className="p-3 text-gray-700">4.9/5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            Budget Plumbing is cheapest but has no warranty and poor reviews. Premium costs more but offers same-day service and the best warranty. Jones is the balanced option.
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              Maintenance OS builds this comparison for you automatically — every quote in one view, side-by-side.
            </p>
            <Link href="/features/quote-comparison" className="text-blue-600 font-medium hover:underline">
              See Quote Comparison →
            </Link>
          </div>
        </div>

        {/* ───── COMPARING FAIRLY ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparing Prices Fairly</h2>
          <p className="text-gray-700 mb-4">
            Price matters, but you need to compare apples to apples. Make sure each quote covers the same scope of work. Check whether materials are included or just labor. Understand the material differences — budget shingles vs. premium architectural shingles. Factor in warranty length and coverage. And consider timeline — someone who can start next week is valuable if you need fast work.
          </p>
        </div>

        {/* ───── BEYOND PRICE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Beyond Price: Evaluating Contractors</h2>
          <p className="text-gray-700 mb-4">
            Check references — call people they&apos;ve worked for recently. Verify licensing through your state&apos;s contractor board. Read reviews on Google and the Better Business Bureau (look for patterns, not one-offs). Ask for proof of insurance. Pay attention to communication style — do they call back promptly and explain things clearly? And check experience — someone who does 20 roofs a year is more reliable than someone who does 2.
          </p>
        </div>

        {/* ───── MAKING YOUR DECISION ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Making Your Decision</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">1</span>
              <p className="text-gray-700">Eliminate obvious bad options — very cheap with no warranty or poor reviews</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">2</span>
              <p className="text-gray-700">Look for &ldquo;good value&rdquo; — solid quality at a fair price, not necessarily the cheapest</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">3</span>
              <p className="text-gray-700">Consider your priorities — need it fast? Pay more for availability. Can wait? Save money.</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">4</span>
              <p className="text-gray-700">Trust your gut — did the contractor seem professional and competent?</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">5</span>
              <p className="text-gray-700">Decide and commit — stop second-guessing and move forward</p>
            </div>
          </div>
        </div>

        {/* ───── COMMON MISTAKES ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes When Comparing Quotes</h2>
          <div className="space-y-3">
            {[
              { label: 'Only comparing prices', desc: "A $200 savings on a $2,000 job isn't worth it if you get poor quality" },
              { label: 'Getting too many quotes', desc: 'After 3–4, additional quotes just delay your decision' },
              { label: 'Not asking clarifying questions', desc: 'If a quote is unclear, ask for details before deciding' },
              { label: 'Ignoring references', desc: "A contractor who's done good work for others will do it for you" },
              { label: 'Negotiating down good contractors', desc: 'If someone quotes fairly and has good reviews, respect that' },
              { label: 'Hiring based on low price alone', desc: 'Often costs more to fix poor work than to pay more upfront' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                <p className="text-gray-700"><span className="font-bold">{item.label}:</span> {item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── AFTER YOU CHOOSE ───── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">After You Choose</h2>
          <p className="text-gray-700 mb-4">
            Get everything in writing — the quoted price, scope, timeline, and warranty in a signed agreement. Pay as agreed (25–50% deposit is normal, final payment on completion). Document the work with photos. Inspect before final payment. And keep warranty documents filed where you can find them.
          </p>

          {/* Micro conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
            <p className="text-gray-800 font-medium mb-2">
              Maintenance OS stores every quote, invoice, and contractor detail automatically — so you never lose track of what was agreed.
            </p>
            <Link href="/features/repair-history" className="text-blue-600 font-medium hover:underline">
              See Repair History →
            </Link>
          </div>
        </div>

        {/* ───── KEY CONVERSION BLOCK ───── */}
        <div className="bg-gray-900 text-white rounded-lg p-6 sm:p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">
            You shouldn&apos;t have to do all of this manually
          </h2>
          <p className="text-gray-300 mb-4">
            Requesting quotes, comparing prices, tracking contractors, saving invoices — it adds up fast.
          </p>
          <p className="text-gray-300 font-medium">
            Maintenance OS handles the entire flow: dispatch to contractors, compare quotes side-by-side, choose the best option, and keep everything on record.
          </p>
        </div>

        {/* ───── FINAL CTA ───── */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-10 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Compare quotes without the mess
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-xl mx-auto">
            Every quote, every contractor, every decision — organized and easy to compare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/features/quote-comparison"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              See Quote Comparison
            </Link>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
