/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Status, TicketSummary } from "@/app/lib/interfaces";
import { Button, Select, Table } from "@mantine/core";
import { IconChevronUp, IconTableExport } from "@tabler/icons-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useOffice } from "../context/officeContext";
import { LONG_DATE_FORMAT } from "../lib/constants";
import { t } from "../lib/i18n";
import { exportXLSX } from "../lib/utils";
import Pagination from "./pagination";

export default function SortableTable({
  tickets,
  kdnr,
}: {
  tickets: TicketSummary[];
  kdnr?: string;
}) {
  const router = useRouter();
  const { locale } = useOffice();
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<TicketKey>("created");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState({
    kdnr: kdnr ? kdnr : "",
    kdnr_name: "",
    kundenart: "all",
    status_int: "",
    artnr: "",
  });

  const filteredData = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesKdnr = filters.kdnr ? ticket.kdnr === filters.kdnr : true;
      const matchesKdnrName = filters.kdnr_name
        ? ticket.kdnr_name === filters.kdnr_name
        : true;
      const matchesKundenart =
        filters.kundenart === "all"
          ? true
          : filters.kundenart === "withoutExport"
            ? ticket.kundenart !== "30"
            : ticket.kundenart === "30";
      const matchesStatus = filters.status_int
        ? ticket.status_int.nr === filters.status_int
        : true;
      const ticketArtNr = ticket.artnr_mei || ticket.artnr_ku;
      const matchesArtNr = filters.artnr ? ticketArtNr === filters.artnr : true;

      setPage(1);
      return (
        matchesKdnr &&
        matchesKdnrName &&
        matchesKundenart &&
        matchesStatus &&
        matchesArtNr
      );
    });
  }, [tickets, filters]);

  type TicketKey = keyof TicketSummary;

  const getFilterOptions = (data: TicketSummary[], key: TicketKey) => {
    return Array.from(new Set(data.map((t) => t[key]).filter(Boolean)))
      .sort((a, b) => String(a).localeCompare(String(b)))
      .map((value) => ({
        label: String(value),
        value: String(value),
      }));
  };

  const kdnrOptions = useMemo(
    () => getFilterOptions(filteredData, "kdnr"),
    [filteredData],
  );
  const kdnrNameOptions = useMemo(
    () => getFilterOptions(filteredData, "kdnr_name"),
    [filteredData],
  );
  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(filteredData.map((t) => t.status_int.nr).filter(Boolean)),
      )
        .sort((a, b) => String(a).localeCompare(String(b)))
        .map((value) => value),
    [filteredData],
  );
  const artnrOptions = useMemo(() => {
    const artnrSet = new Set(
      filteredData.map((t) => t.artnr_mei || t.artnr_ku).filter(Boolean),
    );
    return Array.from(artnrSet)
      .sort((a, b) => String(a).localeCompare(String(b)))
      .map((value) => ({ label: String(value), value: String(value) }));
  }, [filteredData]);

  const columns: {
    label: string;
    key: TicketKey;
    render?: (ticket: TicketSummary) => React.ReactNode;
  }[] = [
    {
      label: "ID",
      key: "nr",
    },
    {
      label: t(locale, "status"),
      key: "status_int",
      render: (ticket) => ticket.status_int.text,
    },
    {
      label: t(locale, "customerNumber"),
      key: "kdnr_full",
    },
    {
      label: t(locale, "nameLabel"),
      key: "kdnr_name",
    },
    {
      label: t(locale, "articleNumber"),
      key: "artnr",
      render: (ticket) => ticket.artnr_mei || ticket.artnr_ku,
    },
    {
      label: t(locale, "customerType"),
      key: "kundenart",
    },
    {
      label: t(locale, "created"),
      key: "created",
      render: (ticket) => format(new Date(ticket.created), LONG_DATE_FORMAT),
    },
    {
      label: t(locale, "modified"),
      key: "modified",
      render: (ticket) => format(new Date(ticket.modified), LONG_DATE_FORMAT),
    },
  ];

  const handleSort = (key: TicketKey) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const sortedTickets = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal: string | Status = a[sortBy as keyof TicketSummary];
      let bVal: string | Status = b[sortBy as keyof TicketSummary];

      if (sortBy === "status_int") {
        aVal = a.status_int.nr;
        bVal = b.status_int.nr;
      }

      if (sortBy === "artnr") {
        aVal = a.artnr_mei || a.artnr_ku || "";
        bVal = b.artnr_mei || b.artnr_ku || "";
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortBy, sortDirection]);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = sortedTickets.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-6 items-end gap-2">
        <Select
          label={t(locale, "status")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={statusOptions}
          value={filters.status_int}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, status_int: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "customerNumber")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={kdnrOptions}
          value={filters.kdnr}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, kdnr: value || "" }))
          }
          disabled={kdnr !== undefined}
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "nameLabel")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={kdnrNameOptions}
          value={filters.kdnr_name}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, kdnr_name: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "articleNumber")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={artnrOptions}
          value={filters.artnr}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, artnr: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "customerType")}
          allowDeselect={false}
          data={[
            { label: t(locale, "all"), value: "all" },
            { label: t(locale, "withoutExport"), value: "withoutExport" },
            { label: t(locale, "onlyExport"), value: "export" },
          ]}
          value={filters.kundenart}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, kundenart: value || "" }))
          }
          checkIconPosition="right"
        />
        <Button
          variant="light"
          onClick={() => {
            exportXLSX(JSON.stringify(sortedTickets));
          }}
          fullWidth
          leftSection={<IconTableExport size={16} />}
        >
          {t(locale, "export")}
        </Button>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        results={filteredData.length}
      />

      <Table highlightOnHover layout="fixed">
        <Table.Thead>
          <Table.Tr>
            {columns.map(({ label, key }) => (
              <Table.Th
                key={key}
                onClick={() => handleSort(key)}
                className="cursor-pointer select-none"
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  {label}
                  {sortBy === key && (
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
          {currentPageData.map((ticket, index) => (
            <Table.Tr
              key={index}
              onClick={() => router.push(`/ticket/${ticket.nr}`)}
              className="cursor-pointer"
            >
              {columns.map(({ key, render }) => (
                <Table.Td key={key}>
                  {render ? render(ticket) : String(ticket[key])}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
