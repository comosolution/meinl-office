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

interface OfficeContextType {
  companies: Company[];
  setCompanies: Dispatch<SetStateAction<Company[]>>;
  employees: Person[];
  setEmployees: Dispatch<SetStateAction<Person[]>>;
  loading: boolean;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    setLoading(true);
    const response = await fetch("/api/customer", {
      method: "GET",
    });
    const allCompanies = await response.json();
    const sortedCompanies = (allCompanies as Company[]).sort((a, b) =>
      a.name1.localeCompare(b.name1)
    );
    setCompanies(sortedCompanies);
    setLoading(false);
  };

  useEffect(() => {
    const allEmployees = companies.flatMap((c) => c.personen);
    const sortedEmployees = (allEmployees as Person[]).sort((a, b) =>
      a.nachname.localeCompare(b.nachname)
    );
    setEmployees(sortedEmployees);
  }, [companies]);

  return (
    <OfficeContext.Provider
      value={{
        companies,
        setCompanies,
        employees,
        setEmployees,
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
