import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SoftwareJsonLd } from '@/components/seo/software-jsonld';
import { PublicLayout } from '@/components/public-layout';
import { AIDemoHero } from '@/components/ai-demo-hero';

export const metadata: Metadata = {
  title: 'Maintenance OS — Manage Repairs Without Chasing Contractors',
  description:
    'Turn messy texts, calls, and scattered quotes into one clear system — intake, dispatch, compare, track, and history.',
  alternates: {
    canonical: '/',
  },
};

const steps = [
  {
    num: '01',
    title: 'Intake',
    subtitle: 'Capture every issue in one place',
    body: 'Tenants or homeowners submit a repair once with photos, details, and urgency. AI analyzes every photo to identify the problem, then uses that to classify the issue and recommend the right trade.',
    bullets: ['AI photo analysis', 'Smart classification', 'Right trade recommended'],
  },
  {
    num: '02',
    title: 'Dispatch',
    subtitle: 'Send once — reach multiple contractors',
    body: 'Instead of texting contractors one by one, send the job once and collect replies in the same workflow.',
    bullets: ['One request out', 'Multiple contractors notified', 'Replies tied to one job'],
    callout: 'One request out. Multiple responses back.',
  },
  {
    num: '03',
    title: 'Compare',
    subtitle: 'See pricing and timing side by side',
    body: 'Compare quotes, timelines, and notes in one place so you can make a decision quickly and confidently.',
    bullets: ['Price', 'Timeline', 'Scope notes'],
  },
  {
    num: '04',
    title: 'Track',
    subtitle: 'Know what is happening right now',
    body: 'Once a contractor is selected, track progress from scheduled to completed without chasing updates.',
    bullets: ['Scheduled', 'In progress', 'Completed'],
  },
  {
    num: '05',
    title: 'History',
    subtitle: 'Never lose track again',
    body: 'Every repair becomes part of a searchable history with dates, costs, contractors, and notes.',
    bullets: ['Repair history', 'Costs', 'Documentation'],
  },
];

const painPoints = [
  'Tenant texts you at 9 pm about a leak',
  'You chase three contractors across texts and email',
  'Six months later you can\u2019t remember who fixed it',
];

