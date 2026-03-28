import type { Metadata } from 'next';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Maintenance OS Privacy Policy. Learn how we protect your data.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 text-sm mb-8">Last updated: March 27, 2026</p>

        <article className="prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            Maintenance OS ("we," "us," "our," or "Company") operates the Maintenance OS application and
            website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">We may collect information about you in a variety of ways:</p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Account Information</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Name, email address, and phone number</li>
            <li>Password and authentication credentials</li>
            <li>Profile information and preferences</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Property and Maintenance Data</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Property addresses and details</li>
            <li>Maintenance issues, descriptions, and status</li>
            <li>Repair history, invoices, and documentation</li>
            <li>Contractor names, contact info, and quotes</li>
            <li>Photos and attachments related to repairs</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Usage Information</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information and operating system</li>
            <li>Analytics on feature usage and interactions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Provide and maintain the Maintenance OS service</li>
            <li>Process SMS and email dispatches to contractors</li>
            <li>Improve and optimize the platform</li>
            <li>Send service updates and support communications</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and enhance security</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. SMS and Email Communications</h2>
          <p className="text-gray-700 mb-4">
            When you use our contractor dispatch feature, we send SMS and email messages on your behalf. We
            store records of these communications for your reference and to improve our service. You can opt
            out of marketing communications at any time, but service-related messages (dispatch confirmations,
            contractor responses) are necessary to operate the platform.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Sharing and Third Parties</h2>
          <p className="text-gray-700 mb-4">We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>
              <strong>Service Providers:</strong> Third parties that help us deliver SMS, email, hosting, and
              analytics (all under confidentiality agreements)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law, court order, or government request
            </li>
            <li>
              <strong>Business Transfers:</strong> If Maintenance OS is acquired or merges, your data may be
              transferred (you'll be notified)
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Regular security audits and updates</li>
            <li>Restricted access to personal information</li>
            <li>Two-factor authentication options</li>
          </ul>
          <p className="text-gray-700 mb-4">
            No method of transmission over the internet is 100% secure. While we use best efforts to protect
            your data, we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your account and data</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p className="text-gray-700 mb-4">
            To exercise these rights, contact us at support@ifbids.com. We will respond within 30 days.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your data while your account is active. If you delete your account, we will remove your
            personal information within 30 days, though backups may persist for a limited time. Repair history
            data is retained for your reference and legal compliance (typically 7 years for property records).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Maintenance OS is not intended for individuals under 18. We do not knowingly collect information
            from children. If we learn we've collected data from a child, we will promptly delete it.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Your information may be transferred to, stored in, and processed in countries other than your
            country of residence. These countries may have data protection laws that differ from your home
            country. By using Maintenance OS, you consent to such transfers.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Policy Changes</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy periodically. We will notify you of material changes by email or
            by posting the updated policy on our website. Your continued use of Maintenance OS constitutes
            acceptance of the updated Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> support@ifbids.com
          </p>
        </article>
      </main>
    </PublicLayout>
  );
}
