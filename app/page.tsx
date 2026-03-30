import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SoftwareJsonLd } from '@/components/seo/software-jsonld';
import { PublicLayout } from '@/components/public-layout';

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
  'Tenant texts you at 9:14 pm',
  'Contractor doesn\u2019t respond until two days later',
  'Another sends a vague quote by email',
  'You forget who fixed it last time',
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
  const ctaLabel = isSignedIn ? 'Go to dashboard' : 'Get started for free';

  return (
    <>
      <SoftwareJsonLd />
      <PublicLayout>
        <main>
          {/* ───── HERO ───── */}
          <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                Most landlords don&apos;t have a system — they have conversations
              </div>
              <h1 className="max-w-4xl text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
                Manage repairs without chasing contractors
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-500">
                Property maintenance software for landlords and homeowners
              </p>
              <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-600">
                Turn messy texts, calls, and scattered quotes into one clear system — intake, dispatch, compare, track, and history.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={ctaHref}
                  className="rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {ctaLabel}
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  See how it works
                </Link>
              </div>
              <div className="mt-6 grid max-w-xl gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">No credit card required in beta</div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">Works for homeowners and landlords</div>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Built for homeowners and landlords managing real properties — not spreadsheets.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-600">
                <Link href="/track-rental-property-repairs" className="hover:underline">Track repairs</Link>
                <span className="text-slate-300">·</span>
                <Link href="/compare-contractor-quotes" className="hover:underline">Compare contractor quotes</Link>
                <span className="text-slate-300">·</span>
                <Link href="/features" className="hover:underline">See all features</Link>
              </div>
            </div>

            {/* Old way → New way visual */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">The old way</div>
                <div className="space-y-3">
                  {painPoints.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50">
                        <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-4 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                ↓ turns into ↓
              </div>
              <div className="rounded-[24px] bg-blue-50 p-5">
                <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">Maintenance OS workflow</div>
                <div className="grid gap-3">
                  {['Issue submitted', 'AI analyzes photos', 'Contractors notified', 'Quotes compared', 'Job tracked', 'Repair history saved'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                    className="rounded-2xl bg-blue-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-400"
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
                <p className="mt-5 text-sm text-slate-400">No credit card required while in beta.</p>
              </div>
            </div>
          </section>
        </main>
      </PublicLayout>
    </>
  );
}
