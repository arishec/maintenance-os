import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format E.164 phone number (+1XXXXXXXXXX) to (XXX) XXX-XXXX display format.
 * Returns the original string if it doesn't match E.164 pattern.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  // Handle US numbers: 1XXXXXXXXXX (11 digits) or XXXXXXXXXX (10 digits)
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (national.length === 10) {
    return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
  }
  return phone; // Return as-is for non-US numbers
}

/**
 * Escape HTML special characters to prevent XSS in email templates.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Safely format error messages for API responses.
 * In production, returns a generic message to prevent information leakage.
 * In development, includes the real error message for debugging.
 */
export function safeErrorMessage(error: unknown): string {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    return 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Something went wrong. Please try again.';
}
