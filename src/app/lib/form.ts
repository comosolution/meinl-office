import { Locale, t } from "./i18n";

export const notEmptyValidation = (
  value: string | undefined,
  label: string,
  locale: Locale,
) => {
  return value == undefined || value.trim().length < 1
    ? `${label} ${t(locale, "isNecessary")}`
    : null;
};

export const emailValidation = (email: string, locale: Locale) => {
  return /\S+@\S+\.\S+/.test(email) ? null : t(locale, "invalidEmail");
};
