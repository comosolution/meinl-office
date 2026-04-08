"use client";
import { Button, Table, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmployeeHead from "../components/employeeHead";
import EmployeeRow from "../components/employeeRow";
import Loader from "../components/loader";
import PageLimit from "../components/pageLimit";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Person } from "../lib/interfaces";
import { fetchResults, safeLocaleCompare } from "../lib/utils";

export default function Page() {
  const { locale, source, service } = useOffice();
  const [persons, setPersons] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>("25");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchResults<Person>(source, service, "persons");
    setPersons(res.sort((a, b) => safeLocaleCompare(a.nachname, b.nachname)));
    setLoading(false);
  };

  const filteredData = persons.filter((e) => {
    const keywords = search.trim().toLowerCase().split(" ");
    return keywords.every((keyword) =>
      [e.kdnr.toString() || "", e.vorname || "", e.nachname || ""].some(
        (value) => value.toLowerCase().includes(keyword),
      ),
    );
  });

  useEffect(() => {
    fetchData();
  }, [source, service]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-4 px-8 py-4">
      <header className="flex justify-between items-center gap-2 py-4">
        <h1>{t(locale, "allPeople")}</h1>
        <div className="flex justify-self-end">
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

      <PageLimit
        value={page}
        onChange={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        results={filteredData.length}
      />

      <Table highlightOnHover>
        <EmployeeHead withCompany />
        <Table.Tbody>
          {persons &&
            currentPageData.map((employee, i) => (
              <EmployeeRow key={i} employee={employee} withCompany />
            ))}
        </Table.Tbody>
      </Table>
    </main>
  );
}
