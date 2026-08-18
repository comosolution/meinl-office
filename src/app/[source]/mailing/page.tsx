"use client";
import { Avatar, Button, MultiSelect, Table, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronUp, IconTableExport } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import { useOffice } from "../../context/officeContext";
import {
  countryCodes,
  normalizeAlpha2CountryCode,
} from "../../lib/countryCodes";
import { competences } from "../../lib/data";
import { useDebounce, useFetchResults } from "../../lib/hooks";
import { t } from "../../lib/i18n";
import { Person } from "../../lib/interfaces";
import { getAvatarColor } from "../../lib/utils";

export default function Page() {
  const { locale, source, sourcePrefix, service } = useOffice();
  const fetchResults = useFetchResults();

  const [persons, setPersons] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Person>("nachname");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    search: "",
    competences: [] as string[],
    land: [] as string[],
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchResults<Person>(
      "persons",
      debouncedSearch,
      filters.competences.join("#"),
    );
    setPersons(res);
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    return persons.filter(
      (p) =>
        filters.land.length === 0 ||
        filters.land.includes(normalizeAlpha2CountryCode(p.land) || ""),
    );
  }, [persons, filters.land]);

  const landOptions = useMemo(() => {
    return Array.from(
      new Set(
        persons
          .map((p) => normalizeAlpha2CountryCode(p.land) || "")
          .filter(Boolean),
      ),
    )
      .map((value) => ({
        label:
          countryCodes(locale).find(
            (c) => c.value === normalizeAlpha2CountryCode(value),
          )?.label || value,
        value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [persons, locale]);

  const sortedData = useMemo(() => {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortBy, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [source, service, filters.competences, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = sortedData.slice(startIndex, endIndex);

  const columns = [
    { label: "", key: "avatar", sortable: false },
    { label: t(locale, "name"), key: "nachname", sortable: true },
    { label: t(locale, "company"), key: "name1", sortable: true },
    { label: t(locale, "position"), key: "jobpos", sortable: true },
    { label: t(locale, "email"), key: "email", sortable: true },
    { label: t(locale, "b2b"), key: "b2bnr", sortable: true },
  ] as const;

  const handleExportToCleverReach = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/mailing/cleverreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Meinl Office Mailing ${new Date().toLocaleString("de-DE")}`,
          persons: filteredData.map((p) => ({
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
        notifications.show({
          title: t(locale, "error"),
          message: t(locale, "exportFailedMessage"),
          color: "red",
        });
        return;
      }

      notifications.show({
        title: t(locale, "exportSuccessful"),
        message: t(locale, "exportSuccessMessage"),
        color: "dark",
      });
    } catch (error) {
      console.error("Error exporting to CleverReach:", error);
      notifications.show({
        title: t(locale, "error"),
        message: t(locale, "exportFailedMessage"),
        color: "red",
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-4 px-4 md:px-8 py-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 py-4">
        <h1>{t(locale, "mailing")}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-2 md:gap-y-0">
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
          checkIconPosition="right"
        />
        <MultiSelect
          label={t(locale, "country")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={landOptions}
          value={filters.land}
          onChange={(value) => setFilters((prev) => ({ ...prev, land: value }))}
          checkIconPosition="right"
        />
        <TextInput
          label={t(locale, "search")}
          value={filters.search}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setFilters((prev) => ({ ...prev, search: value }));
          }}
        />
        <Button
          onClick={handleExportToCleverReach}
          loading={exporting}
          disabled={filteredData.length === 0}
          leftSection={<IconTableExport size={16} />}
        >
          {t(locale, "exportToCleverReach")}
        </Button>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        results={filteredData.length}
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
    </main>
  );
}
