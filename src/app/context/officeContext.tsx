"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  MEINL_OFFICE_KA_KEY,
  MEINL_OFFICE_LOCALE_KEY,
  MEINL_OFFICE_SOURCE_KEY,
} from "../lib/constants";

interface OfficeContextType {
  source: "OFFGUT" | "OFFUSA";
  setSource: Dispatch<SetStateAction<"OFFGUT" | "OFFUSA">>;
  kundenart: string;
  setKundenart: Dispatch<SetStateAction<string>>;
  locale: "de" | "en";
  setLocale: Dispatch<SetStateAction<"de" | "en">>;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const [source, setSource] = useState<"OFFGUT" | "OFFUSA">("OFFGUT");
  const [kundenart, setKundenart] = useState<string>("all");
  const [locale, setLocale] = useState<"de" | "en">("de");

  useEffect(() => {
    const savedSource = localStorage.getItem(MEINL_OFFICE_SOURCE_KEY) as
      | "OFFGUT"
      | "OFFUSA"
      | null;
    if (savedSource !== null) {
      setSource(savedSource);
    }

    const savedKundenart = localStorage.getItem(MEINL_OFFICE_KA_KEY);
    if (savedKundenart !== null) {
      setKundenart(savedKundenart);
    }

    const savedLocale = localStorage.getItem(MEINL_OFFICE_LOCALE_KEY) as
      | "de"
      | "en"
      | null;
    if (savedLocale === "de" || savedLocale === "en") {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_SOURCE_KEY, source);
  }, [source]);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_KA_KEY, kundenart);
  }, [kundenart]);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_LOCALE_KEY, locale);
  }, [locale]);

  return (
    <OfficeContext.Provider
      value={{
        source,
        setSource,
        kundenart,
        setKundenart,
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
