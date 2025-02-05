"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import companyData from "../data/companies.json";
import employeeData from "../data/employees.json";
import { Company, Person } from "../lib/interfaces";

interface OfficeContextType {
  companies: Company[];
  setCompanies: Dispatch<SetStateAction<Company[]>>;
  employees: Person[];
  setEmployees: Dispatch<SetStateAction<Person[]>>;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export const OfficeProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>(
    (companyData as Company[]).sort((a, b) => a.name1.localeCompare(b.name1))
  );
  const [employees, setEmployees] = useState<Person[]>(
    (employeeData as Person[]).sort((a, b) =>
      a.nachname.localeCompare(b.nachname)
    )
  );

  // useEffect(() => {
  //   getCompanies();
  // }, []);

  // const getCompanies = async () => {
  //   const response = await fetch("/api/companies", {
  //     method: "GET",
  //   });
  //   const companies = await response.json();
  //   setData(companies);
  // };

  return (
    <OfficeContext.Provider
      value={{
        companies,
        setCompanies,
        employees,
        setEmployees,
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
