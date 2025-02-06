"use client";
import { Pagination, Table, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOffice } from "../context/officeContext";

export default function Page() {
  const { companies } = useOffice();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = companies.filter((c) => {
    const keywords = search.trim().toLowerCase().split(" ");
    return keywords.every((keyword) =>
      [c.kdnr.toString(), c.name1, c.name2, c.plz, c.ort, c.matchcode].some(
        (value) => value.toLowerCase().includes(keyword)
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
        <h1 className="text-4xl font-bold">Alle Kunden</h1>
        <p className="dimmed">{filteredData.length} Ergebnisse</p>
      </header>
      <TextInput
        placeholder="Firmen durchsuchen ..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Kdnr</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th />
            <Table.Th>Anschrift</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {currentPageData.map((company, i) => (
            <Table.Tr
              key={i}
              className="cursor-pointer"
              onClick={() => router.push(`/company/${company.kdnr}`)}
            >
              <Table.Td>{company.kdnr}</Table.Td>
              <Table.Td>
                <b>{company.name1}</b>
              </Table.Td>
              <Table.Td>
                {company.name2} {company.name3}
              </Table.Td>
              <Table.Td>
                {company.land}–{company.plz} {company.ort}
              </Table.Td>
            </Table.Tr>
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
