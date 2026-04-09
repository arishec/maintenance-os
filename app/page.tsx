import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SoftwareJsonLd } from '@/components/seo/software-jsonld';
import { PublicLayout } from '@/components/public-layout';
import { AIDemoHero } from '@/components/ai-demo-hero';

export const metadata: Metadata = {
  title: 'Maintenance OS — Manage Repairs Without Chasing Contractors',
  description:
    'Upload a photo or describe a repair. AI classifies urgency, recommends the right trade, and dispatches to contractors — all in one click.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;
  const ctaHref = isSignedIn ? '/dashboard' : '/sign-up';
  const ctaLabel = isSignedIn ? 'Go to dashboard' : 'Run your next repair through this — free';

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

          {/* ───── HOW IT WORKS — 4 STEPS ───── */}
          <section className="border-y border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
              <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 mb-12">
                How it works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Report', desc: 'Upload a photo or describe the issue. AI classifies it instantly.' },
                  { step: '2', title: 'Dispatch', desc: 'Send to multiple contractors at once via SMS and email.' },
                  { step: '3', title: 'Compare', desc: 'See quotes, timelines, and scope side by side.' },
                  { step: '4', title: 'Track', desc: 'Follow every job from scheduled to completed.' },
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
              <Link
                href="/features"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
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
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={ctaHref}
                  className="rounded-2xl bg-blue-500 px-7 py-4 text-lg font-semibold text-white transition hover:bg-blue-400 hover:shadow-lg w-full sm:w-auto text-center"
                >
                  {ctaLabel}
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-2xl border border-white/20 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/5 w-full sm:w-auto text-center"
                >
                  View pricing
                </Link>
              </div>
              <p className="mt-5 text-sm font-medium text-emerald-400">100% free during beta — every feature, no limits</p>
            </div>
          </section>
        </main>
      </PublicLayout>
    </>
  );
}
