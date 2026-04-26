"use client";
import {
  Avatar,
  SegmentedControl,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { IconBuildings, IconChevronUp, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Loader from "../components/loader";
import Pagination from "../components/pagination";
import { useOffice } from "../context/officeContext";
import { countryCodes, normalizeAlpha2CountryCode } from "../lib/countryCodes";
import { t } from "../lib/i18n";
import { Company } from "../lib/interfaces";
import { fetchResults, getAvatarColor, safeLocaleCompare } from "../lib/utils";

export default function Page() {
  const { locale, source, service, setService } = useOffice();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Company>("name1");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    country: "",
    kundenart: "",
    matchcode: "",
    kdnr: "",
    branche: "",
    vertreter: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchResults<Company>(source, service, "companies");
    setCompanies(res.sort((a, b) => safeLocaleCompare(a.name1, b.name1)));
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    const keywords = search.trim().toLowerCase().split(" ").filter(Boolean);

    return companies.filter((c) => {
      const searchMatch =
        keywords.length === 0 ||
        keywords.every((keyword) =>
          [
            String(c.kdnr) || "",
            c.name1 || "",
            c.name2 || "",
            c.plz || "",
            c.ort || "",
            c.matchcode || "",
          ].some((value) => value.toLowerCase().includes(keyword)),
        );

      const countryMatch =
        !filters.country ||
        (normalizeAlpha2CountryCode(c.land) || "").toLowerCase() ===
          filters.country.toLowerCase();
      const kundenartMatch =
        !filters.kundenart ||
        (c.kundenartText || "").toLowerCase() ===
          filters.kundenart.toLowerCase();
      const matchcodeMatch =
        !filters.matchcode ||
        (c.matchcode || "")
          .toLowerCase()
          .startsWith(filters.matchcode.toLowerCase());
      const kdnrMatch =
        !filters.kdnr ||
        (String(c.kdnr) || "")
          .toLowerCase()
          .startsWith(filters.kdnr.toLowerCase());
      const brancheMatch =
        !filters.branche ||
        (c.branche || "").toLowerCase() === filters.branche.toLowerCase();
      const vertreterMatch =
        !filters.vertreter ||
        (c.vertreter || "").toLowerCase() === filters.vertreter.toLowerCase();

      return (
        searchMatch &&
        countryMatch &&
        kundenartMatch &&
        matchcodeMatch &&
        kdnrMatch &&
        brancheMatch &&
        vertreterMatch
      );
    });
  }, [companies, search, filters]);

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
    setPage(1);
  }, [search, filters]);

  const countryOptions = useMemo(() => {
    return Array.from(
      new Set(
        companies
          .map((c) => normalizeAlpha2CountryCode(c.land) || "")
          .filter(Boolean),
      ),
    )
      .map((value) => ({
        label:
          countryCodes.find(
            (c) => c.value === normalizeAlpha2CountryCode(value),
          )?.label || value,
        value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [companies]);

  const kundenartOptions = useMemo(() => {
    return Array.from(
      new Set(companies.map((c) => c.kundenartText || "").filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value, value }));
  }, [companies]);

  const brancheOptions = useMemo(() => {
    return Array.from(
      new Set(companies.map((c) => c.branche || "").filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value, value }));
  }, [companies]);

  const vertreterOptions = useMemo(() => {
    return Array.from(
      new Set(companies.map((c) => c.vertreter || "").filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value, value }));
  }, [companies]);

  useEffect(() => {
    fetchData();
  }, [source, service]);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = sortedData.slice(startIndex, endIndex);

  const columns = [
    { label: "", key: "avatar", sortable: false },
    { label: t(locale, "name"), key: "name1", sortable: true },
    { label: t(locale, "extra"), key: "name2", sortable: true },
    { label: t(locale, "matchcode"), key: "matchcode", sortable: true },
    { label: t(locale, "kdnr"), key: "kdnr", sortable: true },
    { label: t(locale, "city"), key: "ort", sortable: true },
    { label: t(locale, "country"), key: "land", sortable: true },
    { label: t(locale, "customerType"), key: "kundenartText", sortable: true },
  ] as const;

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-4 px-8 py-4">
      <header className="flex justify-between items-center gap-2 py-4">
        <h1>{t(locale, "allCompanies")}</h1>
        <div className="flex items-center gap-2">
          <TextInput
            variant="unstyled"
            placeholder={t(locale, "searchCompanies")}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          {source === "OFFGUT" && (
            <SegmentedControl
              data={["B2B", "B2C"]}
              value={service}
              onChange={(value) => setService(value as "B2B" | "B2C")}
            />
          )}
        </div>
      </header>

      <div
        className={`grid grid-cols-1 ${source === "OFFGUT" ? "md:grid-cols-4" : "md:grid-cols-6"} gap-2`}
      >
        <TextInput
          label={t(locale, "kdnrStartsWith")}
          placeholder="1..."
          value={filters.kdnr}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setFilters((prev) => ({ ...prev, kdnr: value }));
          }}
          autoFocus
        />
        <TextInput
          label={t(locale, "matchcodeStartsWith")}
          placeholder="A..."
          value={filters.matchcode}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setFilters((prev) => ({
              ...prev,
              matchcode: value,
            }));
          }}
        />
        <Select
          label={t(locale, "country")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={countryOptions}
          value={filters.country}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, country: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "customerType")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={kundenartOptions}
          value={filters.kundenart}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, kundenart: value || "" }))
          }
          checkIconPosition="right"
        />
        {source === "OFFUSA" && (
          <>
            <Select
              label={t(locale, "branch")}
              searchable
              clearable
              placeholder={t(locale, "filter")}
              data={brancheOptions}
              value={filters.branche}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, branche: value || "" }))
              }
              checkIconPosition="right"
            />
            <Select
              label={t(locale, "deputy")}
              searchable
              clearable
              placeholder={t(locale, "filter")}
              data={vertreterOptions}
              value={filters.vertreter}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, vertreter: value || "" }))
              }
              checkIconPosition="right"
            />
          </>
        )}
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        results={filteredData.length}
      />

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
                    setSortBy(col.key as keyof Company);
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
          {currentPageData.map((company, i) => (
            <Table.Tr
              key={i}
              className="cursor-pointer"
              onClick={() => router.push(`/company/${company.kdnr}`)}
            >
              <Table.Td>
                <Avatar
                  size={24}
                  variant="filled"
                  color={getAvatarColor(company.kundenart)}
                >
                  <IconBuildings size={14} />
                </Avatar>
              </Table.Td>
              <Table.Td>
                <b>{company.name1}</b>
              </Table.Td>
              <Table.Td>
                {company.name2} {company.name3}
              </Table.Td>
              <Table.Td>{company.matchcode}</Table.Td>
              <Table.Td>{company.kdnr}</Table.Td>
              <Table.Td>{company.ort}</Table.Td>
              <Table.Td>{company.land}</Table.Td>
              <Table.Td>{company.kundenart}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </main>
  );
}
