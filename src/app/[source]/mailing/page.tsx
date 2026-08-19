"use client";
import { Button, SegmentedControl, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronUp, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/loader";
import { useOffice } from "../../context/officeContext";
import { DATE_FORMAT } from "../../lib/config";
import { t } from "../../lib/i18n";
import { MailingFilterRecord } from "../../lib/interfaces";
import { getErrorMessage } from "../../lib/utils";

interface FilterRow {
  unid: string;
  name: string;
  createdby: string;
  updatedby: string;
  created: string;
  modified: string;
}

export default function Page() {
  const { locale, source, sourcePrefix } = useOffice();
  const { data: session } = useSession();
  const router = useRouter();

  const [filters, setFilters] = useState<FilterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof FilterRow>("modified");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<"all" | "mine">("all");

  const fetchFilters = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mailing/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          user: session?.user?.name,
        }),
      });

      if (response.ok) {
        const data: MailingFilterRecord[] = await response.json();
        setFilters(
          data.map((record) => ({
            unid: record.json.unid ?? "",
            name: record.json.name,
            createdby: record.createdby,
            updatedby: record.updatedby,
            created: record.created,
            modified: record.modified,
          })),
        );
      } else {
        notifications.show({
          title: `Error ${response.status}`,
          message: getErrorMessage(await response.text()),
        });
      }
    } catch (error) {
      console.error("Error fetching mailing filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = useMemo(() => {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return filters
      .filter((row) => view === "all" || row.createdby === session?.user?.name)
      .sort((a, b) =>
        sortDirection === "asc"
          ? collator.compare(a[sortBy] || "", b[sortBy] || "")
          : collator.compare(b[sortBy] || "", a[sortBy] || ""),
      );
  }, [filters, sortBy, sortDirection, view, session?.user?.name]);

  useEffect(() => {
    if (session?.user?.name) fetchFilters();
  }, [source, session?.user?.name]);

  const columns = [
    { label: t(locale, "name"), key: "name", sortable: true },
    { label: t(locale, "createdBy"), key: "createdby", sortable: true },
    { label: t(locale, "created"), key: "created", sortable: true },
    { label: t(locale, "modified"), key: "modified", sortable: true },
  ] as const;

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-4 px-4 md:px-8 py-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 py-4">
        <h1>{t(locale, "savedFilters")}</h1>
        <div className="flex gap-2">
          <SegmentedControl
            value={view}
            onChange={(value) => setView(value as "all" | "mine")}
            data={[
              { label: t(locale, "all"), value: "all" },
              { label: t(locale, "mine"), value: "mine" },
            ]}
          />
          <Button
            component={Link}
            href={`/${sourcePrefix}/mailing/new`}
            leftSection={<IconPlus size={16} />}
          >
            {t(locale, "createFilter")}
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <Table highlightOnHover layout="fixed">
          <Table.Thead>
            <Table.Tr>
              {columns.map((col, index) => (
                <Table.Th
                  key={index}
                  className={col.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => {
                    if (!col.sortable) return;
                    if (sortBy === col.key) {
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      );
                    } else {
                      setSortBy(col.key as keyof FilterRow);
                      setSortDirection("asc");
                    }
                  }}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    {col.label}
                    {sortBy === col.key && col.sortable && (
                      <IconChevronUp
                        size={16}
                        className={`transition-all ${
                          sortDirection === "asc" ? "rotate-0" : "rotate-180"
                        }`}
                      />
                    )}
                  </div>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.map((row, index) => (
              <Table.Tr
                key={index}
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/${sourcePrefix}/mailing/${row.unid}`)
                }
              >
                <Table.Td>
                  <b>{row.name}</b>
                </Table.Td>
                <Table.Td>{row.createdby}</Table.Td>
                <Table.Td>
                  {row.created
                    ? format(new Date(row.created), DATE_FORMAT)
                    : ""}
                </Table.Td>
                <Table.Td>
                  {row.modified
                    ? format(new Date(row.modified), DATE_FORMAT)
                    : ""}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </main>
  );
}
