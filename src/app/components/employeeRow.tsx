"use client";
import { Avatar, Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import { Person } from "../lib/interfaces";
import { getAvatarColor } from "../lib/utils";

export default function EmployeeRow({
  employee,
  withCompany,
}: {
  employee: Person;
  withCompany?: boolean;
}) {
  const router = useRouter();

  return (
    <Table.Tr
      className="cursor-pointer"
      onClick={() => router.push(`/person/${employee.id}`)}
    >
      <Table.Td>
        <Avatar
          size={24}
          color={getAvatarColor(employee.kdnr)}
          name={`${employee.nachname[0]} ${employee.vorname[0]}`}
        />
      </Table.Td>
      <Table.Td>
        <b>
          {employee.nachname}, {employee.vorname}
        </b>
      </Table.Td>
      {withCompany && <Table.Td>{employee.name1}</Table.Td>}
      <Table.Td>{employee.jobpos}</Table.Td>
      <Table.Td>{employee.email}</Table.Td>
      <Table.Td>{employee.phone}</Table.Td>
    </Table.Tr>
  );
}
