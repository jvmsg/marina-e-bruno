const NON_DIGITS = /\D/g;

export function normalizePhone(input: string): string {
  const digits = input.replace(NON_DIGITS, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

export function phoneLookupCandidates(input: string): string[] {
  const normalized = normalizePhone(input);
  const digits = input.replace(NON_DIGITS, "");
  const candidates = new Set<string>();

  if (normalized) {
    candidates.add(normalized);
  }

  if (digits) {
    candidates.add(digits);
  }

  if (digits.length === 10 || digits.length === 11) {
    candidates.add(`55${digits}`);
  }

  if (digits.startsWith("55") && digits.length > 2) {
    candidates.add(digits.slice(2));
  }

  return [...candidates];
}

export function isValidBrazilPhone(input: string): boolean {
  const normalized = normalizePhone(input);
  return normalized.length >= 12 && normalized.length <= 13;
}

export function formatPhoneDisplay(input: string): string {
  const normalized = normalizePhone(input);

  if (normalized.startsWith("55") && normalized.length >= 12) {
    const local = normalized.slice(2);
    const ddd = local.slice(0, 2);
    const rest = local.slice(2);

    if (rest.length === 9) {
      return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
    }

    if (rest.length === 8) {
      return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
  }

  return input;
}
