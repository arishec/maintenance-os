import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SoftwareJsonLd } from '@/components/seo/software-jsonld';
import { PublicLayout } from '@/components/public-layout';
import { AIDemoHero } from '@/components/ai-demo-hero';

export const metadata: Metadata = {
  title: 'Property Maintenance Software for Landlords & Homeowners | Maintenance OS',
  description:
    'Send one repair request, get multiple contractor quotes, and track every job from start to finish. Replace texts, calls, and spreadsheets with one simple system.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <>
      <SoftwareJsonLd />
      <PublicLayout>
        <main>
          {/* ───── HERO: PROBLEM + SOLUTION ───── */}
          <section className="mx-auto max-w-7xl px-6 pt-12 pb-4 lg:px-10 lg:pt-20 lg:pb-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 md:leading-[1.08]">
                Stop Chasing Contractors<br className="hidden sm:block" /> for Repairs
              </h1>
              <p className="mt-5 text-lg leading-7 text-slate-600 max-w-2xl mx-auto">
                Get quotes, assign jobs, and track every repair in one place — without the calls, texts, or spreadsheets.
              </p>
              <p className="mt-3 text-sm text-slate-500 italic">
                Built by a property owner who was tired of chasing vendors and losing quotes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="rounded-2xl bg-blue-600 px-7 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg w-full sm:w-auto text-center"
                >
                  Try it free — start with one repair
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 w-full sm:w-auto text-center"
                >
                  See how it works
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                2 minutes to set up. No credit card. No commitment.
              </p>
              <p className="mt-3 text-base font-medium text-emerald-600">100% free — every feature, no limits</p>

              {/* Trust badge */}
              <div className="mt-6 flex items-center justify-center">
                <a
                  href="https://betalist.com/startups/maintenance-os?utm_campaign=badge-maintenance-os&utm_medium=badge&utm_source=badge-featured"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Maintenance OS - Manage repairs without chasing contractors | BetaList"
                    width={156}
                    height={54}
                    src="https://betalist.com/badges/featured?id=157768&theme=color"
                  />
                </a>
              </div>
            </div>
          </section>

          {/* ───── AI DEMO — RIGHT AFTER HERO ───── */}
          <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
            <div className="mx-auto max-w-3xl text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-950">
                Upload a photo → get the issue, urgency, and contractor instantly
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                AI diagnoses the problem, classifies urgency, and recommends the right trade — in seconds.
              </p>
            </div>
            <AIDemoHero />
          </section>

          {/* ───── HOW IT WORKS — 4 STEPS ───── */}
          <section className="border-y border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
              <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 mb-12">
                How it works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Report', desc: 'Describe the issue or upload a photo. AI classifies it instantly.' },
                  { step: '2', title: 'Dispatch', desc: 'Send to multiple contractors at once via SMS and email.' },
                  { step: '3', title: 'Compare', desc: 'See 3 contractor quotes side by side — price, timeline, and scope.' },
                  { step: '4', title: 'Track', desc: 'Follow every repair from request to completion in one place.' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── AI FEATURES — TIGHT GRID ───── */}
          <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
            <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 mb-10">
              AI at every step
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Photo diagnosis', desc: 'AI sees what you see — damage type, severity, recommended trade.' },
                { title: 'Smart classification', desc: 'Category, urgency, and the right contractor type — automatically.' },
                { title: 'Quote comparison', desc: 'Multiple bids analyzed side by side. Best value highlighted.' },
                { title: 'Reply parsing', desc: '"Thursday at $450" → price, date, and availability extracted.' },
                { title: 'Invoice extraction', desc: 'Upload a receipt. AI pulls amounts, line items, and details.' },
                { title: 'Repair history', desc: 'Every job builds a searchable record of costs, contractors, and outcomes.' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/features" className="text-sm font-medium text-blue-600 hover:underline">
                See all features →
              </Link>
            </div>
          </section>

          {/* ───── FINAL CTA ───── */}
          <section className="bg-slate-950 py-16 text-white">
            <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight md:text-4xl">
                Stop chasing contractors. Start managing repairs.
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                One system for intake, dispatch, quotes, tracking, and history.
              </p>
              <div className="mt-8">
                <Link
                  href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="inline-block w-full sm:w-auto rounded-2xl bg-blue-500 px-7 py-4 text-lg font-semibold text-white transition hover:bg-blue-400 hover:shadow-lg text-center"
                >
                  Try it free — start with one repair
                </Link>
              </div>
              <p className="mt-5 text-sm font-medium text-emerald-400">100% free — every feature, no limits</p>
            </div>
          </section>
        </main>
      </PublicLayout>
    </>
  );
}
