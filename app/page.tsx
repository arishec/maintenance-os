import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SoftwareJsonLd } from '@/components/seo/software-jsonld';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Maintenance OS — Stop Chasing Contractors. Keep Every Repair Organized.',
  description:
    'Report an issue once, send it to contractors, compare responses, and track everything in one place.',
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
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

          {/* Hero */}
          <section className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                Stop chasing contractors. Keep every repair organized.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-gray-600">
                Report an issue once, send it to contractors, compare responses, and track
                everything in one place.
              </p>
              <p className="mt-3 max-w-2xl text-sm text-gray-500">
                Everything gets organized automatically — no chasing, no scattered messages.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {isSignedIn ? 'Go to dashboard' : 'Get started'}
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Quote comparison visual */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="border-b border-gray-200 pb-3 mb-4">
                  <p className="text-sm font-medium text-gray-500">Issue: Leaking sink</p>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Plumber A', price: '$250', timing: 'Tomorrow', highlight: false },
                    { name: 'Plumber B', price: '$180', timing: 'Friday', highlight: true },
                    { name: 'Plumber C', price: '$300', timing: 'Today', highlight: false },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className={`grid grid-cols-3 gap-3 rounded-lg border p-3 text-sm ${
                        row.highlight ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{row.name}</div>
                      <div className="text-gray-700">{row.price}</div>
                      <div className="text-gray-500">{row.timing}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Problem */}
          <section className="mt-16 sm:mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Most repairs get lost in texts, calls, and memory
            </h2>
            <p className="mt-4 max-w-3xl text-base text-gray-600">
              Contractor responses come from everywhere — texts, emails, and calls.
              Pricing is unclear. And it&apos;s hard to remember what was done and when.
            </p>
            <p className="mt-3 max-w-3xl text-base text-gray-600">
              Things fall through the cracks. Follow-ups get missed. You end up chasing
              updates instead of managing the work.
            </p>
          </section>

          {/* Core Value */}
          <section className="mt-16 sm:mt-24 rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Send one issue. Get multiple responses.
            </h2>
            <p className="mt-4 max-w-3xl text-base text-gray-600">
              Instead of contacting contractors one by one, send the issue once and
              compare responses in one place.
            </p>
            <p className="mt-3 max-w-3xl text-base text-gray-600">
              Pricing, availability, and messages stay organized automatically — so
              you can make a decision quickly.
            </p>
            <div className="mt-6 space-y-2">
              {[
                'Send to multiple contractors at once',
                'See pricing and timing side-by-side',
                'Choose the best option quickly',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">&#10003;</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="mt-16 sm:mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How it works</h2>
            <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {[
                { step: '1', title: 'Report the issue' },
                { step: '2', title: 'We send it to contractors' },
                { step: '3', title: 'Compare responses' },
                { step: '4', title: 'Track the job' },
                { step: '5', title: 'Keep the history' },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-2 text-xs font-bold text-gray-400">Step {item.step}</div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/how-it-works" className="text-sm font-medium text-blue-600 hover:underline">
                See the full workflow
              </Link>
            </div>
          </section>

          {/* Pain removal */}
          <section className="mt-16 sm:mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Stop doing this the hard way</h2>
            <div className="mt-6 space-y-3">
              {[
                'No more texting contractors one by one',
                'No more scattered quotes and messages',
                'No more guessing what was done or when',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-gray-400">&#8212;</span>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Audience */}
          <section className="mt-16 sm:mt-24 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">For homeowners</h2>
              <p className="mt-3 text-gray-600">
                Track repairs, compare quotes, and keep your home&apos;s repair history organized.
              </p>
              <Link href="/for-homeowners" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                Learn more
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">For landlords</h2>
              <p className="mt-3 text-gray-600">
                Manage issues across properties, coordinate contractors, and keep maintenance organized.
              </p>
              <Link href="/for-landlords" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                Learn more
              </Link>
            </div>
          </section>

          {/* Features */}
          <section className="mt-16 sm:mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Everything in one place</h2>
            <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { title: 'Issue tracking', href: '/features/property-maintenance-tracking' },
                { title: 'Contractor dispatch', href: '/features/contractor-dispatch' },
                { title: 'Quote comparison', href: '/features/quote-comparison' },
                { title: 'Repair history', href: '/features/repair-history' },
              ].map((f) => (
                <Link key={f.href} href={f.href} className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900">{f.title}</h3>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/features" className="text-sm font-medium text-blue-600 hover:underline">
                See all features
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mt-16 sm:mt-24 rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              We&apos;re in beta — everything is free
            </h2>
            <p className="mt-3 text-gray-600">
              Sign up, report your first issue, and help shape a better way to manage property repairs.
            </p>
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              {isSignedIn ? 'Go to dashboard' : 'Get started for free'}
            </Link>
          </section>

        </main>
      </PublicLayout>
    </>
  );
}