const benefits = [
  {
    title: 'Stop chasing contractors',
    desc: 'Send one request instead of following up across calls, texts, and emails.',
  },
  {
    title: 'Make faster decisions',
    desc: 'Compare pricing, timelines, and notes without digging through messages.',
  },
  {
    title: 'Keep every repair organized',
    desc: 'Every issue stays tied to the property, contractor, costs, and final outcome.',
  },
  {
    title: 'Works for one property or many',
    desc: 'The same workflow works whether you are managing your home or a growing portfolio.',
  },
];

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;
  const ctaHref = isSignedIn ? '/dashboard' : '/sign-up';
  const ctaLabel = isSignedIn ? 'Go to dashboard' : 'Start free — no credit card';

  return (
    <>
      <SoftwareJsonLd />
      <PublicLayout>
        <main>
          {/* ───── HERO WITH AI DEMO ───── */}
          <section className="mx-auto max-w-7xl px-6 pt-10 pb-6 lg:px-10 lg:pt-14 lg:pb-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 md:leading-[1.08]">
                Upload a photo. AI diagnoses the repair <br className="hidden sm:block" />before the contractor arrives.
              </h1>
              <p className="mt-4 text-lg leading-7 text-slate-600 max-w-2xl mx-auto">
                Snap a photo or describe the issue. AI analyzes the image, classifies urgency, recommends the right trade, and dispatches to contractors — all in one click.
              </p>
            </div>

            {/* Live AI Demo */}
            <AIDemoHero />

            {/* CTA below demo */}
            <div className="mt-10 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={ctaHref}
                  className="rounded-2xl bg-blue-600 px-7 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg w-full sm:w-auto text-center"
                >
                  {ctaLabel}
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 w-full sm:w-auto text-center"
                >
                  See how it works
                </Link>
              </div>
              <p className="mt-5 text-base font-medium text-emerald-600">100% free during beta — all features included</p>
              <div className="mt-3 flex justify-center gap-3 text-sm text-slate-500">
                <span>No credit card</span>
                <span aria-hidden="true">·</span>
                <span>Set up in 2 minutes</span>
                <span aria-hidden="true">·</span>
                <span>Works for 1 property or 100</span>
              </div>
              <div className="mt-6 flex justify-center">
                <a href="https://www.producthunt.com/products/maintenance-os?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-maintenance-os" target="_blank" rel="noopener noreferrer">
                  <img alt="Maintenance OS - Manage property repairs without chasing contractors | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1111632&theme=light&t=1775478171868" />
                </a>
              </div>
            </div>
          </section>

          {/* ───── OLD WAY → NEW WAY ───── */}
          <section className="mx-auto max-w-7xl px-6 pb-10 lg:px-10">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Old way */}
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
                <div className="rounded-[20px] bg-slate-50 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">The old way</div>
                  <div className="space-y-2">
                    {painPoints.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50">
                          <svg className="h-3.5 w-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* New way */}
              <div className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
                <div className="rounded-[20px] bg-blue-50 p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">Maintenance OS workflow</div>
                  <div className="grid gap-2">
                    {['Issue submitted with AI analysis', 'Contractors notified at once', 'Quotes compared side by side', 'Job tracked to completion'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                          <svg className="h-3.5 w-3.5 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400">
              Built for homeowners and landlords managing real properties — not spreadsheets.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-blue-600">
              <Link href="/track-rental-property-repairs" className="hover:underline">Track repairs</Link>
              <span className="text-slate-300">·</span>
              <Link href="/compare-contractor-quotes" className="hover:underline">Compare contractor quotes</Link>
              <span className="text-slate-300">·</span>
              <Link href="/features" className="hover:underline">See all features</Link>
            </div>
          </section>

          {/* ───── SEO CONTEXT ───── */}
          <section className="mx-auto max-w-7xl px-6 pb-10 lg:px-10">
            <p className="mx-auto max-w-3xl text-center text-base leading-7 text-slate-500">
              Maintenance OS is <Link href="/property-maintenance-software" className="text-blue-600 hover:underline">property maintenance software</Link> designed for <Link href="/landlord-maintenance-software" className="text-blue-600 hover:underline">landlords</Link> and <Link href="/home-repair-tracking" className="text-blue-600 hover:underline">homeowners</Link> who need a better way to track repairs, manage contractor quotes, and keep maintenance organized across one or multiple properties.
            </p>
          </section>

          {/* ───── FLOW: 5-STEP SYSTEM ───── */}
          <section id="flow" className="border-y border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
              <div className="mx-auto max-w-3xl text-center">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">One system, start to finish</div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                  The full repair workflow in one place
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  From the first request to the final invoice — nothing falls through the cracks.
                </p>
              </div>

              <div className="mt-16 space-y-6">
                {steps.map((step) => (
                  <div key={step.num} className="grid gap-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:grid-cols-[120px_1fr_340px] md:items-center md:p-8">
                    <div className="flex items-center gap-4 md:block">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-semibold text-white shadow-sm">
                        {step.num}
                      </div>
                      <div className="md:mt-4">
                        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{step.title}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">{step.subtitle}</h3>
                      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{step.body}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">What this means</div>
                      <div className="space-y-3">
                        {step.bullets.map((bullet) => (
                          <div key={bullet} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                            {bullet}
                          </div>
                        ))}
                      </div>
                      {step.callout && (
                        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                          {step.callout}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── AI PHOTO ANALYSIS CALLOUT ───── */}
          <section className="border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
              <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
                <div>
                  <div className="mb-2 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    AI-powered
                  </div>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
                    Upload a photo. AI tells you what&apos;s wrong.
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-slate-600">
                    Every photo you upload is analyzed by AI to identify the problem — water damage, cracked drywall, a broken fixture. That analysis feeds into automatic issue classification, recommends the right trade, and gets sent to contractors alongside the photos so they can quote accurately before they even show up.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Sees what you see</div>
                        <div className="text-sm text-slate-500">Identifies damage type, severity, and location from the photo</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Classifies automatically</div>
                        <div className="text-sm text-slate-500">Picks the right category, urgency, and trade — plumber, electrician, HVAC</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Sent to contractors</div>
                        <div className="text-sm text-slate-500">Photos and AI descriptions included in dispatch emails</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Faster quotes</div>
                        <div className="text-sm text-slate-500">Contractors see what is wrong before they arrive — more accurate bids</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-100 p-4">
                      <div className="mb-2 h-40 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">AI analysis</div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        Water damage visible on ceiling drywall with brownish staining spreading approximately 2 feet in diameter, suggesting an active leak from above. Severity appears moderate.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Urgency: High</span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">Trade: Plumbing</span>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Category: Water damage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ───── AI BEYOND PHOTOS ───── */}
          <section className="border-b border-slate-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-2 inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
                  Beyond photo analysis
                </div>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
                  AI that thinks at every step — and learns over time
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Photo diagnosis is just the start. AI is woven into the entire repair workflow — reading contractor replies, extracting quotes, comparing bids, and pulling data from invoices. The more you use it, the smarter your system gets.
                </p>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">Reads contractor replies</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    When a contractor texts back &quot;I can do it Thursday for $450,&quot; AI extracts the price, timeline, and availability automatically.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">Compares quotes for you</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    AI analyzes multiple bids side by side — comparing price, scope, and value — and highlights the best option so you decide in seconds.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">Extracts invoice data</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Upload an invoice or receipt and AI pulls out the amount, line items, and contractor details — no manual data entry.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">Detects and sorts multiple issues</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Describe a clogged sink, broken AC, and a leaky toilet in one go. AI splits them apart so each gets the right contractor — or group them together if one person can handle it all.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">Learns your history</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Every repair builds a smarter picture — which contractors quote fast, which trades cost more at your properties, and what keeps breaking.
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                    <svg className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">Confirms job details</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    When a contractor confirms a date or marks work done via text, AI parses the reply and updates the job status automatically.
                  </p>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/features/ai-powered-maintenance"
                  className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >
                  See all 7 AI features
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
            </div>
          </section>

          {/* ───── BENEFITS ───── */}
          <section id="benefits" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Why this works better</div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
                  A system feels different than a pile of conversations
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  One request becomes one clear workflow — everything connected, nothing lost.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── FINAL CTA ───── */}
          <section className="bg-slate-950 py-20 text-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="mx-auto max-w-4xl text-center">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">The moment of clarity</div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight md:text-5xl">
                  This is what a real repair system looks like
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">
                  If you are managing repairs through texts, calls, memory, and scattered invoices — this replaces all of it.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href={ctaHref}
                    className="rounded-2xl bg-blue-500 px-7 py-4 text-lg font-semibold text-white transition hover:bg-blue-400 hover:shadow-lg"
                  >
                    {ctaLabel}
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-2xl border border-white/20 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/5"
                  >
                    View pricing
                  </Link>
                </div>
                <p className="mt-5 text-sm font-medium text-emerald-400">100% free during beta — every feature, no limits</p>
              </div>
            </div>
          </section>
        </main>
      </PublicLayout>
    </>
  );
}
