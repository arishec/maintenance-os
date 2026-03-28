import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Maintenance OS Pricing',
  description:
    'Simple, transparent pricing. Start free, pay only for SMS dispatches you use. No contracts, no hidden fees.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start free. Pay only for what you use. No hidden fees.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Tier 1: Starter */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Starter</h2>
            <p className="text-gray-600 mb-6">Perfect for single properties</p>

            <div className="mb-8">
              <p className="text-4xl font-bold text-gray-900">Free</p>
              <p className="text-gray-600 text-sm mt-1">Forever</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>1 Property</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Unlimited issues</strong> - report and track repairs
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Repair history</strong> - searchable timeline of all work
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Basic support</strong> via email
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-400">✗</span>
                <span className="text-gray-500">SMS contractor dispatch</span>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="block w-full text-center bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2: Professional */}
          <div className="border-2 border-blue-600 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Popular
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
            <p className="text-gray-600 mb-6">For homeowners and small landlords</p>

            <div className="mb-8">
              <p className="text-gray-600 text-sm">
                <strong>Free base</strong> + SMS dispatch costs
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-2">Pay as you go</p>
              <p className="text-gray-600 text-sm mt-1">Typically $10–50/month</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Up to 5 properties</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>SMS contractor dispatch</strong> - $0.50–0.75 per SMS
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Quote comparison</strong> - side-by-side contractor bids
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Tenant intake forms</strong> - collect requests systematically
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Priority email support</strong>
                </span>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* How SMS Pricing Works */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 border border-blue-100 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How SMS Dispatch Works</h2>
          <p className="text-gray-600 mb-6">
            The professional tier includes our core platform free. You only pay for SMS dispatches sent to
            contractors.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span className="text-gray-700">
                <strong>Each dispatch = 1 SMS to contractor(s)</strong> about the maintenance issue
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span className="text-gray-700">
                <strong>Cost: $0.50–0.75 per SMS</strong> depending on destination and carrier
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span className="text-gray-700">
                <strong>No monthly minimums.</strong> You control when you send dispatches.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-606 font-bold">→</span>
              <span className="text-gray-700">
                <strong>Example:</strong> Report a plumbing issue, dispatch to 2 contractors = 2 SMSes ≈
                $1.50
              </span>
            </li>
          </ul>
        </div>

        {/* What's Included */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What's Always Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Issue Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Report and categorize maintenance issues</li>
                <li>• Add photos, notes, and priority levels</li>
                <li>• Track status from open to closed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Repair History</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Complete timeline of every repair</li>
                <li>• Searchable by date, property, or type</li>
                <li>• Export for insurance or resale docs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Organization</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Separate dashboard per property</li>
                <li>• Invite household members (free tier)</li>
                <li>• Store contractor contact info</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Email support (24–48hr response)</li>
                <li>• Help guides and FAQ</li>
                <li>• Video tutorials for common tasks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I stay on the free tier forever?</h3>
              <p className="text-gray-600">
                Yes! The Starter tier is free forever for 1 property. No credit card required, no time limits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Do I have to use SMS dispatch?</h3>
              <p className="text-gray-600">
                No. You can use the free tier to track issues and keep repair history. SMS dispatch is optional
                and only charged when you send it.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">What if I'm managing 10 properties?</h3>
              <p className="text-gray-600">
                The Professional tier supports up to 5 properties. For larger portfolios, contact us for custom
                pricing. We can scale with you.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600">No setup fees, no onboarding costs. Create an account and start immediately.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes. No contracts or long-term commitments. You only pay for the SMSes you send.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Do you offer discounts for bulk SMS?</h3>
              <p className="text-gray-600">
                For high-volume users, yes. Contact us to discuss volume pricing for your situation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No credit card required to get started
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Try the free tier today. Upgrade to SMS dispatch anytime.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Free Account
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
