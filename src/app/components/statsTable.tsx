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
    <Paper p="md" radius="md">
      <h2 className="text-center pb-4">{title}</h2>
      <Table highlightOnHover={entries.some((e) => e.href)}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>
              {title.includes("Kunde")
                ? t(locale, "customerNumber")
                : t(locale, "articleNumber")}
            </Table.Th>
            <Table.Th>{t(locale, "tickets")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry, index) => (
            <Table.Tr
              key={entry.key}
              onClick={() => {
                if (entry.href) router.push(entry.href);
              }}
              className={entry.href ? "cursor-pointer" : ""}
            >
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{entry.label}</Table.Td>
              <Table.Td>{entry.count}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
