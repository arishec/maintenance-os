import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'How to Manage Rental Property Maintenance (Without Losing Your Mind)',
  description: 'The systems and tools landlords use to stay organized, reduce costs, and keep tenants happy.',
  alternates: { canonical: '/guides/how-to-manage-rental-property-maintenance' },
};

export default function HowToManageRentalPropertyMaintenancePage() {
  return (
    <PublicLayout>
      <ArticleJsonLd headline="How to Manage Rental Property Maintenance (Without Losing Your Mind)" description="The systems and tools landlords use to stay organized, reduce costs, and keep tenants happy." path="/guides/how-to-manage-rental-property-maintenance" datePublished="2026-03-27" dateModified="2026-03-30" />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How to Manage Rental Property Maintenance (Without Losing Your Mind)</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">The system landlords use to stay organized, reduce costs, and keep tenants happy.</p>
          <Link href="/sign-up" className="inline-flex rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-md">Run your next repair through this — free</Link>
          <p className="mt-4 text-sm text-gray-500">No credit card · 2 min setup · Works for 1 or 100 properties</p>
        </div>
        <section className="mb-12 rounded-2xl bg-red-50 border border-red-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">The problem most landlords face</h2>
          <p className="text-sm text-gray-700">Tenants text, email, and call from different channels. Messages get lost. Multiple properties mean chaos without a system.</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorize by urgency</h2>
          {[{ level: 'Emergency', time: 'Same day', ex: 'No heat, no water, fire hazard' }, { level: 'Urgent', time: '3-5 days', ex: 'Broken locks, damaged stairs' }, { level: 'Standard', time: '1-2 weeks', ex: 'Broken faucet, wall damage' }, { level: 'Low priority', time: 'Can wait', ex: 'Cosmetic issues' }].map((item) => (
            <div key={item.level} className="p-3 rounded-lg border border-gray-200 mb-2">
              <div className="flex gap-2 mb-1"><span className="font-bold text-sm text-gray-900">{item.level}</span> <span className="text-gray-600 text-xs">({item.time})</span></div>
              <p className="text-xs text-gray-700">{item.ex}</p>
            </div>
          ))}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10-step system</h2>
          {['Single intake channel -- one way for tenants to request repairs', 'Organize by property -- dashboard for each property', 'Triage quickly -- categorize by urgency and decide who handles it', 'Build contractor network -- 2+ per specialty', 'Dispatch with details -- address, photos, issue, tenant contact', 'Compare quotes for big jobs -- 2-3 bids for $500+', 'Track everything -- date, property, cost, invoice, warranty', 'Communicate progress -- keep tenants updated', 'Plan preventative work -- filters, service, inspections save money', 'Emergency procedures -- define, designate contact, set limits'].map((step, i) => (
            <div key={step} className="flex gap-3 text-xs mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">{i + 1}</span>
              <span className="text-gray-700 pt-0.5">{step}</span>
            </div>
          ))}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common mistakes to avoid</h2>
          {[{ t: 'Delaying repairs', d: 'Small problems become big and expensive' }, { t: 'Not keeping records', d: "You'll forget costs, dates, and details" }, { t: 'Ignoring tenant requests', d: 'Creates resentment and legal liability' }, { t: 'Hiring the cheapest', d: 'Low price often means low quality' }, { t: 'No quotes for big jobs', d: 'Always compare for $500+ repairs' }, { t: 'Mixed responsibilities', d: "Be clear what's your job vs. tenant's" }].map((m) => (
            <div key={m.t} className="flex gap-3 text-xs mb-2">
              <svg className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
              <div><span className="font-bold text-gray-900">{m.t}:</span> <span className="text-gray-700">{m.d}</span></div>
            </div>
          ))}
        </section>
        <FreeCTA variant="dark" heading="Put this guide into practice" subheading="Manage your rental maintenance in one system." />
      </main>
    </PublicLayout>
  );
}
