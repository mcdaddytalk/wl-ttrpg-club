export function normalizeEmail(email?: string | null): string {
  return (email ?? "").trim().toLowerCase();
}

/**
 * Very light E.164-ish normalizer:
 * - keeps leading '+'
 * - removes other non-digits
 * - if 10 US digits, prefixes +1
 * - if 11 digits starting with '1', prefixes '+'
 * - otherwise, returns '+' + digits when length  > 0
 */
export function normalizePhoneE164(phone?: string | null): string {
  const raw = (phone ?? "").trim();
  if (!raw) return "";

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/[^\d]/g, "");

  if (hasPlus) return digits ? `+${digits}` : "";

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}
