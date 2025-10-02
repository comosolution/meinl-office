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
import { Company, Person } from "../lib/interfaces";
import { fetchResults } from "../lib/utils";

interface OfficeContextType {
  companies: Company[];
  setCompanies: Dispatch<SetStateAction<Company[]>>;
  persons: Person[];
  setPersons: Dispatch<SetStateAction<Person[]>>;
  loading: boolean;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const [allCompanies, allPersons] = await Promise.all([
        fetchResults<Company>("companies"),
        fetchResults<Person>("persons"),
      ]);

      setCompanies(
        (allCompanies as Company[]).sort((a, b) =>
          a.name1.localeCompare(b.name1)
        )
      );
      setPersons(
        (allPersons as Person[]).sort((a, b) =>
          a.nachname.localeCompare(b.nachname)
        )
      );
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <OfficeContext.Provider
      value={{
        companies,
        setCompanies,
        persons,
        setPersons,
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
