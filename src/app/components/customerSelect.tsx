import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { Company } from "../lib/interfaces";

export function CustomerSelect({
  value,
  onChange,
  onSelectCompany,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelectCompany?: (company: Company) => void;
  error?: string;
}) {
  const { companies } = useOffice();
  const [data, setData] = useState<{ value: string; label: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setData([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = companies
      .filter(
        (company) =>
          company.kdnr?.toString().includes(query) ||
          company.name1?.toLowerCase().includes(query) ||
          company.matchcode?.toLowerCase().includes(query),
      )
      .map((company) => ({
        value: company.kdnr.toString(),
        label: `${company.kdnr} – ${company.name1}`,
        company,
      }));

    setData(filtered);
  }, [companies, searchQuery]);

  const handleChange = (selectedValue: string | null) => {
    if (selectedValue) {
      onChange(selectedValue);
      const company = companies.find(
        (c) => c.kdnr.toString() === selectedValue,
      );
      if (company && onSelectCompany) {
        onSelectCompany(company);
      }
    }
  };

  return (
    <Select
      label="Kunde"
      placeholder="Kundennummer oder Name eingeben"
      searchable
      clearable
      value={value}
      error={error}
      data={data}
      onChange={handleChange}
      onSearchChange={setSearchQuery}
      withAsterisk
    />
  );
}
