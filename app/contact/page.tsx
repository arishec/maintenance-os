import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ContactForm } from '@/components/contact-form';

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
            Have questions or feedback? Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Form */}
          <div>
            <ContactForm />
          </div>

          {/* FAQ */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Common Questions</h2>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Is it really free?</h3>
              <p className="text-sm text-gray-600">
                Yes. Everything is free while we&apos;re in beta — unlimited issues, contractor dispatch, quote comparison, and repair history.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">How does contractor dispatch work?</h3>
              <p className="text-sm text-gray-600">
                Report an issue, select contractors, and send it out via email. They reply with pricing and availability, and everything shows up organized in one place.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">How many properties can I manage?</h3>
              <p className="text-sm text-gray-600">
                As many as you need. There are no limits during the beta.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Is my data secure?</h3>
              <p className="text-sm text-gray-600">
                Yes. All data is encrypted in transit and at rest. See our{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  privacy policy
                </Link>{' '}
                for details.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Can I delete my account?</h3>
              <p className="text-sm text-gray-600">
                Yes. Send us a message through this form and we&apos;ll remove your account and all associated data.
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
