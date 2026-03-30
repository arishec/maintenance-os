import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/public-layout';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact Maintenance OS',
  description: 'Have a question about Maintenance OS? Get in touch and we\'ll help you get up and running quickly.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* ───── HEADER ───── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Have a question? Let&apos;s get you unstuck
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you&apos;re setting up your first property or figuring out how it works — we&apos;ll help you get up and running quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* ───── FORM ───── */}
          <div>
            <p className="text-sm text-gray-500 mb-4">We typically respond within a few hours.</p>
            <ContactForm />
            <p className="text-xs text-gray-400 mt-3">No spam. No sales pressure. Just a real response.</p>

            {/* Secondary CTA */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 mb-3">Or skip the wait:</p>
              <Link
                href="/sign-up"
                className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Get started free
              </Link>
            </div>
          </div>

          {/* ───── FAQ ───── */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Common Questions</h2>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Do I need to install anything?</h3>
              <p className="text-sm text-gray-600">
                No. It&apos;s a simple web app — you can start using it in minutes.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Is it really free?</h3>
              <p className="text-sm text-gray-600">
                Yes — everything is free while we&apos;re in beta. No limits, no credit card, no surprises.
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

        {/* ───── BOTTOM CTA ───── */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-10 text-center border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your free account and report your first issue.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get started free
          </Link>
        </section>

        {/* ───── EMAIL FALLBACK ───── */}
        <p className="text-center text-sm text-gray-400">
          Prefer email? support@maintenanceos.com
        </p>
      </main>
    </PublicLayout>
  );
}
