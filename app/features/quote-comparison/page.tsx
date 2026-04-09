import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Quote Comparison -- Compare Contractor Quotes Without the Mess',
  description:
    'No spreadsheets. No copying and pasting. Get multiple bids organized instantly so you can choose the right contractor with confidence.',
  alternates: {
    canonical: '/features/quote-comparison',
  },
};

const features = [
  { title: 'See prices side by side', body: "Instantly know who's cheapest and fastest." },
  { title: 'Compare scope & details', body: "Understand what you're actually getting." },
  { title: 'Avoid bad decisions', body: 'Spot red flags before you hire.' },
  { title: 'Save hundreds per job', body: 'Multiple bids often reduce costs significantly.' },
];

export default function QuoteComparisonPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare Contractor Quotes Without the Mess
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            No spreadsheets. No copying and pasting. Get multiple bids organized instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Run your next repair through this — free
            </Link>
            <Link
              href="#example"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See Example
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">100% free during beta • No credit card • Set up in 2 minutes</p>
        </div>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example */}
        <section id="example" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Example: 3 roof repair quotes
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Contractor</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">Smith Roofing</td>
                    <td className="py-3 px-4 text-right font-medium">$2,800</td>
                    <td className="py-3 px-4 text-gray-600">5-7 days</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">Peak Repairs</td>
                    <td className="py-3 px-4 text-right font-medium">$2,200</td>
                    <td className="py-3 px-4 text-gray-600">10-14 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">Honest Contractors</td>
                    <td className="py-3 px-4 text-right font-medium">$2,500</td>
                    <td className="py-3 px-4 text-gray-600">7-10 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            All in one place. No digging through messages.
          </p>
        </section>

        {/* CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start comparing quotes" subheading="See contractor pricing side by side." />
        </section>
      </main>
    </PublicLayout>
  );
}
