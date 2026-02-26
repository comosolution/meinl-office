import { Select } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useOffice } from "../context/officeContext";
import { Person } from "../lib/interfaces";

export function ContactSelect({
  customerId,
  value,
  onChange,
  onSelectPerson,
  error,
}: {
  customerId: string;
  value: string;
  onChange: (value: string) => void;
  onSelectPerson?: (person: Person) => void;
  error?: string;
}) {
  const { persons } = useOffice();
  const [data, setData] = useState<
    { value: string; label: string; person: Person }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [internalValue, setInternalValue] = useState<string>("");

  const personsByCustomer = useMemo(() => {
    if (!customerId) return [];
    return persons.filter((p) => String(p.kdnr) === String(customerId));
  }, [customerId]);

  // Sync external value (b2bnr) to internal value (id)
  useEffect(() => {
    if (value) {
      const person = personsByCustomer.find((p) => p.b2bnr === value);
      setInternalValue(person ? person.id.toString() : "");
    } else {
      setInternalValue("");
    }
  }, [value, personsByCustomer]);

  useEffect(() => {
    if (!customerId) {
      setData([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = personsByCustomer
      .filter(
        (person) =>
          person.b2bnr?.toLowerCase().includes(query) ||
          person.nachname?.toLowerCase().includes(query) ||
          person.vorname?.toLowerCase().includes(query) ||
          person.email?.toLowerCase().includes(query),
      )
      .map((person) => ({
        value: person.id.toString(),
        label: `${person.b2bnr} – ${person.vorname} ${person.nachname}`,
        person,
      }));

    setData(filtered);
  }, [searchQuery, customerId, personsByCustomer]);

  const handleChange = (selectedValue: string | null) => {
    if (selectedValue) {
      const person = personsByCustomer.find(
        (p) => p.id.toString() === selectedValue,
      );
      if (person) {
        onChange(person.b2bnr);
        if (onSelectPerson) {
          onSelectPerson(person);
        }
      }
    }
  };

  return (
    <Select
      label="Name der Kontaktperson"
      searchable
      clearable
      value={internalValue}
      error={error}
      data={data}
      onChange={handleChange}
      onSearchChange={setSearchQuery}
      checkIconPosition="right"
      withAsterisk
    />
  );
}
