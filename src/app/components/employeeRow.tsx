"use client";
import { Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import { Person } from "../lib/interfaces";

export default function EmployeeRow({ employee }: { employee: Person }) {
  const router = useRouter();
  const hasProfile = employee.b2bnr !== "";

  return (
    <Table.Tr
      className={`${hasProfile && "cursor-pointer"}`}
      onClick={() => hasProfile && router.push(`/person/${employee.b2bnr}`)}
    >
      <Table.Td>
        <b>
          {employee.nachname}, {employee.vorname}
        </b>
      </Table.Td>
      <Table.Td>{employee.position}</Table.Td>
      <Table.Td>{employee.email}</Table.Td>
      <Table.Td>{employee.telefon}</Table.Td>
      <Table.Td>{employee.b2bnr}</Table.Td>
    </Table.Tr>
  );
}
