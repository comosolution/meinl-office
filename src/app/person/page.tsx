"use client";
import { Pagination, Table } from "@mantine/core";
import { useState } from "react";
import EmployeeHead from "../components/employeeHead";
import EmployeeRow from "../components/employeeRow";
import { useOffice } from "../context/officeContext";

export default function Page() {
  const { employees } = useOffice();
  const [page, setPage] = useState(1);

  const pageLimit = 25;
  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = employees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(employees.length / pageSize);

  return (
    <main className="flex flex-col gap-8 px-8 py-4">
      <header className="flex justify-between items-baseline gap-2 p-4">
        <h1 className="text-4xl font-bold">Alle Personen</h1>
        <p className="dimmed">{employees.length} Ergebnisse</p>
      </header>
      <Table highlightOnHover>
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
