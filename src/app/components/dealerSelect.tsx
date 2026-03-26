"use client";
import { useOffice } from "@/app/context/officeContext";
import { useDebounce } from "@/app/lib/hooks";
import { Dealer } from "@/app/lib/interfaces";
import { fetchResults, safeLocaleCompare } from "@/app/lib/utils";
import { ActionIcon, Loader, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { t } from "../lib/i18n";

export default function DealerSelect({
  value,
  onChange,
  disabled,
}: {
  value: Dealer[];
  onChange: (value: Dealer[]) => void;
  disabled?: boolean;
}) {
  const { source, locale, service } = useOffice();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchResults<Dealer>(
        source,
        service,
        "dealers",
        debouncedSearch,
      );
      if (!cancelled) {
        setResults(res.sort((a, b) => safeLocaleCompare(a.name1, b.name1)));
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, source]);

  const selectDealer = (dealer: Dealer) => {
    if (value.some((d) => d.id === dealer.id && d.kdnr === dealer.kdnr)) return;
    onChange([...value, dealer]);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <TextInput
        placeholder={t(locale, "searchByNameOrKdnr")}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        readOnly={disabled}
        rightSection={
          loading ? (
            <Loader size="xs" />
          ) : (
            search && (
              <ActionIcon
                color="dark"
                variant="light"
                onClick={() => setSearch("")}
              >
                <IconX />
              </ActionIcon>
            )
          )
        }
      />
      {search && results.length > 0 && (
        <div className="absolute z-10 w-full mt-10 bg-(--background) shadow-xl max-h-60 overflow-y-auto">
          {results.map((d) => (
            <div
              key={`${d.kdnr}-${d.id}`}
              className="group px-3 py-2 cursor-pointer hover:bg-(--main) hover:text-white"
              onClick={() => selectDealer(d)}
            >
              <p>
                <b>{d.name1}</b> {d.name2}
              </p>
              <p className="text-xs group-hover:text-white/60">
                {d.kdnr} – {d.plz} {d.ort} {d.land}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
