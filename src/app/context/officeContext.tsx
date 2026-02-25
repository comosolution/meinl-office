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
import { Company, Dealer, Person } from "../lib/interfaces";
import { fetchResults, safeLocaleCompare } from "../lib/utils";

interface OfficeContextType {
  source: string;
  setSource: Dispatch<SetStateAction<string>>;
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const [allCompanies, allPersons, allDealers] = await Promise.all([
        fetchResults<Company>(source, "companies"),
        fetchResults<Person>(source, "persons"),
        fetchResults<Dealer>(source, "dealers"),
      ]);

      setCompanies(
        (allCompanies as Company[]).sort((a, b) =>
          safeLocaleCompare(a.name1, b.name1),
        ),
      );
      setPersons(
        (allPersons as Person[]).sort((a, b) =>
          safeLocaleCompare(a.nachname, b.nachname),
        ),
      );
      setDealers(
        (allDealers as Dealer[]).sort((a, b) =>
          safeLocaleCompare(a.name1, b.name1),
        ),
      );

      setLoading(false);
    };

    getData();
  }, []);

  return (
    <OfficeContext.Provider
      value={{
        source,
        setSource,
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
