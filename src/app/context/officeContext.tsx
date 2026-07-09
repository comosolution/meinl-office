"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { MEINL_OFFICE_LOCALE_KEY, MEINL_OFFICE_SERVICE_KEY } from "../lib/config";
import { isPreview } from "../lib/utils";

const SOURCE_BY_PREFIX = { de: "OFFGUT", us: "OFFUSA" } as const;
const PREFIX_BY_SOURCE = { OFFGUT: "de", OFFUSA: "us" } as const;

// Routes gated to a single source (mirrors the `hidden` flags in sidebar.tsx's nav).
const SOURCE_RESTRICTED_ROUTES: Record<string, "OFFGUT" | "OFFUSA"> = {
  campaign: "OFFGUT",
  ticket: "OFFGUT",
  ...(isPreview ? {} : { order: "OFFUSA" }),
};

interface OfficeContextType {
  source: "OFFGUT" | "OFFUSA";
  sourcePrefix: "de" | "us";
  setSource: (source: "OFFGUT" | "OFFUSA") => void;
  service: string;
  setService: Dispatch<SetStateAction<string>>;
  locale: "de" | "en";
  setLocale: Dispatch<SetStateAction<"de" | "en">>;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams<{ source: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const sourcePrefix = params.source === "us" ? "us" : "de";
  const source = SOURCE_BY_PREFIX[sourcePrefix];

  const [service, setService] = useState<string>("B2B");
  const [locale, setLocale] = useState<"de" | "en">("de");

  useEffect(() => {
    const savedService = localStorage.getItem(MEINL_OFFICE_SERVICE_KEY);
    if (savedService !== null) {
      setService(savedService);
    }

    const savedLocale = localStorage.getItem(MEINL_OFFICE_LOCALE_KEY) as
      | "de"
      | "en"
      | null;
    if (savedLocale === "de" || savedLocale === "en") {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language?.split("-")[0];
      setLocale(browserLang === "en" ? "en" : "de");
    }
  }, []);

  useEffect(() => {
    if (source === "OFFUSA" && service !== "B2B") {
      setService("B2B");
    }
    if (source === "OFFUSA" && locale !== "en") {
      setLocale("en");
    }
  }, [source]);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_SERVICE_KEY, service);
  }, [service]);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_LOCALE_KEY, locale);
  }, [locale]);

  const setSource = (nextSource: "OFFGUT" | "OFFUSA") => {
    const nextPrefix = PREFIX_BY_SOURCE[nextSource];
    const rest = pathname.replace(/^\/(de|us)/, "");
    const topSegment = rest.split("/")[1];
    const restrictedTo = topSegment && SOURCE_RESTRICTED_ROUTES[topSegment];

    if (restrictedTo && restrictedTo !== nextSource) {
      router.push(`/${nextPrefix}`);
    } else {
      router.push(`/${nextPrefix}${rest}`);
    }
  };

  return (
    <OfficeContext.Provider
      value={{
        source,
        sourcePrefix,
        setSource,
        service,
        setService,
        locale,
        setLocale,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
};

export const useOffice = (): OfficeContextType => {
  const context = useContext(OfficeContext);
  if (!context) {
    throw new Error("useOffice must be used within an OfficeContext");
  }
  return context;
};
