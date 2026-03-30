"use client";

import { useOffice } from "@/app/context/officeContext";
import { useDebounce } from "@/app/lib/hooks";
import { Dealer } from "@/app/lib/interfaces";
import { fetchResults } from "@/app/lib/utils";
import { Loader, Select, SelectProps } from "@mantine/core";
import { useEffect, useState } from "react";

export function CustomerSelect({
  value,
  onChange,
  ...props
}: Omit<SelectProps, "data"> & {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const { source } = useOffice();

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const getData = async () => {
      if (debouncedQuery.trim().length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);

      try {
        const allCompanies = await fetchResults<Dealer>(
          source,
          "B2B",
          "companies",
          debouncedQuery,
        );

        const mapped = allCompanies
          .filter((c) => c.name1)
          .slice(0, 20)
          .map((c) => ({
            label: `${c.name1} (${c.kdnr})`,
            value: c.kdnr.toString(),
          }));

        setOptions(mapped);
      } catch (err) {
        console.error("Customer search failed", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [debouncedQuery, source]);

  return (
    <Select
      label="Firma"
      placeholder="Name oder Kdnr eingeben"
      searchable
      clearable
      value={value}
      onChange={onChange}
      onSearchChange={setQuery}
      data={options}
      nothingFoundMessage={
        query.length < 2
          ? "Bitte mindestens 2 Zeichen eingeben"
          : loading
            ? "Lade..."
            : "Keine Ergebnisse"
      }
      rightSection={loading ? <Loader size="xs" /> : null}
      {...props}
    />
  );
}
