import { Person } from "../../lib/interfaces";
import { parseDateString } from "../../lib/utils";

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
    land: person.land || "",
    plzpr: person.plzpr || "",
    ortpr: person.ortpr || "",
    strassepr: person.strassepr || "",
    landpr: person.landpr || "D",
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
  };
};

export type FormValues = Omit<Person, "gebdat" | "zustaendig"> & {
  gebdat: Date | null;
  zustaendig: string[];
  b2bdltyp: string[];
};

export function validateForm(values: FormValues, active?: number) {
  if (active === 0) {
    return {
      kdnr: values.kdnr ? null : "Firma ist erforderlich",
    };
  }

  if (active === 1) {
    return {
      anrede: values.anrede ? null : "Anrede ist erforderlich",
      nachname: values.nachname ? null : "Nachname ist erforderlich",
      vorname: values.vorname ? null : "Vorname ist erforderlich",
      email: values.email ? null : "E-Mail ist erforderlich",
    };
  }

  return {};
}
