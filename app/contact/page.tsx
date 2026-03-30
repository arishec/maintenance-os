import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Contact Maintenance OS',
  description: 'Get in touch with the Maintenance OS team. Questions, feedback, or need help getting started?',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Email</h2>
            <p className="text-gray-600 mb-4">
              Questions about the product, need help getting started, or running into an issue?
            </p>
            <a
              href="mailto:support@ifbids.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@ifbids.com
            </a>
            <p className="text-gray-500 text-sm mt-3">
              We usually respond within 24 hours.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Feedback</h2>
            <p className="text-gray-600 mb-4">
              Have an idea for a feature or want to suggest an improvement? We&apos;re building this with early users.
            </p>
            <a
              href="mailto:feedback@ifbids.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              feedback@ifbids.com
            </a>
            <p className="text-gray-500 text-sm mt-3">
              Your feedback directly shapes what we build next.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">Common Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">How do I get started?</h3>
              <p className="text-gray-600">
                Create a free account on the{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-700">
                  sign-up page
                </Link>
                . No credit card required. Add a property, add a contractor, and report your first issue — it takes a few minutes.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Is it really free?</h3>
              <p className="text-gray-600">
                Yes. Everything is free while we&apos;re in beta — unlimited issues, contractor dispatch, quote comparison, and repair history. No limits, no credit card.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">How many properties can I manage?</h3>
              <p className="text-gray-600">
                As many as you need. There are no property limits during the beta.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">How does contractor dispatch work?</h3>
              <p className="text-gray-600">
                When you report an issue, you can send it to one or more contractors via email. They reply with pricing and availability, and everything shows up organized in one place. SMS dispatch is coming soon.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes. All data is encrypted in transit and at rest. See our{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  privacy policy
                </Link>{' '}
                for details.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Can I delete my account?</h3>
              <p className="text-gray-600">
                Yes. Contact{' '}
                <a href="mailto:support@ifbids.com" className="text-blue-600 hover:text-blue-700">
                  support@ifbids.com
                </a>{' '}
                and we&apos;ll remove your account and all associated data.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your free account and report your first issue.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Get started for free
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}
