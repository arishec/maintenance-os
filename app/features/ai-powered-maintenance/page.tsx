import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'AI-Powered Property Maintenance — Photo Diagnosis, Smart Classification & Quote Comparison',
  description:
    'AI analyzes repair photos, classifies issues by trade and urgency, parses contractor quotes from SMS and email, detects recurring problems, compares bids, and extracts invoice data — automatically.',
  alternates: {
    canonical: '/features/ai-powered-maintenance',
  },
};

const aiFeatures = [
  { title: 'AI repair diagnosis from photos', body: 'Upload a photo. AI describes exactly what it sees.' },
  { title: 'Automatic issue classification', body: 'AI classifies by trade, sets urgency, suggests contractor type.' },
  { title: 'Multi-issue detection', body: 'AI detects, splits, and classifies multiple problems in one message.' },
  { title: 'Smart quote parsing', body: 'AI extracts price, availability, and timeline from SMS and email.' },
  { title: 'Job confirmation parsing', body: 'AI reads contractor replies and updates job status automatically.' },
  { title: 'AI quote comparison', body: 'AI analyzes quotes and writes a recommendation.' },
];

const bonusFeatures = [
  { title: 'Recurring issue detection', body: 'AI alerts you when the same problem keeps happening.' },
  { title: 'Cost intelligence', body: 'AI warns if a quote is way above your typical range for that repair.' },
  { title: 'Contractor scoring', body: 'AI ranks contractors by trade, response rate, history, and speed.' },
];

export default function AIPoweredMaintenancePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            AI-Powered
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI That Actually Helps You Manage Repairs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Not a chatbot. Maintenance OS uses AI at every step — from photo upload to invoice filing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
            <Link
              href="#features"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">100% free during beta • No credit card • Set up in 2 minutes</p>
        </div>

        {/* Core AI Features */}
        <section id="features" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            6 AI features built into your workflow
          </h2>
          <div className="space-y-3">
            {aiFeatures.map((feature) => (
              <div key={feature.title} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                <p className="text-gray-600 text-xs">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bonus Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            AI that gets smarter with your data
          </h2>
          <div className="space-y-3">
            {bonusFeatures.map((item) => (
              <div key={item.title} className="border border-green-100 bg-green-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-xs">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <FreeCTA variant="dark" heading="Try AI-powered maintenance" subheading="Upload a photo and see it in action." />
        </section>
      </main>
    </PublicLayout>
  );
}
