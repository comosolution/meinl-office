"use client";
import { Pagination, Table, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import EmployeeHead from "../components/employeeHead";
import EmployeeRow from "../components/employeeRow";
import { useOffice } from "../context/officeContext";

export default function Page() {
  const { persons: employees } = useOffice();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = employees.filter((e) => {
    const keywords = search.trim().toLowerCase().split(" ");
    return keywords.every((keyword) =>
      [e.kdnr.toString() || "", e.vorname || "", e.nachname || ""].some(
        (value) => value.toLowerCase().includes(keyword)
      )
    );
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const pageLimit = 25;
  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <main className="flex flex-col gap-8 px-8 py-4">
      <header className="flex justify-between items-center gap-2 p-4">
        <h1>Alle Personen</h1>
        <div className="flex gap-1">
          <TextInput
            placeholder="Personen durchsuchen ..."
            leftSection={<IconSearch size={16} />}
            rightSection={<p className="text-xs">{filteredData.length}</p>}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
      </header>

      <Table stickyHeader highlightOnHover>
        <EmployeeHead withCompany />
        <Table.Tbody>
          {employees &&
            currentPageData.map((employee, i) => (
              <EmployeeRow key={i} employee={employee} withCompany />
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
