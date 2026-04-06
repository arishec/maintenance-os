'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a short delay to ensure conversion fires
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-18068633331/vJITCK6A-pYcEMXq790D',
            'value': 1.0,
            'currency': 'USD'
          });
        `}
      </Script>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome to Maintenance OS!</h1>
        <p className="mt-2 text-slate-600">Setting up your account...</p>
      </div>
    </div>
  );
}
