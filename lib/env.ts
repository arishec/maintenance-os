const required = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

const optional = [
  'ANTHROPIC_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'RESEND_WEBHOOK_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_PRICE_ID',
  'NEXT_PUBLIC_SITE_URL',
  'CONTACT_ADMIN_EMAIL',
  'ADMIN_SECRET',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
] as const;

export function validateEnv(): void {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  const missingOptional = optional.filter(
    (key) => !process.env[key] || process.env[key] === 'REPLACE_ME'
  );
  if (missingOptional.length > 0) {
    // Check for critical variables that will cause crashes
    const criticalVars = missingOptional.filter(
      (key) => key === 'RESEND_FROM_EMAIL' || key === 'TWILIO_PHONE_NUMBER'
    );
    if (criticalVars.length > 0) {
      console.warn(`[CRITICAL] Missing critical environment variables - email/SMS sending WILL CRASH without this: ${criticalVars.join(', ')}`);
    }
    console.warn(`Optional environment variables not set (some features will be disabled): ${missingOptional.join(', ')}`);
  }
}
