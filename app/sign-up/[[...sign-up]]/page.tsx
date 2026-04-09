import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">
          Start managing repairs in one place
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Free during beta — all features, no credit card, no limits.
        </p>
      </div>
      <SignUp forceRedirectUrl="/thank-you" />
      <div className="mt-8 flex gap-4 text-sm text-slate-500">
        <span>Track repairs</span>
        <span aria-hidden="true">·</span>
        <span>Compare quotes</span>
        <span aria-hidden="true">·</span>
        <span>Manage contractors</span>
      </div>
    </div>
  );
}
