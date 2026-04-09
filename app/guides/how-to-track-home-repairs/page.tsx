import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'How to Track Home Repairs (Without Spreadsheets or Chaos)',
  description: 'A simple system to organize repairs, compare contractors, and never lose track of what was done.',
  alternates: { canonical: '/guides/how-to-track-home-repairs' },
};

export default function HowToTrackHomeRepairsPage() {
  return (
    <PublicLayout>
      <ArticleJsonLd headline="How to Track Home Repairs (Without Spreadsheets or Chaos)" description="A simple system to organize repairs, compare contractors, and never lose track of what was done." path="/guides/how-to-track-home-repairs" datePublished="2026-03-27" dateModified="2026-03-30" />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How to Track Home Repairs <span className="text-gray-500">(No Spreadsheets)</span></h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">One system for repairs, contractors, costs, and proof. Never lose track again.</p>
          <Link href="/sign-up" className="inline-flex rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-md">Start free — no credit card</Link>
          <p className="mt-4 text-sm text-gray-500">No credit card · 2 min setup · Works for 1 or 100 properties</p>
        </div>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why tracking matters</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {['Increase resale value — buyers trust documented maintenance', 'Protect insurance claims — proof prevents denials', 'Avoid repeat issues — spot patterns early', 'Stay organized — know what was done, when, by who'].map((item) => (
              <div key={item} className="flex gap-3">
                <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-12 rounded-2xl bg-red-50 border border-red-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Most people do it wrong</h2>
          {['Texts/emails get lost', 'Spreadsheets go outdated', 'Receipts scattered', 'You forget what happened'].map((m) => (
            <div key={m} className="flex gap-2 text-sm text-gray-700 mb-2"><span className="text-red-500 font-bold">×</span> {m}</div>
          ))}
          <p className="text-sm text-gray-600 mt-3 font-medium">Result: lost time, lost money, no clarity.</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Track these 8 things per repair</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Date', 'Type', 'Location', 'Description', 'Contractor', 'Cost', 'Photos', 'Warranty'].map((item) => (
              <div key={item} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center"><span className="text-sm font-medium text-gray-700">{item}</span></div>
            ))}
          </div>
        </section>
        <section className="mb-12 rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Use a system instead</h2>
          {['Logs repairs automatically', 'Stores photos, receipts, notes', 'Tracks contractor info + costs', 'Searchable in one place'].map((item) => (
            <div key={item} className="flex gap-2 text-sm text-gray-700 mb-2"><span className="text-blue-600 font-bold">✓</span> {item}</div>
          ))}
          <p className="text-sm text-gray-600 mt-3 font-medium">That's what Maintenance OS does.</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Long-term uses</h2>
          {['Plan upgrades', 'Budget maintenance', 'Compare contractors', 'Prepare for resale', 'File insurance claims'].map((item) => (
            <div key={item} className="flex gap-3 text-sm text-gray-700 mb-2">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
              {item}
            </div>
          ))}
        </section>
        <FreeCTA variant="dark" heading="Start tracking repairs today" subheading="One system for all your repairs, contractors, and proof." />
      </main>
    </PublicLayout>
  );
}
