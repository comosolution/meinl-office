import { countryCodes, normalizeAlpha2CountryCode } from "./countryCodes";
import { Locale } from "./i18n";
import { Person } from "./interfaces";

export interface MailingFilters {
  search: string;
  competences: string[];
  land: string[];
}

export function filterPersonsByLand(
  persons: Person[],
  land: string[],
): Person[] {
  return persons.filter(
    (p) =>
      land.length === 0 ||
      land.includes(normalizeAlpha2CountryCode(p.land) || ""),
  );
}

export function getLandOptions(persons: Person[], locale: Locale) {
  return Array.from(
    new Set(
      persons
        .map((p) => normalizeAlpha2CountryCode(p.land) || "")
        .filter(Boolean),
    ),
  )
    .map((value) => ({
      label:
        countryCodes(locale).find(
          (c) => c.value === normalizeAlpha2CountryCode(value),
        )?.label || value,
      value,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
