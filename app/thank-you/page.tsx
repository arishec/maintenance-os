'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function ThankYouPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Give conversion pixel time to fire, then show the continue button
    const timer = setTimeout(() => {
      setReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-18068633331/vJITCK6A-pYcEMXq790D',
            'value': 1.0,
            'currency': 'USD'
          });
        `}
      </Script>
      <div className="text-center max-w-md">
        <div className="mb-6 text-5xl">&#10003;</div>
        <h1 className="text-3xl font-bold text-slate-900">You&apos;re in!</h1>
        <p className="mt-3 text-lg text-slate-600">
          Your free account is ready. Start by adding your first property and reporting an issue.
        </p>
        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <span className="text-emerald-600 font-bold">&#10003;</span>
            <span>All features unlocked</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-emerald-600 font-bold">&#10003;</span>
            <span>No credit card needed</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-emerald-600 font-bold">&#10003;</span>
            <span>Unlimited properties during beta</span>
          </div>
        </div>
        {ready ? (
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-blue-700 transition"
          >
            Go to your dashboard
          </button>
        ) : (
          <p className="mt-8 text-sm text-slate-400">Setting up your account...</p>
        )}
      </div>
    </div>
  );
}
