import { Select } from "@mantine/core";
import { useState } from "react";

export function ArticleSelect({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [data, setData] = useState<{ value: string; label: string }[]>([]);

  const search = async (query: string) => {
    const res = await fetch(`/api/articles?q=${query}`);
    setData(await res.json());
  };

  return (
    <Select
      label="Artikelnummer"
      searchable
      value={value}
      error={error}
      data={data}
      onChange={(v) => v && onChange(v)}
      onSearchChange={search}
      withAsterisk
    />
  );
}
