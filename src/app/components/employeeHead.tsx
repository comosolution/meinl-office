import { Table } from "@mantine/core";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function EmployeeHead({
  withCompany,
}: {
  withCompany?: boolean;
}) {
  const { locale } = useOffice();

  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th />
        <Table.Th>{t(locale, "name")}</Table.Th>
        {withCompany && <Table.Th>{t(locale, "company")}</Table.Th>}
        <Table.Th>{t(locale, "position")}</Table.Th>
        <Table.Th>{t(locale, "email")}</Table.Th>
        <Table.Th>{t(locale, "phone")}</Table.Th>
        <Table.Th>{t(locale, "b2b")}</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
