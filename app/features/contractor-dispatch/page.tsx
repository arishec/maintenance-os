import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { FreeCTA } from '@/components/free-cta';

export const metadata: Metadata = {
  title: 'Contractor Dispatch — Stop Chasing Contractors',
  description:
    'Send maintenance requests to multiple contractors in seconds and get replies without phone calls, voicemails, or email chains.',
  alternates: {
    canonical: '/features/contractor-dispatch',
  },
};

const steps = [
  { number: '1', title: 'Report an issue', body: 'Add details, photos, and priority.' },
  { number: '2', title: 'Select contractors', body: 'Choose who gets the request.' },
  { number: '3', title: 'Send instantly', body: 'Dispatch via SMS and email in one click.' },
  { number: '4', title: 'Get responses', body: 'Contractors accept or send quotes.' },
  { number: '5', title: 'Choose and hire', body: 'Compare and pick the best.' },
];

const benefits = [
  { title: 'No phone tag', body: 'Stop calling, waiting, and chasing.' },
  { title: 'Faster responses', body: 'Contractors reply quickly via SMS.' },
  { title: 'All in one place', body: 'Every reply in your dashboard.' },
  { title: 'Multiple quotes', body: 'Get competitive pricing instantly.' },
];

export default function ContractorDispatchPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stop Chasing Contractors. Get Responses Fast.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Send maintenance requests to multiple contractors in seconds — get replies without phone calls, voicemails, or email chains.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto"
            >
              Start free — no credit card
            </Link>
            <Link
              href="#steps"
              className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">100% free during beta • No credit card • Set up in 2 minutes</p>
        </div>

        {/* How It Works */}
        <section id="steps" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            5 simple steps
          </h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4 border border-gray-200 rounded-xl p-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
                  <p className="text-gray-600 text-xs">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why this saves you hours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((item) => (
              <div key={item.title} className="border border-green-100 bg-green-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-xs">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <FreeCTA variant="dark" heading="Start dispatching to contractors" subheading="Send one request, reach your whole network." />
        </section>
      </main>
    </PublicLayout>
  );
}
