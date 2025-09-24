"use client";
import { Button, Table } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

export default function Page() {
  return (
    <main className="flex flex-col gap-8 px-8 py-4">
      <header className="flex justify-between items-center gap-2 p-4">
        <h1>Kampagnen</h1>
        <div className="flex gap-1">
          <Button color="dark" leftSection={<IconCirclePlus size={16} />}>
            Kampagne anlegen
          </Button>
        </div>
      </header>
      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Start</Table.Th>
            <Table.Th>Ende</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody></Table.Tbody>
      </Table>
    </main>
  );
}
