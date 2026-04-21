"use client";
import { useDebounce } from "@/app/lib/hooks";
import { Loader, Select, SelectProps } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Product } from "../lib/interfaces";

export function ProductSelect({
  value,
  onChange,
  onProductSelect,
  ...props
}: Omit<SelectProps, "data"> & {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  onProductSelect?: (product: Product) => void;
}) {
  const { locale, source } = useOffice();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const selectingRef = useRef(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const getData = async () => {
      if (selectingRef.current) {
        selectingRef.current = false;
        setOptions([]);
        return;
      }

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
        setProducts(products);
        const productOptions = products.map((p) => ({
          label: `${p.artnr.trim()} (${p.abez1.trim().replace(/\s+/g, " ")})`,
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
      searchable
      clearable
      value={value}
      onChange={(val) => {
        selectingRef.current = true;
        onChange(val);
        if (val && onProductSelect) {
          const product = products.find((p) => p.artnr === val);
          if (product) onProductSelect(product);
        }
      }}
      onSearchChange={setQuery}
      data={options}
      nothingFoundMessage={
        query.length < 2
          ? t(locale, "enterAtLeast2Chars")
          : loading
            ? t(locale, "loading")
            : t(locale, "noResults")
      }
      checkIconPosition="right"
      rightSection={loading ? <Loader size="xs" /> : null}
      {...props}
    />
  );
}
