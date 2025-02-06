"use client";
import { Pagination, Table, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import EmployeeHead from "../components/employeeHead";
import EmployeeRow from "../components/employeeRow";
import { useOffice } from "../context/officeContext";

export default function Page() {
  const { employees } = useOffice();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = employees.filter((e) => {
    const keywords = search.trim().toLowerCase().split(" ");
    return keywords.every((keyword) =>
      [e.kdnr.toString(), e.vorname, e.nachname].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    );
  });

  const pageLimit = 25;
  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <main className="flex flex-col gap-8 px-8 py-4">
      <header className="flex justify-between items-baseline gap-2 p-4">
        <h1 className="text-4xl font-bold">Alle Personen</h1>
        <p className="dimmed">{filteredData.length} Ergebnisse</p>
      </header>
      <TextInput
        placeholder="Personen durchsuchen ..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Table stickyHeader highlightOnHover>
        <EmployeeHead />
        <Table.Tbody>
          {employees &&
            currentPageData.map((employee, i) => (
              <EmployeeRow key={i} employee={employee} />
            ))}
        </Table.Tbody>
      </Table>
      <Pagination
        value={page}
        onChange={setPage}
        total={totalPages}
        className="flex justify-center"
      />
    </main>
  );
}
