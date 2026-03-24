export interface Dealer {
  id: number;
  kdnr: string;
  kundenart: number;
  name1: string;
  name2: string;
  brand: string;
  dealerloc: boolean;
  plz: string;
  ort: string;
  land: string;
}

export interface DealerInStorage {
  id: string;
  kdnr: string;
  kundenart: number;
  name: string;
  source: string;
}

export interface Company {
  id: number;
  kdnr: string;
  kundenart: number;
  kundenartText: string;
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
  logo: string;
  youtube: string;
  facebook: string;
  instagram: string;
  matchcode: string;
  dealerloc: boolean;
  distributor: boolean;
  brands: Brand[];
  latitude: number;
  longitude: number;
  personen: Person[];
  campagnen: Campaign[];
  haendler: Company[];
  versandadressen: Versandadresse[];
}

export interface CompanyInStorage {
  kdnr: string;
  kundenart: number;
  name: string;
  source: string;
}

export interface Person {
  id: number;
  kdnr: string;
  kundenart: number;
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
  musikri: string;
  instrument: string;
  zustaendig: string;
  b2bzugriff: string;
  b2bdltyp: string;
  b2bdldis: boolean;
}

export interface PersonInStorage {
  id: string;
  kdnr: string;
  kundenart: number;
  vorname: string;
  nachname: string;
  position: string;
  company?: string;
  source: string;
}

export interface Campaign {
  id: number;
  salt: string | null;
  brand: string;
  title: string;
  description: string;
  start: string | null | Date;
  end: string | null | Date;
  dealers: Dealer[];
  products: Product[];
}

export interface Product {
  artnr: string;
  artbez: string;
}

export interface Brand {
  title: string;
  url: string | null;
  sort: number;
}

export interface TicketSummary {
  superticket: string;
  nr: string;
  status_int: Status;
  status_ext: Status;
  kdnr: string;
  kdnr_full: string;
  created: string;
  modified: string;
  updatedby: string;
  createdby: string;
  artnr_ku: string;
  artnr_mei: string;
  artnr: string;
  kdnr_name: string;
}

export interface Ticket {
  superticket: string;
  nr: string;
  status_int: Status;
  status_ext: Status;
  kdnr: string;
  kdnr_full: string;
  kdnr_name: string;
  updatedby: string;
  createdby: string;
  created: string;
  modified: string;
  artnr_ku: string;
  artnr_mei: string;
  descr: string;
  cur_owner: string;
  auftr_art: string;
  url: string;
  sernr_ku: string;
  sernr_mei: string;
  menge: number;
  rgnr: number;
  rgnrimpt: string;
  source: string;
  ct_import: string;
  nr_kunde: string;
  optemail: string;
  mediumpath: string;
  person: Person | null;
  versandadresse: Versandadresse;
  tracking: Tracking | null;
  files: Attachment[] | null;
  fileinfo: FileInfo[];
  history: HistoryEntry[];
}

export interface Status {
  nr: string;
  text: string;
  scope: "Intern" | "Extern" | string;
}

export interface Versandadresse {
  vanr: string;
  vaname: string;
  vaname2: string | null;
  vaname3: string | null;
  vastrasse: string;
  vaplz: string;
  vaort: string;
  valand: string;
  zusatz: string | null;
}

export interface Attachment {
  lfdn: string;
  status: string;
  filename: string;
  created: string;
  createdBy: string;
}

export interface Tracking {
  versender: string;
  sendungnr: string;
  label: string;
}

export interface FileInfo {
  ticketnr: string;
  ldfn: number;
  filename: string;
}

export interface HistoryEntry {
  ticketnr: string;
  created: string;
  createdBy: string;
  comment: string;

  status_int: Status;
  status_ext: Status;

  tracknr: string;
  source: string;
  public: number;
}

export interface Person {
  [key: string]: unknown;
}

export interface Order {
  KUNDENNUMMER: number;
  AUFTRAGSSTATUS: string;
  AUFTRAGSNUMMER: number;
  BESTELLDATUMDESKUNDEN: string;
}

export interface TicketFormValues {
  kdnr: string;
  kdnr_full?: string | null;
  kdnr_name: string;
  artnr_ku: string;
  sernr_ku?: string;
  descr: string;
  files: File[];
  menge: number;
  vanr: string;
  vaname: string;
  vaname2: string;
  vaname3: string;
  vastrasse: string;
  vaplz: string;
  vaort: string;
  valand: string;
  zusatz?: string;
}

export interface FileUpload {
  Filename: string;
  Data: string;
}

export interface CreateTicketPayload {
  nr: string;
  kdnr: string;
  kdnr_full: string;
  updatedby: string;
  createdby: string;
  artnr_ku: string;
  artnr_mei?: string;
  sernr_ku?: string;
  sernr_mei?: string;
  descr: string;
  menge: number;
  source: string;
  versandadresse: {
    vanr: string;
    vaname: string;
    vaname2?: string | null;
    vaname3?: string | null;
    vastrasse: string;
    vaplz: string;
    vaort: string;
    valand: string;
    zusatz?: string | null;
  };
  Files: FileUpload[] | null;
}
