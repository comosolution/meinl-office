export const MEINL_WEB_API =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://meinlwebapidev.meinl.loc/api"
    : "https://meinlwebapi.meinl.loc/api";
export const MEINL_DEALERS_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://dealerdev.meinl.loc/"
    : "https://dealer.meinl.de";
export const RMA_WEB_API = "https://apidev.meinl.de/MeinlWebApi/api/rma";
export const DHL_API_TOKEN =
  "https://api-sandbox.dhl.com/parcel/de/account/auth/ropc/v1/token";
export const DHL_API_RETURN_LABEL =
  "https://api-sandbox.dhl.com/parcel/de/shipping/returns/v1/orders?labelType=SHIPMENT_LABEL";
export const GLS_API =
  "https://shipit-wbm-test01.gls-group.eu:8443/backend/rs/shipments";

export const MEINL_OFFICE_SIDEBAR_KEY = "meinl.office.sidebar.collapsed";
export const MEINL_OFFICE_SOURCE_KEY = "meinl.office.source";
export const MEINL_OFFICE_SERVICE_KEY = "meinl.office.service";
export const MEINL_OFFICE_LOCALE_KEY = "meinl.office.locale";
export const MEINL_OFFICE_COMPANY_HISTORY_KEY = "meinl.office.company.recent";
export const MEINL_OFFICE_DEALER_HISTORY_KEY = "meinl.office.dealer.recent";
export const MEINL_OFFICE_PERSON_HISTORY_KEY = "meinl.office.person.recent";

export const SHORT_DATE_FORMAT = "dd.MM.yyyy";
export const LONG_DATE_FORMAT = "dd.MM.yyyy hh:mm:ss";
export const MEINL_RMA_SIDEBAR_KEY = "meinl.rma.sidebar.collapsed";
