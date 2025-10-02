import { Person } from "../../lib/interfaces";
import { notEmptyValidation, parseDateString } from "../../lib/utils";

export const getInitialValues = (person: Person) => {
  return {
    id: person.id,
    kdnr: person.kdnr,
    vorname: person.vorname,
    nachname: person.nachname,
    name1: person.name1,
    name2: person.name2,
    name3: person.name3,
    plz: person.plz,
    ort: person.ort,
    strasse: person.strasse,
    land: person.land,
    plzpr: person.plzpr,
    ortpr: person.ortpr,
    strassepr: person.strassepr,
    landpr: person.landpr,
    email: person.email,
    phone: person.phone,
    fax: person.fax,
    b2bnr: person.b2bnr,
    anrede: person.anrede,
    titel: person.titel,
    mobil: person.mobil,
    jobpos: person.jobpos,
    abteilung: person.abteilung,
    betreutvon: person.betreutvon,
    gebdat: parseDateString(person.gebdat) || "",
    famstand: person.famstand,
    tshirt: person.tshirt,
    hobbies: person.hobbies,
    musikrichtung: person.musikrichtung,
    instrument: person.instrument,
    zustaendig: person.zustaendig
      ? person.zustaendig.split(",").map((c) => c.trim())
      : [],
  };
};

export type FormValues = Omit<Person, "gebdat" | "zustaendig"> & {
  gebdat: Date | string;
  zustaendig: string[];
};

export function validateForm(values: FormValues) {
  return {
    name1: notEmptyValidation(values.vorname, "Bitte Vornamen angeben."),
  };
}
