import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Contact Maintenance OS',
  description: 'Get in touch with the Maintenance OS team. Questions about features, pricing, or custom plans?',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:p-8 lg:p-12 mb-16">
          {/* Email */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email</h2>
            <p className="text-gray-600 mb-6">
              Have a question about features, pricing, or need custom support? Send us an email.
            </p>
            <a
              href="mailto:support@ifbids.com"
              className="text-blue-600 hover:text-blue-700 font-medium text-lg"
            >
              support@ifbids.com
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Response time: Usually within 24–48 hours
            </p>
          </div>

          {/* Feedback */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Requests & Feedback</h2>
            <p className="text-gray-600 mb-6">
              Have an idea for a feature? Want to suggest an improvement? We'd love to hear your feedback.
            </p>
            <a
              href="mailto:feedback@ifbids.com"
              className="text-blue-600 hover:text-blue-700 font-medium text-lg"
            >
              feedback@ifbids.com
            </a>
            <p className="text-gray-500 text-sm mt-4">
              All feedback helps us build better features
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How do I get started?</h3>
              <p className="text-gray-600">
                Create a free account on the{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-700">
                  sign-up page
                </Link>
                . No credit card required. You'll be managing your first property in minutes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">What's the difference between free and paid?</h3>
              <p className="text-gray-600">
                The free tier includes issue tracking, repair history, and quote comparison. Professional tier
                adds SMS contractor dispatch for $0.50–0.75 per SMS. See our{' '}
                <Link href="/pricing" className="text-blue-600 hover:text-blue-700">
                  pricing page
                </Link>{' '}
                for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I manage multiple properties?</h3>
              <p className="text-gray-600">
                The free tier is 1 property. Professional tier supports up to 5 properties. For larger
                portfolios, contact us for custom pricing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes. We use industry-standard encryption for all data in transit and at rest. See our{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  privacy policy
                </Link>{' '}
                for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Do you offer integrations?</h3>
              <p className="text-gray-600">
                Currently, Maintenance OS works as a standalone app with SMS and email integration. We're
                exploring additional integrations. Let us know what you'd like to see!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">What if I need custom features?</h3>
              <p className="text-gray-600">
                For large property portfolios or specialized needs, contact us at{' '}
                <a
                  href="mailto:support@ifbids.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  support@ifbids.com
                </a>{' '}
                to discuss custom solutions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I delete my account?</h3>
              <p className="text-gray-600">
                Yes. You can delete your account anytime. Your data will be permanently removed within 30 days.
                Contact support if you need assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 sm:p-8 lg:p-12 border border-gray-200 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/features" className="text-blue-600 hover:text-blue-700 font-medium">
              → View Features
            </Link>
            <Link href="/how-it-works" className="text-blue-600 hover:text-blue-700 font-medium">
              → How It Works
            </Link>
            <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
              → Pricing
            </Link>
            <Link href="/for-homeowners" className="text-blue-600 hover:text-blue-700 font-medium">
              → For Homeowners
            </Link>
            <Link href="/for-landlords" className="text-blue-600 hover:text-blue-700 font-medium">
              → For Landlords
            </Link>
            <Link href="/guides/how-to-track-home-repairs" className="text-blue-600 hover:text-blue-700 font-medium">
              → View Guides
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 lg:p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Create your free account today.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
