import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'AI-Powered Property Maintenance — Photo Diagnosis, Smart Classification & Quote Comparison',
  description:
    'AI analyzes repair photos, classifies issues by trade and urgency, parses contractor quotes from SMS and email, detects recurring problems, compares bids, and extracts invoice data — automatically.',
  alternates: {
    canonical: '/features/ai-powered-maintenance',
  },
};

const aiFeatures = [
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
    title: 'AI repair diagnosis from photos',
    keyword: 'AI photo analysis for property maintenance',
    body: 'Upload a photo of a leak, crack, mold, or broken fixture. AI examines the image and describes exactly what it sees — the type of damage, severity, and location. That description goes straight to your contractors so they can quote accurately before showing up.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
    title: 'Automatic issue classification',
    keyword: 'AI property maintenance classification',
    body: 'Describe a problem in plain English — or let your tenant describe it. AI instantly classifies it by trade (plumbing, electrical, HVAC, roofing), sets urgency (emergency to low), recommends a repair timeframe, and suggests which type of contractor to call. No manual sorting.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: 'Multi-issue detection',
    keyword: 'AI split multiple maintenance requests',
    body: 'Tenants often report multiple problems in one message — "the toilet is leaking and the heat is broken." AI detects this, splits them into separate trackable issues, classifies each one independently, and even suggests which photos belong to which problem.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: 'Smart contractor reply parsing',
    keyword: 'AI parse contractor quotes from SMS and email',
    body: 'When a contractor texts back "$450, available Thursday" or sends a detailed email, AI reads the message and extracts the quote amount, availability, timeline, and any follow-up questions — structured and ready to compare. Works with messy real-world replies, not just perfect formatting.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
    title: 'Job confirmation parsing',
    keyword: 'AI contractor scheduling confirmation',
    body: 'After you select a contractor, they get notified. When they reply to confirm, reschedule, or decline, AI reads their response and updates the job status automatically. If they say "I can come Monday at 9am," the job gets scheduled — no manual data entry.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'AI quote comparison summary',
    keyword: 'AI compare contractor quotes',
    body: 'When you have two or more quotes, AI analyzes them side by side — price, availability, response speed — and writes a plain-English summary with a recommendation. No spreadsheets. No guesswork. Just a clear answer on who offers the best value.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: 'Invoice and receipt extraction',
    keyword: 'AI extract data from maintenance invoices',
    body: 'Upload a photo or PDF of an invoice, receipt, or bill. AI reads it and pulls out the total amount, vendor name, date, and description. One click applies the cost to the job record — no manual entry, no typos.',
  },
];

const bonusFeatures = [
  {
    title: 'Recurring issue detection',
    body: 'AI tracks patterns across your properties. If the same type of problem keeps happening — like the third plumbing issue at the same property this year — you get an alert suggesting a professional inspection to find the root cause.',
  },
  {
    title: 'Historical cost intelligence',
    body: 'When you receive a new quote, AI compares it against what you have historically paid for the same type of repair at the same property. If a quote is significantly above your typical range, you get a warning before you commit.',
  },
  {
    title: 'Smart contractor recommendations',
    body: 'AI scores each contractor based on trade match, response rate, past job history, and speed — then ranks them so you see the best fit first when dispatching a new repair.',
  },
];

export default function AIPoweredMaintenancePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            AI-Powered
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI that actually helps you
            <br className="hidden sm:block" />{' '}
            manage repairs.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Not a chatbot. Not a gimmick. Maintenance OS uses AI at every step
            of the repair process &mdash; from the moment a photo is uploaded to the
            moment an invoice is filed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>
          <div className="mt-3 flex justify-center gap-3 text-sm text-gray-500">
            <span>No credit card</span>
            <span aria-hidden="true">·</span>
            <span>Set up in 2 minutes</span>
            <span aria-hidden="true">·</span>
            <span>Works for 1 property or 100</span>
          </div>
        </div>

        {/* The problem */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Most maintenance tools just store data. This one thinks.
          </h2>
          <p className="text-gray-600 mb-4">
            Spreadsheets and basic apps make you do all the work &mdash;
            categorizing issues, reading contractor replies, comparing quotes
            manually, entering invoice data by hand. Maintenance OS automates
            the parts that slow you down.
          </p>
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-5 sm:p-6">
            <p className="text-gray-900 font-bold mb-2">
              7 AI features working behind the scenes
            </p>
            <p className="text-gray-600 text-sm">
              Every feature below runs automatically. No prompts. No setup. Just faster, smarter property maintenance.
            </p>
          </div>
        </section>

        {/* Core AI features */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            AI built into every step of the repair workflow
          </h2>
          <div className="space-y-4">
            {aiFeatures.map((feature) => (
              <div
                key={feature.title}
                className="border border-gray-200 rounded-xl p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-xs text-purple-600 font-medium mb-2">{feature.keyword}</p>
                    <p className="text-gray-600 text-sm">{feature.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mid CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 text-center mb-12 sm:mb-16">
          <p className="text-gray-900 font-bold mb-1">
            Upload a photo. AI tells you what&apos;s wrong.
          </p>
          <p className="text-gray-600 text-sm mb-4">See it in action — takes 30 seconds.</p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start Free
          </Link>
        </section>

        {/* Bonus AI intelligence */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            AI that gets smarter with your data
          </h2>
          <div className="space-y-4">
            {bonusFeatures.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-green-100 bg-green-50 p-4 sm:p-5"
              >
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it's different */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How this compares to doing it manually
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 pr-4 font-bold text-gray-900">Task</th>
                  <th className="py-3 px-4 font-bold text-gray-900">Without AI</th>
                  <th className="py-3 pl-4 font-bold text-purple-700">With Maintenance OS</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">Classify a repair</td>
                  <td className="py-3 px-4">Read description, decide category, set urgency</td>
                  <td className="py-3 pl-4 text-purple-700">Instant — AI classifies on submit</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">Read a contractor quote</td>
                  <td className="py-3 px-4">Open text/email, copy numbers into a spreadsheet</td>
                  <td className="py-3 pl-4 text-purple-700">Parsed automatically from SMS or email</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">Compare 3 quotes</td>
                  <td className="py-3 px-4">Scroll between messages, compare manually</td>
                  <td className="py-3 pl-4 text-purple-700">AI summary with recommendation</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">Log an invoice</td>
                  <td className="py-3 px-4">Read the PDF, type amounts into your system</td>
                  <td className="py-3 pl-4 text-purple-700">Upload — AI extracts and applies cost</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-gray-900">Spot a recurring problem</td>
                  <td className="py-3 px-4">Remember past issues, search records manually</td>
                  <td className="py-3 pl-4 text-purple-700">Automatic alert on 3rd similar issue</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related features */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Part of the full repair workflow
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/features/contractor-dispatch"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Contractor Dispatch</h3>
              <p className="text-gray-600 text-sm">
                Send repair requests via SMS and email.
              </p>
            </Link>
            <Link
              href="/features/quote-comparison"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Quote Comparison</h3>
              <p className="text-gray-600 text-sm">
                Compare contractor bids side by side.
              </p>
            </Link>
            <Link
              href="/features/repair-history"
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-1">Repair History</h3>
              <p className="text-gray-600 text-sm">
                Full timeline of every issue and job.
              </p>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <FreeCTA variant="dark" heading="Try AI-powered maintenance" subheading="Upload a photo and see it in action." />
        </section>
      </main>
    </PublicLayout>
  );
}
