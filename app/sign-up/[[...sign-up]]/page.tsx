import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-1002173765/vJITCK6A-pYcEMXq790D',
            'value': 1.0,
            'currency': 'USD'
          });
        `}
      </Script>
      <SignUp />
    </div>
  );
}
