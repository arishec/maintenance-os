import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Simple Pricing | Maintenance OS',
  description:
    'Track issues for free. Upgrade to Pro when you\'re ready to contact contractors and manage everything in one place.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple pricing for managing property repairs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track issues for free. Upgrade when you&apos;re ready to contact contractors
            and manage everything in one place.
          </p>
          <div className="mt-8">
            <Link
              href="/sign-up"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start free
            </Link>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
            <p className="text-gray-600 mb-6">Get started — no credit card</p>

            <div className="mb-8">
              <p className="text-4xl font-bold text-gray-900">$0</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Track up to 3 issues</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>1 property</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>AI issue classification</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Basic workflow tracking</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Full repair history</strong>
                </span>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Start free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-blue-600 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most popular
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
            <p className="text-gray-600 mb-6">For homeowners and landlords</p>

            <div className="mb-8">
              <p className="text-4xl font-bold text-gray-900">
                $19<span className="text-lg font-normal text-gray-600">/month</span>
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Unlimited issues</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Multiple properties</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>SMS &amp; email contractor dispatch</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Compare contractor responses</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Full repair history</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Notifications</strong>
                </span>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>

        {/* Value Reinforcement */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Stop losing time chasing contractors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Compare quotes in one place</p>
              <p className="text-gray-600">
                See every contractor&apos;s response side by side. No more digging through texts and emails.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Keep full repair history</p>
              <p className="text-gray-600">
                Every issue, every contractor, every outcome — searchable and organized.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Make faster decisions</p>
              <p className="text-gray-600">
                Know who&apos;s available, what they charge, and how fast they can start.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Do I need a credit card to start?</h3>
              <p className="text-gray-600">
                No — you can start free with no credit card. Track up to 3 issues and see exactly how the system works before deciding to upgrade.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">What happens after 3 issues?</h3>
              <p className="text-gray-600">
                You&apos;ll be prompted to upgrade to Pro to continue creating issues and dispatching to contractors. Your existing issues and history stay accessible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes. No contracts, no commitments. Cancel anytime and your data stays accessible on the free tier.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">What&apos;s included in contractor dispatch?</h3>
              <p className="text-gray-600">
                Pro includes SMS and email dispatch to your contractors. Send repair requests, get quotes back, and compare responses — all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No credit card required
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Start tracking issues today. Upgrade when you&apos;re ready.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start free
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
