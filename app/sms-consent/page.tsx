import type { Metadata } from 'next';
import { PublicLayout } from '@/components/public-layout';

export const metadata: Metadata = {
  title: 'SMS Consent Flow | Maintenance OS',
  description:
    'How contractors opt in to receive SMS messages from Maintenance OS. Consent flow, disclosures, and opt-out instructions.',
  alternates: {
    canonical: '/sms-consent',
  },
};

export default function SmsConsentPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          SMS Consent &amp; Opt-In Flow
        </h1>
        <p className="text-gray-600 text-sm mb-10">
          This page documents how end users (contractors) provide consent to
          receive SMS messages from Maintenance OS.
        </p>

        {/* ── Step 1 ─────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Step 1 — Property owner adds a contractor
          </h2>
          <p className="text-gray-700 mb-4">
            When a property owner adds a contractor to the system, the form
            collects the contractor&apos;s name, phone number, email, and trade.
            Before submitting, the owner sees the following SMS consent notice:
          </p>

          {/* Recreated consent notice — matches the actual form */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden max-w-xl">
            <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Add Contractor Form — SMS Consent Section
              </p>
            </div>
            <div className="p-5">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-900 mb-2">
                  SMS Consent Notice
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  By adding this contractor, you confirm that the contractor has
                  agreed to receive repair request notifications via SMS from
                  Maintenance OS (ifbids.com). Message and data rates may apply.
                  Message frequency varies (typically 1-5 per month). The
                  contractor can opt out at any time by replying{' '}
                  <strong>STOP</strong> to any SMS message, or by contacting
                  support@ifbids.com. Reply <strong>HELP</strong> for help.
                </p>
                <p className="text-xs text-gray-600">
                  No mobile information will be shared with third parties or
                  affiliates for marketing or promotional purposes. See our{' '}
                  <a
                    href="/privacy"
                    className="text-blue-600 underline hover:text-blue-700"
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="/terms#sms"
                    className="text-blue-600 underline hover:text-blue-700"
                  >
                    Terms of Service
                  </a>{' '}
                  for full details on our SMS messaging practices.
                </p>
              </div>
              <div className="mt-4">
                <div className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white w-40">
                  Add Contractor
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3 italic">
            ↑ This is an exact reproduction of the consent notice displayed in
            the application. The actual form is behind authentication at
            ifbids.com/contractors/new.
          </p>
        </section>

        {/* ── Step 2 ─────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Step 2 — SMS messages sent
          </h2>
          <p className="text-gray-700 mb-4">
            After a contractor is added and a repair request is dispatched, the
            contractor receives an SMS message like:
          </p>
          <div className="rounded-xl border border-gray-200 bg-white shadow-lg max-w-md p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Example SMS Message
            </p>
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                New repair request from Maintenance OS: &quot;Water stain on ceiling,
                spreading fast — about 2 feet wide.&quot; Property: 123 Main St, Apt
                2B. Reply with your quote and availability. Reply STOP to
                unsubscribe. Reply HELP for help. Msg&amp;data rates may apply.
              </p>
            </div>
          </div>
        </section>

        {/* ── Opt-out ────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Opt-Out Instructions
          </h2>
          <p className="text-gray-700 mb-3">
            Contractors can opt out of SMS messages at any time using any of the
            following methods:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm">
            <li>
              Reply <strong>STOP</strong> to any SMS message from Maintenance OS
            </li>
            <li>
              Email{' '}
              <a
                href="mailto:support@ifbids.com"
                className="text-blue-600 underline"
              >
                support@ifbids.com
              </a>{' '}
              to request removal
            </li>
            <li>
              The property owner can remove the contractor from their account at
              any time
            </li>
          </ul>
        </section>

        {/* ── Help ───────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Help &amp; Support
          </h2>
          <p className="text-gray-700 mb-3">
            Reply <strong>HELP</strong> to any SMS message, or contact:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm">
            <li>
              Email:{' '}
              <a
                href="mailto:support@ifbids.com"
                className="text-blue-600 underline"
              >
                support@ifbids.com
              </a>
            </li>
            <li>
              Website:{' '}
              <a
                href="https://ifbids.com/contact"
                className="text-blue-600 underline"
              >
                ifbids.com/contact
              </a>
            </li>
          </ul>
        </section>

        {/* ── Key disclosures ────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Required Disclosures Summary
          </h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white w-44">
                    Program Name
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    Maintenance OS Repair Notifications
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white">
                    Message Types
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    Transactional only — repair request notifications, quote
                    requests, job updates. No marketing messages.
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white">
                    Message Frequency
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    1–5 messages per month (varies based on repair volume)
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white">
                    Rates
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    Message and data rates may apply
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white">
                    Opt-Out
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    Reply <strong>STOP</strong> to unsubscribe
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white">
                    Help
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    Reply <strong>HELP</strong> for help
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-white">
                    Data Sharing
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    No mobile information is shared with third parties or
                    affiliates for marketing or promotional purposes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Links ──────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Related Policies
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm">
            <li>
              <a
                href="/privacy"
                className="text-blue-600 underline hover:text-blue-700"
              >
                Privacy Policy
              </a>{' '}
              — Section 3: SMS and Email Communications
            </li>
            <li>
              <a
                href="/terms#sms"
                className="text-blue-600 underline hover:text-blue-700"
              >
                Terms of Service
              </a>{' '}
              — Section 10: SMS Communications and Consent
            </li>
          </ul>
        </section>
      </main>
    </PublicLayout>
  );
}
