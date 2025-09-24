"use client";
import { Avatar, Pagination, Table, TextInput } from "@mantine/core";
import { IconBuildings, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { getAvatarColor } from "../lib/utils";

export default function Page() {
  const { companies } = useOffice();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = companies.filter((c) => {
    const keywords = search.trim().toLowerCase().split(" ");
    return keywords.every((keyword) =>
      [
        c.kdnr.toString() || "",
        c.name1 || "",
        c.name2 || "",
        c.plz || "",
        c.ort || "",
        c.matchcode || "",
      ].some((value) => value.toLowerCase().includes(keyword))
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
        <h1>Alle Firmen</h1>
        <div className="flex gap-1">
          <TextInput
            placeholder="Firmen durchsuchen ..."
            leftSection={<IconSearch size={16} />}
            rightSection={<p className="text-xs">{filteredData.length}</p>}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          {/* <Button color="dark" leftSection={<IconCirclePlus size={16} />}>
            Firma anlegen
          </Button> */}
        </div>
      </header>

      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Name</Table.Th>
            <Table.Th>Zusatz</Table.Th>
            <Table.Th>Matchcode</Table.Th>
            <Table.Th>Kdnr</Table.Th>
            <Table.Th>Stadt</Table.Th>
            <Table.Th>Land</Table.Th>
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
                  color={getAvatarColor(company.kdnr)}
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
