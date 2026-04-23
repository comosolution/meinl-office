"use client";
import { Avatar, Button, Select, Table, TextInput } from "@mantine/core";
import { IconChevronUp, IconPlus, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Loader from "../components/loader";
import Pagination from "../components/pagination";
import { useOffice } from "../context/officeContext";
import { b2bAccess } from "../lib/data";
import { t } from "../lib/i18n";
import { Person } from "../lib/interfaces";
import { fetchResults, getAvatarColor } from "../lib/utils";

export default function Page() {
  const { locale, source, service } = useOffice();

  const [persons, setPersons] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Person>("nachname");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    b2bnr: "",
    company: "",
    position: "",
    b2bzugriff: "",
  });

  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchResults<Person>(source, service, "persons");
    setPersons(res);
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    const keywords = search.trim().toLowerCase().split(" ").filter(Boolean);

    return persons.filter((p) => {
      const searchMatch =
        keywords.length === 0 ||
        keywords.every((keyword) =>
          [
            p.kdnr.toString() || "",
            p.vorname || "",
            p.nachname || "",
            p.name1 || "",
            p.jobpos || "",
            p.email || "",
            p.phone || "",
            p.b2bnr || "",
          ].some((value) => value.toLowerCase().includes(keyword)),
        );

      const b2bnrMatch =
        !filters.b2bnr ||
        (p.b2bnr || "").toLowerCase().startsWith(filters.b2bnr.toLowerCase());
      const companyMatch =
        !filters.company ||
        (p.name1 || "").toLowerCase() === filters.company.toLowerCase();
      const positionMatch =
        !filters.position ||
        (p.jobpos || "").toLowerCase().trim() ===
          filters.position.toLowerCase().trim();
      const b2bzugriffMatch =
        !filters.b2bzugriff || (p.b2bzugriff || "") === filters.b2bzugriff;

      return (
        searchMatch &&
        b2bnrMatch &&
        companyMatch &&
        positionMatch &&
        b2bzugriffMatch
      );
    });
  }, [persons, search, filters]);

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
  }, [source, service]);

  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const companyOptions = useMemo(() => {
    return Array.from(
      new Set(persons.map((p) => p.name1 || "").filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value, value }));
  }, [persons]);

  const positionOptions = useMemo(() => {
    return Array.from(
      new Set(persons.map((p) => p.jobpos.trim() || "").filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value.trim(), value: value.trim() }));
  }, [persons]);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = sortedData.slice(startIndex, endIndex);

  const columns = [
    { label: "", key: "avatar", sortable: false },
    { label: t(locale, "name"), key: "nachname", sortable: true },
    { label: t(locale, "company"), key: "name1", sortable: true },
    { label: t(locale, "position"), key: "jobpos", sortable: true },
    { label: t(locale, "b2b"), key: "b2bnr", sortable: true },
    { label: t(locale, "b2bAccess"), key: "b2bzugriff", sortable: true },
  ] as const;

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-4 px-8 py-4">
      <header className="flex justify-between items-center gap-2 py-4">
        <h1>{t(locale, "allPeople")}</h1>
        <div className="flex">
          <TextInput
            variant="unstyled"
            placeholder={t(locale, "searchPeople")}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Button
            component={Link}
            href="/person/new"
            leftSection={<IconPlus size={16} />}
          >
            {t(locale, "createPerson")}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <TextInput
          label={t(locale, "b2bnrStartsWith")}
          placeholder="1..."
          value={filters.b2bnr}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setFilters((prev) => ({ ...prev, b2bnr: value }));
          }}
          autoFocus
        />
        <Select
          label={t(locale, "company")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={companyOptions}
          value={filters.company}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, company: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "position")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={positionOptions}
          value={filters.position}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, position: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "b2bAccess")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={b2bAccess(source)}
          value={filters.b2bzugriff}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, b2bzugriff: value || "" }))
          }
          checkIconPosition="right"
        />
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
              onClick={() => router.push(`/person/${e.b2bnr}`)}
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
              <Table.Td>{e.b2bnr}</Table.Td>
              <Table.Td>
                {b2bAccess(source).find((a) => a.value === e.b2bzugriff)
                  ?.label || e.b2bzugriff}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </main>
  );
}
