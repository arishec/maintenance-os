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
    body: 'Tenants or homeowners submit a repair once with photos, details, and urgency. No more scattered texts, calls, or missing information.',
    bullets: ['Simple form', 'Photos attached', 'Urgency captured'],
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
                  {['Issue submitted', 'Contractors notified', 'Quotes compared', 'Job tracked', 'Repair history saved'].map((item, i) => (
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
