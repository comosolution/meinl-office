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
  mailadr: string;
  www: string;
  matchcode: string;
  dealerloc: boolean;
  distributor: boolean;
  brands: string | string[];
  latitude: number;
  longitude: number;
  personen: Person[];
  campagnen: Campaign[];
  haendler: Company[];
}

export interface CompanyInStorage {
  kdnr: string;
  name: string;
}

export interface Person {
  kdnr: number;
  vorname: string;
  nachname: string;
  name1: string;
  name2: string;
  name3: string;
  email: string;
  telefon: string;
  b2bnr: string;
  anrede: string;
  titel: string;
  mobil: string;
  jobpos: string;
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

export interface PersonInStorage {
  kdnr: string;
  vorname: string;
  nachname: string;
  position: string;
}

export interface Campaign {
  id: number;
  brand: string;
  title: string;
  description: string;
  start: string | null;
  end: string | null;
  dealers: number[];
}
