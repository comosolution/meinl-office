import { Person } from "../../lib/interfaces";
import { notEmptyValidation, parseDateString } from "../../lib/utils";

export const getInitialValues = (person: Person) => {
  return {
    kdnr: person.kdnr,
    vorname: person.vorname,
    nachname: person.nachname,
    email: person.email,
    telefon: person.telefon,
    b2bnr: person.b2bnr,
    anrede: person.anrede,
    titel: person.titel,
    mobil: person.mobil,
    position: person.position,
    abteilung: person.abteilung,
    betreutvon: person.betreutvon,
    geburtsdatum: parseDateString(person.geburtsdatum) || "",
    familienstand: person.familienstand,
    tshirt: person.tshirt,
    hobbies: person.hobbies,
    musikrichtung: person.musikrichtung,
    instrument: person.instrument,
    zustaendig: person.zustaendig,
  };
};

export type FormValues = Omit<Person, "geburtsdatum"> & {
  geburtsdatum: Date | string;
};

export function validateForm(values: FormValues) {
  return {
    name1: notEmptyValidation(values.vorname, "Bitte Vornamen angeben."),
  };
}
