export interface Company {
  id: number;
  kdnr: string;
  type: string;
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
  id: number;
  kdnr: string;
  vorname: string;
  nachname: string;
  name1: string;
  name2: string;
  name3: string;
  plz: string;
  ort: string;
  strasse: string;
  land: string;
  plzpr: string;
  ortpr: string;
  strassepr: string;
  landpr: string;
  email: string;
  phone: string;
  fax: string;
  b2bnr: string;
  anrede: string;
  titel: string;
  mobil: string;
  jobpos: string;
  abteilung: string;
  betreutvon: string;
  gebdat: string;
  famstand: string;
  tshirt: string;
  hobbies: string;
  musikrichtung: string;
  instrument: string;
  zustaendig: string;
}

export interface PersonInStorage {
  id: string;
  kdnr: string;
  vorname: string;
  nachname: string;
  position: string;
  company?: string;
}

export interface Campaign {
  id: number;
  brand: string;
  title: string;
  description: string;
  start: string | null;
  end: string | null;
  dealers: string[];
}
