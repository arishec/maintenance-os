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
