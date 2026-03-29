import crypto from 'crypto';

/** Characters excluding ambiguous ones (0/O/1/I) */
const TOKEN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Generate a short unique token like "7F4K2Q" */
function shortToken(length = 6): string {
  const bytes = crypto.randomBytes(length);
  let token = '';
  for (let i = 0; i < length; i++) {
    token += TOKEN_CHARS[bytes[i] % TOKEN_CHARS.length];
  }
  return token;
}

/** Issue reference: ISS-XXXXXX */
export function generateIssueReference(): string {
  return `ISS-${shortToken(6)}`;
}

/** Dispatch reply token: MNT-XXXXXX */
export function generateReplyToken(): string {
  return `MNT-${shortToken(6)}`;
}
