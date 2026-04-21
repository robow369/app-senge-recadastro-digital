/**
 * Input mask / formatter utilities for Brazilian document and contact fields.
 * Each function takes a raw string and returns the masked version,
 * stripping any previously applied formatting first.
 */

/** Strips every non-numeric character from a string */
const digitsOnly = (value: string): string => value.replace(/\D/g, '');

/**
 * Formats a CPF string as 000.000.000-00.
 * Limits input to 11 digits.
 */
export function formatCPF(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Formats an RG string as 00.000.000-00 (10 digits total).
 * Brazilian RG formats vary by state; this implementation
 * uses the 10-digit format required by the form.
 */
export function formatRG(value: string): string {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
}

/**
 * Formats a CEP string as 00000-000 (8 digits).
 */
export function formatCEP(value: string): string {
  const digits = digitsOnly(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Formats a Brazilian phone number.
 * Supports landline (10 digits): (00) 0000-0000
 * and mobile (11 digits):        (00) 00000-0000
 */
export function formatPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  // 11-digit mobile: shift separator one position right
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Formats a date string as DD/MM/YYYY.
 * Limits to 8 digits.
 */
export function formatDate(value: string): string {
  const digits = digitsOnly(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Formats a year string, keeping only 4 digits.
 */
export function formatYear(value: string): string {
  return digitsOnly(value).slice(0, 4);
}
