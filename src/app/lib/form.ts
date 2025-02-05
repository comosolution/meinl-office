import { Company } from "./interfaces";
import { notEmptyValidation } from "./utils";

export const getInitialValues = (company: Company) => {
  return {
    kdnr: company.kdnr,
    name1: company.name1,
    name2: company.name2,
    name3: company.name3,
    plz: company.plz,
    ort: company.ort,
    strasse: company.strasse,
    land: company.land,
    telefon: company.telefon,
    email: company.email,
    wkz: company.wkz,
    netto: company.netto,
    kundenart: company.kundenart,
    matchcode: company.matchcode,
  };
};

export interface FormValues {
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
}

export function validateForm(values: FormValues) {
  return {
    name1: notEmptyValidation(values.name1, "Bitte Firmennamen angeben."),
  };
}
