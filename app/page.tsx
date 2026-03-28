import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SoftwareJsonLd } from '@/components/seo/software-jsonld';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Maintenance OS — Track Property Repairs, Contractors, and Quotes',
  description:
    'Maintenance OS helps homeowners and landlords track repairs, contact contractors, compare quotes, and keep maintenance history organized.',
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
        <main className="mx-auto max-w-6xl px-6 py-16">
          <section className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Track property repairs, contractor quotes, and maintenance history in one place
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                Maintenance OS helps homeowners and landlords report issues, contact contractors,
                compare replies, and keep repair records organized.
              </p>
              <div className="mt-8 flex gap-3">
                <Link
                  href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  {isSignedIn ? 'Go to dashboard' : 'Get started free'}
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  How it works
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="border-b border-border pb-3 mb-3 text-sm font-medium text-muted-foreground">Quote comparison preview</div>
                <div className="space-y-3">
                  {[
                    ['Mike\u2019s Plumbing', '$180', 'Tomorrow', 'Replied'],
                    ['QuickFix Pro', '$140', '3 days', 'Replied'],
                    ['Elite Plumbing', 'Pending', 'Pending', 'Waiting'],
                  ].map(([name, estimate, availability, status]) => (
                    <div key={name} className="grid grid-cols-4 gap-3 rounded-lg border border-border p-3 text-sm">
                      <div className="font-medium">{name}</div>
                      <div>{estimate}</div>
                      <div>{availability}</div>
                      <div className="text-muted-foreground">{status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <h2 className="text-2xl font-semibold">Stop chasing contractors and losing track of repairs</h2>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground">
              Most property maintenance gets scattered across texts, emails, notes, and memory.
              Maintenance OS keeps every issue, contractor reply, quote, and repair history in one place
              so nothing falls through the cracks.
            </p>
          </section>

          <section className="mt-24">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-5">
              {[
                { step: '1', title: 'Report the issue', desc: 'Describe the problem with photos and details.' },
                { step: '2', title: 'AI classifies it', desc: 'Category, urgency, and recommended trade identified.' },
                { step: '3', title: 'Contact contractors', desc: 'Send requests via SMS and email in one step.' },
                { step: '4', title: 'Compare replies', desc: 'See quotes, availability, and notes side by side.' },
                { step: '5', title: 'Track the job', desc: 'Follow progress from scheduled to completed.' },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-border p-4">
                  <div className="mb-2 text-xs font-bold text-muted-foreground">Step {item.step}</div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/how-it-works" className="text-sm font-medium underline">
                See the full workflow
              </Link>
            </div>
          </section>

          <section className="mt-24 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold">For homeowners</h2>
              <p className="mt-3 text-muted-foreground">
                Keep track of home repairs, compare contractor quotes, and organize repair history
                so you always know what was fixed, when, and by whom.
              </p>
              <Link href="/for-homeowners" className="mt-4 inline-block text-sm font-medium underline">
                Learn more
              </Link>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold">For landlords</h2>
              <p className="mt-3 text-muted-foreground">
                Manage repair issues, contractor communication, and maintenance history across
                multiple rental properties without the chaos.
              </p>
              <Link href="/for-landlords" className="mt-4 inline-block text-sm font-medium underline">
                Learn more
              </Link>
            </div>
          </section>

          <section className="mt-24">
            <h2 className="text-2xl font-semibold">Core features</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { title: 'Contractor dispatch', href: '/features/contractor-dispatch', desc: 'Send repair requests by SMS and email with one click.' },
                { title: 'Quote comparison', href: '/features/quote-comparison', desc: 'Compare contractor replies, pricing, and availability side by side.' },
                { title: 'Repair history', href: '/features/repair-history', desc: 'Keep a searchable record of every repair and contractor interaction.' },
              ].map((f) => (
                <Link key={f.href} href={f.href} className="rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/features" className="text-sm font-medium underline">
                See all features
              </Link>
            </div>
          </section>

          <section className="mt-24">
            <h2 className="text-2xl font-semibold">Guides</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link href="/guides/how-to-track-home-repairs" className="rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                <h3 className="font-medium">How to track home repairs</h3>
                <p className="mt-1 text-sm text-muted-foreground">A practical system for organizing repairs, quotes, and contractor history.</p>
              </Link>
              <Link href="/guides/how-to-manage-rental-property-maintenance" className="rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                <h3 className="font-medium">Managing rental property maintenance</h3>
                <p className="mt-1 text-sm text-muted-foreground">How landlords can stay on top of repairs across multiple properties.</p>
              </Link>
              <Link href="/guides/how-to-compare-contractor-quotes" className="rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                <h3 className="font-medium">How to compare contractor quotes</h3>
                <p className="mt-1 text-sm text-muted-foreground">What to look for beyond just the price when choosing a contractor.</p>
              </Link>
            </div>
          </section>

          <section className="mt-24 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h2 className="text-2xl font-semibold">Ready to organize your property maintenance?</h2>
            <p className="mt-3 text-muted-foreground">Free to start. No credit card required.</p>
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              {isSignedIn ? 'Go to dashboard' : 'Get started free'}
            </Link>
          </section>
        </main>
      </PublicLayout>
    </>
  );
}
