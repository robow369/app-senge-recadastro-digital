/**
 * Validation utilities for the SENGE-CE registration form.
 * Each function returns an error string if invalid, or empty string if valid.
 */

/** Strips non-numeric characters for digit-only comparisons */
const digits = (v: string) => v.replace(/\D/g, '');

/**
 * Validates a Brazilian CPF using the standard two-digit verification algorithm.
 * Returns an error message if invalid, otherwise returns ''.
 */
export function validateCPF(value: string): string {
  const d = digits(value);
  if (d.length !== 11) return 'CPF deve conter 11 dígitos';

  // Reject all-same-digit CPFs (e.g. 111.111.111-11)
  if (/^(\d)\1{10}$/.test(d)) return 'CPF inválido';

  // First check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(d[9])) return 'CPF inválido';

  // Second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(d[10])) return 'CPF inválido';

  return '';
}

/**
 * Validates an RG with the 10-digit format used by the form.
 * Only checks digit count; full algorithmic validation varies by state.
 */
export function validateRG(value: string): string {
  const d = digits(value);
  if (d.length !== 10) return 'RG deve conter 10 dígitos';
  return '';
}

/**
 * Validates a Brazilian CEP (postal code) – must be exactly 8 digits.
 */
export function validateCEP(value: string): string {
  const d = digits(value);
  if (d.length !== 8) return 'CEP deve conter 8 dígitos';
  return '';
}

/**
 * Validates a Brazilian phone number (landline = 10 digits, mobile = 11 digits).
 */
export function validatePhone(value: string): string {
  const d = digits(value);
  if (d.length < 10 || d.length > 11) return 'Telefone inválido';
  return '';
}

/**
 * Validates an e-mail address using a standard regex pattern.
 */
export function validateEmail(value: string): string {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value.trim())) return 'E-mail inválido';
  return '';
}

/**
 * Validates a date string in DD/MM/YYYY format.
 * Checks format, range for day/month, and whether the date actually exists.
 */
export function validateDate(value: string): string {
  const d = digits(value);
  if (d.length !== 8) return 'Data inválida (DD/MM/AAAA)';

  const day = parseInt(d.slice(0, 2));
  const month = parseInt(d.slice(2, 4));
  const year = parseInt(d.slice(4, 8));

  if (month < 1 || month > 12) return 'Mês inválido';
  if (day < 1 || day > 31) return 'Dia inválido';

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return 'Data inválida';

  return '';
}

/**
 * Validates a graduation year – must be a 4-digit year between 1900 and current year.
 */
export function validateYear(value: string): string {
  const d = digits(value);
  if (d.length !== 4) return 'Ano deve conter 4 dígitos';
  const year = parseInt(d);
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return `Ano deve ser entre 1900 e ${currentYear}`;
  return '';
}

/**
 * Validates that a required text field is not empty.
 */
export function validateRequired(value: string, label: string): string {
  if (!value.trim()) return `${label} é obrigatório(a)`;
  return '';
}
