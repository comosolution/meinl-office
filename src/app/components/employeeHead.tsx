import { Table } from "@mantine/core";

export default function EmployeeHead({
  withCompany,
}: {
  withCompany?: boolean;
}) {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th />
        <Table.Th>Name</Table.Th>
        {withCompany && <Table.Th>Firma</Table.Th>}
        <Table.Th>Position</Table.Th>
        <Table.Th>E-Mail</Table.Th>
        <Table.Th>Telefon</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
