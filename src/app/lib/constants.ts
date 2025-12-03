export const MEINL_WEB_API =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://meinlwebapidev.meinl.loc/api"
    : "https://meinlwebapi.meinl.loc/api";
export const MEINL_DEALERS_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://dealerdev.meinl.loc/"
    : "https://dealer.meinl.de";
export const MEINL_OFFICE_SIDEBAR_KEY = "meinl.office.sidebar.collapsed";
export const MEINL_OFFICE_COMPANY_HISTORY_KEY = "meinl.office.company.recent";
export const MEINL_OFFICE_DEALER_HISTORY_KEY = "meinl.office.dealer.recent";
export const MEINL_OFFICE_PERSON_HISTORY_KEY = "meinl.office.person.recent";
