import type { Metadata } from 'next';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Maintenance OS Terms of Service. Read our terms and conditions.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 text-sm mb-8">Last updated: March 27, 2026</p>

        <article className="prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using the Maintenance OS service ("Service"), you accept and agree to be bound by
            the terms and conditions of this agreement. If you do not agree to abide by the above, please do not
            use this Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. License to Use</h2>
          <p className="text-gray-700 mb-4">
            Maintenance OS grants you a limited, non-exclusive, non-transferable license to use the Service for
            your personal or business property maintenance purposes. This license does not include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Reproducing or copying the Service or its content</li>
            <li>Sublicensing, reselling, or renting the Service</li>
            <li>Modifying or reverse-engineering the Service</li>
            <li>Using the Service for competitive purposes</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and password.
            You agree to accept responsibility for all activity that occurs under your account. You must notify
            us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Content</h2>
          <p className="text-gray-700 mb-4">
            You retain ownership of all content (issues, repairs, photos, notes) that you upload to Maintenance
            OS ("User Content"). By uploading User Content, you grant us a license to store, display, and use
            that content to provide the Service and improve our platform.
          </p>
          <p className="text-gray-700 mb-4">
            You warrant that your User Content does not infringe on any third-party rights and complies with
            all applicable laws. We reserve the right to remove User Content that violates these terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Prohibited Conduct</h2>
          <p className="text-gray-700 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Use the Service for illegal or harmful purposes</li>
            <li>Harass, threaten, or intimidate other users or contractors</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Transmit viruses, malware, or harmful code</li>
            <li>Spam or send unsolicited messages</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Collect or use personal information without consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Pricing and Payments</h2>
          <p className="text-gray-700 mb-4">
            <strong>Free Tier:</strong> The free tier is provided at no cost and may be terminated at any time.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Professional Tier:</strong> SMS and email dispatch services incur charges based on usage.
            You authorize us to charge your payment method for SMS costs at $0.50–$0.75 per message. Pricing
            may change with 30 days' notice.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Invoicing:</strong> We will send monthly invoices for usage-based charges. Payment is due
            within 30 days.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Refunds:</strong> Usage-based charges are non-refundable. Account terminations do not entitle
            you to refunds for prepaid services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Disclaimer of Warranties</h2>
          <p className="text-gray-700 mb-4">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. MAINTENANCE OS
            DISCLAIMS ALL WARRANTIES, INCLUDING:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Merchantability and fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
            <li>Accuracy, reliability, or completeness of information</li>
            <li>Uninterrupted or error-free operation</li>
          </ul>
          <p className="text-gray-700 mb-4">
            We do not warrant that contractors will respond to dispatches or that repair work will be completed
            satisfactorily. Maintenance OS is a coordination tool, not a guarantee of service delivery.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            IN NO EVENT SHALL MAINTENANCE OS, ITS OFFICERS, DIRECTORS, OR EMPLOYEES BE LIABLE FOR:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, revenue, or business opportunity</li>
            <li>Data loss or corruption</li>
            <li>Failures of contractors or third parties</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Our total liability for any claim shall not exceed the fees you paid in the 12 months preceding the
            claim.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contractor Disputes</h2>
          <p className="text-gray-700 mb-4">
            Maintenance OS provides a platform to coordinate maintenance and dispatch. We are not responsible
            for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Quality of work performed by contractors</li>
            <li>Disputes between you and contractors</li>
            <li>Pricing, quotes, or payment disputes</li>
            <li>Non-completion of work or timeline delays</li>
          </ul>
          <p className="text-gray-700 mb-4">
            You are solely responsible for evaluating contractors, negotiating terms, and resolving disputes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. SMS Communications</h2>
          <p className="text-gray-700 mb-4">
            By using SMS dispatch, you consent to receive SMS messages from Maintenance OS and our contractors.
            You acknowledge that SMS carriers may charge standard message and data rates. You can opt out of
            marketing SMS by contacting support, but dispatch confirmations are necessary to operate the
            Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The Service, including its design, functionality, and content, is the exclusive property of
            Maintenance OS. All rights are reserved. You may not reproduce, modify, or distribute the Service
            without permission.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Indemnification</h2>
          <p className="text-gray-700 mb-4">
            You agree to indemnify and hold harmless Maintenance OS and its officers, directors, and employees
            from any claims, damages, or costs (including legal fees) arising from:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Your violation of these terms</li>
            <li>Your use of the Service</li>
            <li>Your User Content</li>
            <li>Claims by contractors or third parties</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate your account at any time for violation of these terms or for any other reason,
            with or without notice. Upon termination, your access to the Service will be revoked, and we may
            delete your data after a retention period.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction
            in which Maintenance OS operates, without regard to its conflict of law principles.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Dispute Resolution</h2>
          <p className="text-gray-700 mb-4">
            Any dispute arising from these terms shall first be addressed through good-faith negotiation. If
            negotiation fails, disputes shall be resolved through binding arbitration or, if applicable, court
            proceedings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">16. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these Terms of Service at any time. Material changes will be
            communicated via email or prominently posted on the website. Your continued use of the Service
            constitutes acceptance of updated terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">17. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> support@ifbids.com
          </p>
        </article>
      </main>
    </PublicLayout>
  );
}
