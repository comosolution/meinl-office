import { normalizeAlpha2CountryCode } from "@/app/lib/countryCodes";
import { emailValidation, notEmptyValidation } from "@/app/lib/form";
import { Locale, t } from "@/app/lib/i18n";
import { Person } from "../../../lib/interfaces";
import { parseDateString } from "../../../lib/utils";

export const getInitialValues = (person: Person) => {
  return {
    id: person.id || 0,
    kdnr: person.kdnr || "",
    kundenart: person.kundenart || 0,
    vorname: person.vorname || "",
    nachname: person.nachname || "",
    name1: person.name1 || "",
    name2: person.name2 || "",
    name3: person.name3 || "",
    plz: person.plz || "",
    ort: person.ort || "",
    strasse: person.strasse || "",
    land: normalizeAlpha2CountryCode(person.land || "DE") || "",
    plzpr: person.plzpr || "",
    ortpr: person.ortpr || "",
    strassepr: person.strassepr || "",
    landpr: normalizeAlpha2CountryCode(person.landpr || "DE") || "DE",
    email: person.email || "",
    phone: person.phone || "",
    fax: person.fax || "",
    b2bnr: person.b2bnr || "",
    anrede: person.anrede || "",
    titel: person.titel || "",
    mobil: person.mobil || "",
    jobpos: person.jobpos || "",
    abteilung: person.abteilung || "",
    betreutvon: person.betreutvon || "",
    gebdat: parseDateString(person.gebdat) || null,
    famstand: person.famstand || "",
    tshirt: person.tshirt || "",
    hobbies: person.hobbies || "",
    musikri: person.musikri || "",
    instrument: person.instrument || "",
    zustaendig: person.zustaendig
      ? person.zustaendig.split(",").map((c) => c.trim())
      : [],
    b2bzugriff: person.b2bzugriff || "",
    b2bdltyp: person.b2bdltyp
      ? person.b2bdltyp.split(",").map((b) => b.trim())
      : [],
    b2bdldis: person.b2bdldis || false,
    b2bpwd: person.b2bpwd || "",
  };
};

export type FormValues = Omit<Person, "gebdat" | "zustaendig"> & {
  gebdat: Date | null;
  zustaendig: string[];
  b2bdltyp: string[];
};

export function validateForm(
  values: FormValues,
  active: number,
  locale: Locale,
) {
  if (active === 0) {
    return {
      kdnr: notEmptyValidation(String(values.kdnr), t(locale, "kdnr"), locale),
    };
  }

  if (active === 1) {
    return {
      nachname: notEmptyValidation(
        String(values.nachname),
        t(locale, "lastName"),
        locale,
      ),
      vorname: notEmptyValidation(
        String(values.vorname),
        t(locale, "firstName"),
        locale,
      ),
      email: emailValidation(String(values.email), locale),
    };
  }

  if (active === 2) {
    return {
      b2bzugriff: notEmptyValidation(
        String(values.b2bzugriff),
        t(locale, "b2bAccess"),
        locale,
      ),
      b2bpwd:
        values.b2bzugriff !== "0" && String(values.b2bpwd).trim().length < 4
          ? `${t(locale, "b2bPassword")} ${t(locale, "isNecessary")}`
          : null,
    };
  }

  return {};
}
