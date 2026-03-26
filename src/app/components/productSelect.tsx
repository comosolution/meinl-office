"use client";
import { useDebounce } from "@/app/lib/hooks";
import { Loader, Select, SelectProps } from "@mantine/core";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";

interface Product {
  artnr: string;
  abez1: string;
  agew: number;
  astat: string;
  awagr1: string;
  awagr2: string;
  awagr3: string;
  awagr4: string;
  awagr5: string;
  brand: string;
}

export function ProductSelect({
  value,
  onChange,
  label,
  ...props
}: Omit<SelectProps, "data"> & {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}) {
  const { source } = useOffice();

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const getData = async () => {
      if (debouncedQuery.trim().length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: debouncedQuery, source }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const products: Product[] = await res.json();
        const productOptions = products.map((p) => ({
          label: `${p.artnr} (${p.abez1.trim()})`,
          value: p.artnr,
        }));

        setOptions(productOptions);
      } catch (err) {
        console.error("Product search failed", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [debouncedQuery]);

  return (
    <Select
      label={label}
      searchable
      clearable
      value={value}
      onChange={onChange}
      onSearchChange={setQuery}
      data={options}
      nothingFoundMessage={
        query.length < 2 ? null : loading ? "Lade..." : "Keine Ergebnisse"
      }
      rightSection={loading ? <Loader size="xs" /> : null}
      {...props}
    />
  );
}
