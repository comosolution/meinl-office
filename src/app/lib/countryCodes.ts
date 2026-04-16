import countries from "i18n-iso-countries";

const aliasToIso2: Record<string, string> = {
  D: "DE",
  A: "AT",
  B: "BE",
  F: "FR",
  UK: "GB",
};

export const normalizeAlpha3CountryCode = (input: string): string | null => {
  if (!input) return null;
  const code = input.trim().toUpperCase();

  const normalized = aliasToIso2[code] ?? code;

  if (normalized.length === 2) {
    return countries.alpha2ToAlpha3(normalized) ?? null;
  }

  return null;
};

export const normalizeAlpha2CountryCode = (input: string): string | null => {
  if (!input) return null;
  const code = input.trim().toUpperCase();

  const normalized = aliasToIso2[code] ?? code;

  return normalized;
};
