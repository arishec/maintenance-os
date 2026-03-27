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
    console.warn(`Optional environment variables not set (some features will be disabled): ${missingOptional.join(', ')}`);
  }
}
