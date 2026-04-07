import { customerTypes } from "@/app/lib/data";
import { Company } from "../../lib/interfaces";
import { notEmptyValidation } from "../../lib/utils";

export const getInitialValues = (company: Company) => {
  return {
    id: company.id,
    kdnr: company.kdnr || "",
    kundenart: company.kundenart || 0,
    kundenartText: company.kundenartText || "",
    type: customerTypes[company.type] || "",
    name1: company.name1 || "",
    name2: company.name2 || "",
    name3: company.name3 || "",
    plz: company.plz || "",
    ort: company.ort || "",
    strasse: company.strasse || "",
    land: company.land || "",
    telefon: company.telefon || "",
    fax: company.fax || "",
    mailadr: company.mailadr || "",
    www: company.www || "",
    logo: company.logo || "",
    youtube: company.youtube || "",
    facebook: company.facebook || "",
    instagram: company.instagram || "",
    matchcode: company.matchcode || "",
    dealerloc: company.dealerloc || false,
    expCenter: company.expCenter || false,
    distributor: company.distributor || false,
    brands: company.brands || [],
    latitude: company.latitude || 0,
    longitude: company.longitude || 0,
    personen: company.personen || [],
    campagnen: company.campagnen || [],
    haendler: company.haendler || [],
    versandadressen: company.versandadressen || [],
  };
};

export function validateForm(values: Company) {
  return {
    name1: notEmptyValidation(values.name1, "Bitte Firmennamen angeben."),
  };
}
