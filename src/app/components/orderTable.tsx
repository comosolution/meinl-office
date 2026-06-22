/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { OrderHead } from "@/app/lib/interfaces";
import { NumberFormatter, Select, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarWeek, IconChevronUp } from "@tabler/icons-react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { getDatePresets } from "../lib/utils";
import Loader from "./loader";
import Pagination from "./pagination";

type OrderKey = keyof OrderHead;

export default function OrderTable({ search = "" }: { search?: string }) {
  const { data: session } = useSession();
  const { locale, source } = useOffice();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderHead[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<OrderKey>("auftragsDatum");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState({
    kdnr: "",
    name1: "",
    land: "",
    sachbearbeiterName: "",
    dateRange: [null, null] as [Date | null, Date | null],
  });

  const parseDate = (s: string) =>
    s && s !== "00000000"
      ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
      : "";

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({ source, user: session?.user }),
      });
      if (response.ok) {
        const data: OrderHead[] = await response.json();
        setOrders(
          data.map((o) => ({
            ...o,
            auftragsDatum: parseDate(o.auftragsDatum),
            lieferdatumAuftrag: parseDate(o.lieferdatumAuftrag),
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOptions = (key: OrderKey) =>
    Array.from(new Set(orders.map((o) => o[key]).filter(Boolean)))
      .sort((a, b) => String(a).localeCompare(String(b)))
      .map((v) => ({ label: String(v), value: String(v) }));

  const kdnrOptions = useMemo(() => getOptions("kdnr"), [orders]);
  const clerkOptions = useMemo(
    () => getOptions("sachbearbeiterName"),
    [orders],
  );
  const name1Options = useMemo(
    () =>
      Array.from(new Set(orders.map((o) => o.company?.name1).filter(Boolean)))
        .sort((a, b) => a!.localeCompare(b!))
        .map((v) => ({ label: v!, value: v! })),
    [orders],
  );
  const landOptions = useMemo(
    () =>
      Array.from(new Set(orders.map((o) => o.company?.land).filter(Boolean)))
        .sort((a, b) => a!.localeCompare(b!))
        .map((v) => ({ label: v!, value: v! })),
    [orders],
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const keywords = search.trim().toLowerCase().split(" ").filter(Boolean);
        const matchesSearch =
          keywords.length === 0 ||
          keywords.every((kw) =>
            [
              o.unid,
              o.kdnr,
              o.company?.name1,
              o.sachbearbeiterName,
              o.auftragsbestellnummerKunde,
              o.auftragsbestellnummerIntern,
              o.auftragsDatum,
              o.lieferdatumAuftrag,
              o.beschaffungsart,
              o.sachbearbeiterKuerzel,
            ]
              .filter(Boolean)
              .some((v) => v!.toLowerCase().includes(kw)),
          );
        const matchesKdnr = filters.kdnr ? o.kdnr === filters.kdnr : true;
        const matchesName1 = filters.name1
          ? o.company?.name1 === filters.name1
          : true;
        const matchesLand = filters.land
          ? o.company?.land === filters.land
          : true;
        const matchesClerk = filters.sachbearbeiterName
          ? o.sachbearbeiterName === filters.sachbearbeiterName
          : true;
        const matchesDateRange = (() => {
          const [start, end] = filters.dateRange;
          if (!start && !end) return true;
          if (!o.auftragsDatum) return false;
          const d = dayjs(o.auftragsDatum);
          if (start && d.isBefore(start, "day")) return false;
          if (d.isAfter(end ?? start, "day")) return false;
          return true;
        })();

        return (
          matchesSearch &&
          matchesKdnr &&
          matchesName1 &&
          matchesLand &&
          matchesClerk &&
          matchesDateRange
        );
      }),
    [orders, filters, search],
  );

  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  const handleSort = (key: OrderKey) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const sortedOrders = useMemo(
    () =>
      [...filteredOrders].sort((a, b) => {
        const aVal = String(a[sortBy] ?? "");
        const bVal = String(b[sortBy] ?? "");
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }),
    [filteredOrders, sortBy, sortDirection],
  );

  const columns: {
    label: string;
    key: OrderKey | null;
    render?: (o: OrderHead) => React.ReactNode;
  }[] = [
    { label: t(locale, "kdnr"), key: "kdnr" },
    {
      label: t(locale, "company"),
      key: null,
      render: (o) => o.company?.name1 ?? "",
    },
    {
      label: t(locale, "country"),
      key: null,
      render: (o) => o.company?.land ?? "",
    },
    { label: t(locale, "clerk"), key: "sachbearbeiterName" },
    {
      label: t(locale, "orderNumberCustomer"),
      key: "auftragsbestellnummerKunde",
    },
    {
      label: t(locale, "orderNumberInternal"),
      key: "auftragsbestellnummerIntern",
    },
    {
      label: t(locale, "orderValue"),
      key: "auftragsWert",
      render: (o) => (
        <NumberFormatter
          value={o.auftragsWert}
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix="$"
        />
      ),
    },
    {
      label: t(locale, "orderDate"),
      key: "auftragsDatum",
      render: (o) =>
        o.auftragsDatum ? format(new Date(o.auftragsDatum), "MM/dd/yyyy") : "",
    },
  ];

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const currentPageData = sortedOrders.slice(startIndex, startIndex + pageSize);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        <Select
          label={t(locale, "customerNumber")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={kdnrOptions}
          value={filters.kdnr || null}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, kdnr: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "company")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={name1Options}
          value={filters.name1 || null}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, name1: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "country")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={landOptions}
          value={filters.land || null}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, land: value || "" }))
          }
          checkIconPosition="right"
        />
        <Select
          label={t(locale, "clerk")}
          searchable
          clearable
          placeholder={t(locale, "filter")}
          data={clerkOptions}
          value={filters.sachbearbeiterName || null}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, sachbearbeiterName: value || "" }))
          }
          checkIconPosition="right"
        />
        <DatePickerInput
          type="range"
          allowSingleDateInRange
          highlightToday
          label={t(locale, "orderDate")}
          placeholder={t(locale, "filter")}
          value={filters.dateRange}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              dateRange: value as [Date | null, Date | null],
            }))
          }
          valueFormat="MM/DD/YYYY"
          presets={getDatePresets(locale)}
          rightSection={<IconCalendarWeek size={16} />}
          rightSectionPointerEvents="none"
          clearable
        />
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        results={filteredOrders.length}
      />

      <div className="overflow-x-auto">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map(({ label, key }) => (
                <Table.Th
                  key={key ?? label}
                  onClick={() => key && handleSort(key)}
                  className={key ? "cursor-pointer select-none" : ""}
                >
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    {label}
                    {key && sortBy === key && (
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
            {currentPageData.map((order, index) => (
              <Table.Tr
                key={index}
                onClick={() => router.push(`/order/${order.unid}`)}
                className="cursor-pointer"
              >
                {columns.map(({ key, render, label }) => (
                  <Table.Td key={key ?? label}>
                    {render
                      ? render(order)
                      : key
                        ? String(order[key] ?? "")
                        : ""}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
