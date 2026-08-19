import { useOffice } from "@/app/context/officeContext";
import { Company, Person } from "@/app/lib/interfaces";
import { getErrorMessage } from "@/app/lib/utils";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
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
        message: getErrorMessage(await response.text()),
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
        message: getErrorMessage(await response.text()),
      });
      return;
    }

    const person: Person = await response.json();
    return Array.isArray(person) ? person[0] : person;
  };
}

export function useFetchResults() {
  const { source, service } = useOffice();
  const { data: session } = useSession();

  const user = session?.user?.name ?? "";

  return async <T,>(
    type: "companies" | "persons" | "dealers",
    query?: string,
    zustaendig?: string,
    land?: string,
    signal?: AbortSignal,
  ): Promise<T[]> => {
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({
        type,
        search: query?.replaceAll("'", " ") || " ",
        zustaendig,
        land,
        source,
        service,
        user,
      }),
      signal,
    });

    if (!res.ok) return [];

    return res.json();
  };
}

interface CleverReachPerson {
  email: string;
  vorname?: string;
  nachname?: string;
  name1?: string;
}

export function useCleverReachExport() {
  const [exporting, setExporting] = useState(false);

  const exportToCleverReach = async (
    name: string,
    persons: CleverReachPerson[],
  ): Promise<boolean> => {
    setExporting(true);
    try {
      const response = await fetch("/api/mailing/cleverreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          persons: persons.map((p) => ({
            email: p.email,
            vorname: p.vorname,
            nachname: p.nachname,
            name1: p.name1,
          })),
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to export to CleverReach:",
          await response.text(),
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error exporting to CleverReach:", error);
      return false;
    } finally {
      setExporting(false);
    }
  };

  return { exporting, exportToCleverReach };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
