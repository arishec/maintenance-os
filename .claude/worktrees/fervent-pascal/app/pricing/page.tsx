import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Pricing — Property Maintenance Software | Maintenance OS',
  description:
    'Maintenance OS is free during beta. Track repairs, dispatch contractors, and compare quotes — no credit card required.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
          Beta
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Free while we&apos;re in beta
        </h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto mb-8">
          We&apos;re building Maintenance OS in the open. Right now every feature is
          free — no credit card, no limits, no catch.
        </p>

        {/* What's included */}
        <div className="border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 text-left max-w-md mx-auto mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Everything included</h2>
          <div className="space-y-3">
            {[
              'Unlimited issues and properties',
              'AI issue classification',
              'SMS & email contractor dispatch',
              'Quote comparison',
              'Full repair history',
              'Notifications',
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="text-green-600 font-bold">&#10003;</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/sign-up"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Join the beta
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          We&apos;ll introduce paid plans down the road — beta users will get early pricing.
        </p>
      </main>
    </PublicLayout>
  );
}
