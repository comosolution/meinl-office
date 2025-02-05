import { Table } from "@mantine/core";

export default function EmployeeHead() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Name</Table.Th>
        <Table.Th>Position</Table.Th>
        <Table.Th>E-Mail</Table.Th>
        <Table.Th>Telefon</Table.Th>
        <Table.Th>B2B#</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
