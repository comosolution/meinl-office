"use client";
import { useOffice } from "@/app/context/officeContext";
import { useDebounce } from "@/app/lib/hooks";
import { Company } from "@/app/lib/interfaces";
import { fetchResults } from "@/app/lib/utils";
import { Loader, Select, SelectProps, Text } from "@mantine/core";
import { useEffect, useState } from "react";

type CustomerOption = {
  label: string;
  value: string;
  kundenart: number;
};

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
  const [options, setOptions] = useState<CustomerOption[]>([]);
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
        const allCompanies = await fetchResults<Company>(
          source,
          "B2B",
          "companies",
          debouncedQuery,
        );
        const mapped: CustomerOption[] =
          allCompanies
            ?.filter((c) => c.name1)
            .slice(0, 20)
            .map((c) => ({
              label: `${c.name1} (${c.kdnr} – ${c.matchcode})`,
              value: c.kdnr.toString(),
              kundenart: c.kundenart,
            })) ?? [];
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
      renderOption={({ option }) => {
        const isRed = (option as CustomerOption).kundenart === 30;
        return (
          <Text size="sm" c={isRed ? "red" : undefined}>
            {option.label}
          </Text>
        );
      }}
      nothingFoundMessage={
        query.length < 2
          ? "Bitte mindestens 2 Zeichen eingeben"
          : loading
            ? "Lade..."
            : "Keine Ergebnisse"
      }
      checkIconPosition="right"
      rightSection={loading ? <Loader size="xs" /> : null}
      {...props}
    />
  );
}
