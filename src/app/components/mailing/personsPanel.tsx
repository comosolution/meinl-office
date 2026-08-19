"use client";
import Pagination from "@/app/components/pagination";
import { useOffice } from "@/app/context/officeContext";
import {
  countryCodes,
  normalizeAlpha2CountryCode,
} from "@/app/lib/countryCodes";
import { competences } from "@/app/lib/data";
import { useFetchResults } from "@/app/lib/hooks";
import { t } from "@/app/lib/i18n";
import { MailingFilters, Person } from "@/app/lib/interfaces";
import { filterPersons } from "@/app/lib/mailingFilters";
import { getAvatarColor } from "@/app/lib/utils";
import { Avatar, MultiSelect, Table, TextInput } from "@mantine/core";
import { IconChevronUp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export function MailingPersonsPanel({
  filters,
  setFilters,
  readOnly,
  persons,
}: {
  filters: MailingFilters;
  setFilters: Dispatch<SetStateAction<MailingFilters>>;
  readOnly?: boolean;
  persons: Person[];
}) {
  const { locale, sourcePrefix } = useOffice();
  const router = useRouter();
  const fetchResults = useFetchResults();

  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [kundenartOptions, setKundenartOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [kdnrInput, setKdnrInput] = useState(
    filters.kdnr.split("#").filter(Boolean).join(" "),
  );
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof Person>("nachname");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchFilterOptions = async () => {
    const allPersons = await fetchResults<Person>("persons");

    const countryOptions = Array.from(
      new Set(
        allPersons
          .map((p) => normalizeAlpha2CountryCode(p.land) || "")
          .filter(Boolean),
      ),
    )
      .map((value) => ({
        label:
          countryCodes(locale).find((c) => c.value === value)?.label ?? value,
        value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const kundenartOptions = Array.from(
      new Map(
        allPersons.map((p) => [
          String(p.kundenart),
          p.kundenartText || String(p.kundenart),
        ]),
      ),
    )
      .map(([value, label]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    setCountryOptions(countryOptions);
    setKundenartOptions(kundenartOptions);
  };

  useEffect(() => {
    fetchFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    setKdnrInput(filters.kdnr.split("#").filter(Boolean).join(" "));
  }, [filters.kdnr]);

  const filteredPersons = useMemo(
    () => filterPersons(persons, filters),
    [persons, filters],
  );

  const sortedData = useMemo(() => {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return [...filteredPersons].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = aVal != null ? String(aVal) : "";
      const bStr = bVal != null ? String(bVal) : "";

      return sortDirection === "asc"
        ? collator.compare(aStr, bStr)
        : collator.compare(bStr, aStr);
    });
  }, [filteredPersons, sortBy, sortDirection]);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const currentPageData = sortedData.slice(startIndex, startIndex + pageSize);

  const columns = [
    { label: "", key: "avatar", sortable: false },
    { label: t(locale, "name"), key: "nachname", sortable: true },
    { label: t(locale, "company"), key: "name1", sortable: true },
    { label: t(locale, "position"), key: "jobpos", sortable: true },
    { label: t(locale, "email"), key: "email", sortable: true },
    { label: t(locale, "b2b"), key: "b2bnr", sortable: true },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <MultiSelect
          label={t(locale, "customerType")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={kundenartOptions}
          value={filters.kundenart}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, kundenart: value }))
          }
          readOnly={readOnly}
          checkIconPosition="right"
        />
        <MultiSelect
          label={t(locale, "responsibilities")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={competences}
          value={filters.competences}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, competences: value }))
          }
          readOnly={readOnly}
          checkIconPosition="right"
        />
        <MultiSelect
          label={t(locale, "country")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={countryOptions}
          value={filters.land}
          onChange={(value) => setFilters((prev) => ({ ...prev, land: value }))}
          readOnly={readOnly}
          checkIconPosition="right"
        />
        <TextInput
          label={t(locale, "search")}
          value={filters.search}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setFilters((prev) => ({ ...prev, search: value }));
          }}
          readOnly={readOnly}
        />
        <TextInput
          label={t(locale, "kdnr")}
          value={kdnrInput}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setKdnrInput(value);
            setFilters((prev) => ({
              ...prev,
              kdnr: value.trim().split(/\s+/).filter(Boolean).join("#"),
            }));
          }}
          readOnly={readOnly}
        />
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        results={filteredPersons.length}
      />

      <div className="overflow-x-auto">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th
                  key={col.key}
                  className={col.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => {
                    if (!col.sortable) return;
                    if (sortBy === col.key) {
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      );
                    } else {
                      setSortBy(col.key as keyof Person);
                      setSortDirection("asc");
                    }
                  }}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    {col.label}
                    {sortBy === col.key && col.sortable && (
                      <IconChevronUp
                        size={16}
                        className={`transition-all ${
                          sortDirection === "asc" ? "rotate-0" : "rotate-180"
                        }`}
                      />
                    )}
                  </div>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentPageData.map((e, i) => (
              <Table.Tr
                key={i}
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/${sourcePrefix}/person/${e.b2bnr}`)
                }
              >
                <Table.Td>
                  <Avatar
                    size={24}
                    color={getAvatarColor(e.kundenart)}
                    name={`${e.nachname} ${e.vorname}`}
                  />
                </Table.Td>
                <Table.Td>
                  <b>
                    {e.nachname}, {e.vorname}
                  </b>
                </Table.Td>
                <Table.Td>{e.name1}</Table.Td>
                <Table.Td>{e.jobpos}</Table.Td>
                <Table.Td>{e.email}</Table.Td>
                <Table.Td>{e.b2bnr}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
