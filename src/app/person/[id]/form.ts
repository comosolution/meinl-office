import { Person } from "../../lib/interfaces";
import { notEmptyValidation, parseDateString } from "../../lib/utils";

export const getInitialValues = (person: Person) => {
  return {
    id: person.id,
    kdnr: person.kdnr,
    vorname: person.vorname,
    nachname: person.nachname,
    name1: "",
    name2: "",
    name3: "",
    email: person.email,
    phone: person.phone,
    b2bnr: person.b2bnr,
    anrede: person.anrede,
    titel: person.titel,
    mobil: person.mobil,
    jobpos: person.jobpos,
    abteilung: person.abteilung,
    betreutvon: person.betreutvon,
    geburtsdatum: parseDateString(person.geburtsdatum) || "",
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

export type FormValues = Omit<Person, "geburtsdatum" | "zustaendig"> & {
  geburtsdatum: Date | string;
  zustaendig: string[];
};

export function validateForm(values: FormValues) {
  return {
    name1: notEmptyValidation(values.vorname, "Bitte Vornamen angeben."),
  };
}
