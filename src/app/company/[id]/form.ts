import { Company } from "../../lib/interfaces";
import { notEmptyValidation } from "../../lib/utils";

export const getInitialValues = (company: Company) => {
  return {
    id: company.id,
    kdnr: company.kdnr || "",
    type: company.type || "",
    name1: company.name1 || "",
    name2: company.name2 || "",
    name3: company.name3 || "",
    plz: company.plz || "",
    ort: company.ort || "",
    strasse: company.strasse || "",
    land: company.land || "",
    telefon: company.telefon || "",
    mailadr: company.mailadr || "",
    www: company.www || "",
    matchcode: company.matchcode || "",
    dealerloc: company.dealerloc || false,
    distributor: company.distributor || false,
    brands: company.brands || [],
    latitude: company.latitude || 0,
    longitude: company.longitude || 0,
    personen: company.personen || [],
    campagnen: company.campagnen || [],
    haendler: company.haendler || [],
  };
};

export function validateForm(values: Company) {
  return {
    name1: notEmptyValidation(values.name1, "Bitte Firmennamen angeben."),
  };
}
