export interface Company {
  kdnr: number;
  name1: string;
  name2: string;
  name3: string;
  plz: string;
  ort: string;
  strasse: string;
  land: string;
  telefon: string;
  email: string;
  wkz: string;
  netto: number;
  kundenart: number;
  matchcode: string;
  personen: Person[];
}

export interface Person {
  kdnr: number;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  b2bnr: string;
  anrede: string;
  titel: string;
  mobil: string;
  position: string;
  abteilung: string;
  betreutvon: string;
  geburtsdatum: string;
  familienstand: string;
  tshirt: string;
  hobbies: string;
  musikrichtung: string;
  instrument: string;
  zustaendig: string;
}
