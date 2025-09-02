"use client";
import { Avatar, Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useOffice } from "../context/officeContext";
import { Person } from "../lib/interfaces";
import { getAvatarColor } from "../lib/utils";

export default function EmployeeRow({
  employee,
  withCompany,
}: {
  employee: Person;
  withCompany?: boolean;
}) {
  const { companies } = useOffice();
  const router = useRouter();
  const hasProfile = employee.b2bnr !== "";
  const company =
    withCompany &&
    companies.find((c) => c.kdnr.toString() === employee.b2bnr.split("-")[0])
      ?.name1;

  return (
    <Table.Tr
      className={`${hasProfile && "cursor-pointer"}`}
      onClick={() => hasProfile && router.push(`/person/${employee.b2bnr}`)}
    >
      <Table.Td>
        <Avatar size={24} color={getAvatarColor(employee.kdnr)}>
          {employee.nachname[0].toUpperCase()}
          {employee.vorname[0].toUpperCase()}
        </Avatar>
      </Table.Td>
      <Table.Td>
        <b>
          {employee.nachname}, {employee.vorname}
        </b>
      </Table.Td>
      {withCompany && <Table.Td>{company}</Table.Td>}
      <Table.Td>{employee.jobpos}</Table.Td>
      <Table.Td>{employee.email}</Table.Td>
      <Table.Td>{employee.telefon}</Table.Td>
      <Table.Td>{employee.b2bnr}</Table.Td>
    </Table.Tr>
  );
}
