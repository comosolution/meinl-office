import { normalizeAlpha2CountryCode } from "./countryCodes";
import { MailingFilters, Person } from "./interfaces";

export function filterPersons(
  persons: Person[],
  filters: MailingFilters,
): Person[] {
  const kdnrIds = filters.kdnr.split("#").filter(Boolean);

  return persons.filter((p) => {
    const landMatch =
      filters.land.length === 0 ||
      filters.land.includes(normalizeAlpha2CountryCode(p.land) || "");

    const kundenartMatch =
      filters.kundenart.length === 0 ||
      filters.kundenart.includes(String(p.kundenart));

    const kdnrMatch = kdnrIds.length === 0 || kdnrIds.includes(String(p.kdnr));

    return landMatch && kundenartMatch && kdnrMatch;
  });
}
