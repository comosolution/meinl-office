import { isPreview } from "./utils";

export const MEINL_WEB_API = isPreview
  ? "https://meinlwebapidev.meinl.loc/api"
  : "https://meinlwebapi.meinl.loc/api";

export const MEINL_DEALERS_URL = isPreview
  ? "https://dealerdev.meinl.loc"
  : "https://dealer.meinl.de";
export const MEINL_AE_URL = "https://apidev.meinl.de/aeblazorbeta";
export const MEINL_AE_USA_URL = isPreview
  ? "https://apidev.meinl.de/us/aeblazorbetaus"
  : "http://order.meinlusa.com";

export const DHL_API_TOKEN = isPreview
  ? "https://api-sandbox.dhl.com/parcel/de/account/auth/ropc/v1/token"
  : "https://api-eu.dhl.com/parcel/de/account/auth/ropc/v1/token";
export const DHL_API_RETURN_LABEL = isPreview
  ? "https://api-sandbox.dhl.com/parcel/de/shipping/returns/v1/orders?labelType=SHIPMENT_LABEL"
  : "https://api-eu.dhl.com/parcel/de/shipping/returns/v1/orders?labelType=SHIPMENT_LABEL";
export const DHL_TRACKING_URL =
  "https://www.dhl.com/de-de/home/tracking.html?submit=1&tracking-id=";

export const GLS_API = isPreview
  ? "https://shipit-wbm-test01.gls-group.eu:8443/backend/rs/shipments"
  : "https://shipit-wbm-de02.gls-group.eu/backend/rs/shipments";

export const MEINL_OFFICE_SIDEBAR_KEY = "meinl.office.sidebar.collapsed";
export const MEINL_OFFICE_SERVICE_KEY = "meinl.office.service";
export const MEINL_OFFICE_LOCALE_KEY = "meinl.office.locale";
export const MEINL_OFFICE_LIMIT_KEY = "meinl.office.limit";
export const MEINL_OFFICE_WELCOME_KEY = "meinl.office.welcome";
export const MEINL_OFFICE_COMPANY_HISTORY_KEY = "meinl.office.company.recent";
export const MEINL_OFFICE_DEALER_HISTORY_KEY = "meinl.office.dealer.recent";
export const MEINL_OFFICE_PERSON_HISTORY_KEY = "meinl.office.person.recent";
export const MEINL_OFFICE_ORDER_FILTER_KEY = "meinl.office.order.filter";
export const MEINL_RMA_VIEW_KEY = "meinl.rma.view";
export const MEINL_RMA_TICKET_KEY = "meinl.rma.ticket.recent";

export const DATE_FORMAT = "dd.MM.yyyy HH:mm:ss";
