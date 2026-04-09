import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ArticleJsonLd } from '@/components/seo/article-jsonld';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'How to Compare Contractor Quotes (Without Getting Ripped Off)',
  description: 'Learn how to evaluate contractor bids, spot red flags, and choose the best contractor for your repair.',
  alternates: { canonical: '/guides/how-to-compare-contractor-quotes' },
};

export default function HowToCompareContractorQuotesPage() {
  return (
    <PublicLayout>
      <ArticleJsonLd headline="How to Compare Contractor Quotes (Without Getting Ripped Off)" description="Learn how to evaluate contractor bids, spot red flags, and choose the best contractor for your repair." path="/guides/how-to-compare-contractor-quotes" datePublished="2026-03-27" dateModified="2026-03-30" />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How to Compare Contractor Quotes (Without Getting Ripped Off)</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Get multiple bids, evaluate strategically, choose the best value — not just the lowest price.</p>
          <Link href="/sign-up" className="inline-flex rounded-xl bg-blue-600 px-7 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors shadow-md">Start free — no credit card</Link>
          <p className="mt-4 text-sm text-gray-500">No credit card · 2 min setup · Works for 1 or 100 properties</p>
        </div>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How many quotes to get</h2>
          {[{ label: '$100–$500:', value: '1–2 quotes' }, { label: '$500–$2K:', value: '2–3 quotes' }, { label: '$2K+:', value: '3–4 quotes' }].map((item) => (
            <div key={item.label} className="flex gap-3 p-3 rounded-lg border border-gray-200 mb-2">
              <span className="text-sm font-bold text-gray-900">{item.label}</span>
              <span className="text-sm text-gray-700">{item.value}</span>
            </div>
          ))}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to look for in a quote</h2>
          {[{ l: 'Total cost', d: 'Materials, labor, permits — or just labor?' }, { l: 'Scope of work', d: '"Fix" vs "Install" — what exactly?' }, { l: 'Materials', d: 'Budget vs. premium quality' }, { l: 'Timeline', d: 'When can they start? How long?' }, { l: 'Warranty', d: 'How long? What does it cover?' }, { l: 'License & insurance', d: 'Proof required' }].map((item) => (
            <div key={item.l} className="flex gap-3 text-sm mb-2">
              <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
              <div><span className="font-bold text-gray-900">{item.l}:</span> <span className="text-gray-700">{item.d}</span></div>
            </div>
          ))}
        </section>
        <section className="mb-12 rounded-2xl bg-red-50 border border-red-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Red flags to avoid</h2>
          {['No written quote', 'Price 30%+ lower than others', 'Vague scope of work', 'No warranty mentioned', 'Cash only, no receipt', 'Pressure to decide today', 'No license or insurance'].map((flag) => (
            <div key={flag} className="flex gap-2 text-sm text-gray-700 mb-2"><span className="text-red-500 font-bold">×</span> {flag}</div>
          ))}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to decide</h2>
          {['Eliminate bad options — cheap with no warranty', 'Look for good value — quality at fair price', 'Consider your priorities — speed vs. cost', 'Trust your gut — does contractor seem professional?', 'Decide and commit — stop second-guessing'].map((step, i) => (
            <div key={step} className="flex gap-3 text-sm mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex-shrink-0">{i + 1}</span>
              <span className="text-gray-700 pt-0.5">{step}</span>
            </div>
          ))}
        </section>
        <FreeCTA variant="dark" heading="Start comparing quotes today" subheading="Send one request, collect multiple bids, pick the best." />
      </main>
    </PublicLayout>
  );
}
