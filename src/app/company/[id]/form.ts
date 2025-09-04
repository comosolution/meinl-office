import { Company } from "../../lib/interfaces";
import { notEmptyValidation } from "../../lib/utils";

export const getInitialValues = (company: Company) => {
  let brands: string[] = [];

  if (typeof company.brands === "string") {
    brands = company.brands
      ? company.brands.split(",").map((b) => b.trim())
      : [];
  } else if (Array.isArray(company.brands)) {
    brands = company.brands.map((b) => b.trim());
  }

  return {
    kdnr: company.kdnr || 0,
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
    brands,
    latitude: company.latitude || 0,
    longitude: company.longitude || 0,
    personen: company.personen || [],
  };
};

export function validateForm(values: Company) {
  return {
    name1: notEmptyValidation(values.name1, "Bitte Firmennamen angeben."),
  };
}
