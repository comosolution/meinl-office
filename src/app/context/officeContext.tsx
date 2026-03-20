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
import { Company, Dealer, Person } from "../lib/interfaces";
import {
  fetchResults,
  filterByKundenart,
  safeLocaleCompare,
} from "../lib/utils";

interface OfficeContextType {
  source: string;
  setSource: Dispatch<SetStateAction<string>>;
  kundenart: string;
  setKundenart: Dispatch<SetStateAction<string>>;
  locale: "de" | "en";
  setLocale: Dispatch<SetStateAction<"de" | "en">>;
  companies: Company[];
  setCompanies: Dispatch<SetStateAction<Company[]>>;
  persons: Person[];
  setPersons: Dispatch<SetStateAction<Person[]>>;
  dealers: Dealer[];
  setDealers: Dispatch<SetStateAction<Dealer[]>>;
  loading: boolean;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const [source, setSource] = useState<string>("OFFGUT");
  const [kundenart, setKundenart] = useState<string>("all");
  const [locale, setLocale] = useState<"de" | "en">("de");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);

    const [allCompanies, allPersons, allDealers] = await Promise.all([
      fetchResults<Company>(source, "companies"),
      fetchResults<Person>(source, "persons"),
      fetchResults<Dealer>(source, "dealers"),
    ]);

    const filteredCompanies = filterByKundenart(
      allCompanies as Company[],
      kundenart,
    );
    const filteredPersons = filterByKundenart(
      allPersons as Person[],
      kundenart,
    );
    const filteredDealers = filterByKundenart(
      allDealers as Dealer[],
      kundenart,
    );

    setCompanies(
      filteredCompanies.sort((a, b) => safeLocaleCompare(a.name1, b.name1)),
    );
    setPersons(
      filteredPersons.sort((a, b) => safeLocaleCompare(a.nachname, b.nachname)),
    );
    setDealers(
      filteredDealers.sort((a, b) => safeLocaleCompare(a.name1, b.name1)),
    );

    setLoading(false);
  };

  useEffect(() => {
    const savedSource = localStorage.getItem(MEINL_OFFICE_SOURCE_KEY);
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

    getData();
  }, []);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_SOURCE_KEY, source);
    getData();
  }, [source]);

  useEffect(() => {
    localStorage.setItem(MEINL_OFFICE_KA_KEY, kundenart);
    getData();
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
        companies,
        setCompanies,
        persons,
        setPersons,
        dealers,
        setDealers,
        loading,
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
