import { Paper, Table } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

interface Entry {
  key: string;
  label: string;
  count: number;
  href?: string;
}

export default function StatsTable({
  title,
  entries,
}: {
  title: string;
  entries: Entry[];
}) {
  const router = useRouter();
  const { locale } = useOffice();

  return (
    <Paper p="md">
      <h2 className="text-center pb-4">{title}</h2>
      <Table highlightOnHover={entries.some((e) => e.href)}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>
              {title.includes("Kunde") || title.includes("customer")
                ? t(locale, "customerNumber")
                : t(locale, "articleNumber")}
            </Table.Th>
            <Table.Th>{t(locale, "tickets")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((e, i) => (
            <Table.Tr
              key={e.key}
              onClick={() => {
                if (e.href) router.push(e.href);
              }}
              className={e.href ? "cursor-pointer" : ""}
            >
              <Table.Td>{i + 1}</Table.Td>
              <Table.Td>{e.label}</Table.Td>
              <Table.Td>{e.count}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
