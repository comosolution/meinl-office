import { useOffice } from "@/app/context/officeContext";
import { Company, Person } from "@/app/lib/interfaces";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

export function useFetchCompany() {
  const { source } = useOffice();
  return async (kdnr: string): Promise<Company | undefined> => {
    const response = await fetch("/api/company/", {
      method: "POST",
      body: JSON.stringify({ kdnr, source }),
    });

    if (!response.ok) {
      notifications.show({
        id: `error-${kdnr}`,
        title: `Error ${response.status}`,
        message: (await response.text()) || "",
        autoClose: false,
      });
      return;
    }

    const company = await response.json();
    return Array.isArray(company) ? company[0] : company;
  };
}

export function useFetchPerson() {
  const { source } = useOffice();
  return async (id: string): Promise<Person | undefined> => {
    const response = await fetch("/api/person", {
      method: "POST",
      body: JSON.stringify({ b2bnr: id, source }),
    });

    if (!response.ok) {
      notifications.show({
        id: `error-${id}`,
        title: `Error ${response.status}`,
        message: (await response.text()) || "",
        autoClose: false,
      });
      return;
    }

    const person: Person = await response.json();
    return Array.isArray(person) ? person[0] : person;
  };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
