export const MEINL_WEB_API =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? "https://api.meinl.loc/MeinlWebApi/api"
    : "https://apidev.meinl.de/MeinlWebApi/api";
export const MEINL_OFFICE_SIDEBAR_KEY = "meinl.office.sidebar.collapsed";
export const MEINL_OFFICE_COMPANY_HISTORY_KEY = "meinl.office.company.recent";
export const MEINL_OFFICE_DEALER_HISTORY_KEY = "meinl.office.dealer.recent";
export const MEINL_OFFICE_PERSON_HISTORY_KEY = "meinl.office.person.recent";
