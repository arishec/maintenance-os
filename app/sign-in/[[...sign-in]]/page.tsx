import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Sign in to manage your properties and repairs.
        </p>
      </div>
      <SignIn />
    </div>
  );
}
