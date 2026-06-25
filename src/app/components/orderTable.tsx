/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { OrderHead } from "@/app/lib/interfaces";
import {
  NumberFormatter,
  SegmentedControl,
  Select,
  Table,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendarWeek, IconChevronUp } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useOffice } from "../context/officeContext";
import { countryCodes, normalizeAlpha2CountryCode } from "../lib/countryCodes";
import { t } from "../lib/i18n";
import { getOrderTargets, OrderTarget } from "../lib/order";
import { getDatePresets, parseOrderDate } from "../lib/utils";
import Loader from "./loader";
import Pagination from "./pagination";

type OrderKey = keyof OrderHead;
type SortKey =
  | OrderKey
  | "company.name1"
  | "company.land"
  | "sachbearbeiter.name"
  | "besteller.name";

const getSortValue = (o: OrderHead, key: SortKey): string => {
  if (key === "company.name1") return o.company?.name1 ?? "";
  if (key === "company.land") return o.company?.land ?? "";
  if (key === "sachbearbeiter.name") return o.sachbearbeiter?.name ?? "";
  if (key === "besteller.name") return o.besteller?.name ?? "";
  return String(o[key] ?? "");
};

export default function OrderTable({
  search = "",
  kdnr,
}: {
  search?: string;
  kdnr?: string;
}) {
  const { data: session } = useSession();
  const { locale, source } = useOffice();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderHead[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("auftragsDatum");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [target, setTarget] = useState<OrderTarget>("I");
  const [filters, setFilters] = useState({
    kdnr: kdnr ?? "",
    name1: "",
    land: "",
    sachbearbeiterName: "",
    dateRange: [dayjs().subtract(13, "day").toDate(), new Date()] as [
      Date | null,
      Date | null,
    ],
  });

  const fetchOrders = async () => {
    const [dateFrom, dateTo] = filters.dateRange;
    if (!dateFrom || !dateTo) return;

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({
          source,
          user: session?.user?.email,
          target,
          dateFrom: dayjs(dateFrom).format("YYYY-MM-DD"),
          dateTo: dayjs(dateTo).format("YYYY-MM-DD"),
        }),
      });
      if (response.ok) {
        const data: OrderHead[] = await response.json();
        setOrders(
          data.map((o) => ({
            ...o,
            auftragsDatum: parseOrderDate(o.auftragsDatum, locale),
            lieferdatumAuftrag: parseOrderDate(o.lieferdatumAuftrag, locale),
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
  }, [target, filters.dateRange]);

  const getOptions = (key: OrderKey) =>
    Array.from(new Set(orders.map((o) => o[key]).filter(Boolean)))
      .sort((a, b) => String(a).localeCompare(String(b)))
      .map((v) => ({ label: String(v), value: String(v) }));

  const kdnrOptions = useMemo(() => getOptions("kdnr"), [orders]);
  const clerkSortKey: SortKey =
    target === "B" ? "besteller.name" : "sachbearbeiter.name";

  const clerkOptions = useMemo(
    () =>
      Array.from(
        new Set(
          orders
            .map((o) =>
              target === "B" ? o.besteller?.name : o.sachbearbeiter?.name,
            )
            .filter(Boolean),
        ),
      )
        .sort((a, b) => a!.localeCompare(b!))
        .map((v) => ({ label: v!, value: v! })),
    [orders, target],
  );
  const name1Options = useMemo(
    () =>
      Array.from(new Set(orders.map((o) => o.company?.name1).filter(Boolean)))
        .sort((a, b) => a!.localeCompare(b!))
        .map((v) => ({ label: v!, value: v! })),
    [orders],
  );
  const countryOptions = useMemo(() => {
    return Array.from(
      new Set(
        orders
          .map((o) => normalizeAlpha2CountryCode(o.company?.land) || "")
          .filter(Boolean),
      ),
    )
      .map((value) => ({
        label:
          countryCodes(locale).find(
            (c) => c.value === normalizeAlpha2CountryCode(value),
          )?.label || value,
        value,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [orders]);

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
              o.sachbearbeiter?.name,
              o.sachbearbeiter?.kuerzel,
              o.auftragsbestellnummerKunde,
              o.auftragsbestellnummerIntern,
              o.auftragsDatum,
              o.lieferdatumAuftrag,
              o.beschaffungsart,
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
          ? getSortValue(o, clerkSortKey) === filters.sachbearbeiterName
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

  const handleSort = (key: SortKey) => {
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
        const aVal = getSortValue(a, sortBy);
        const bVal = getSortValue(b, sortBy);
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }),
    [filteredOrders, sortBy, sortDirection],
  );

  const columns: {
    label: string;
    key: SortKey | null;
    render?: (o: OrderHead) => React.ReactNode;
    align?: "center" | "right" | "left" | "justify" | "char" | undefined;
  }[] = [
    { label: t(locale, "kdnr"), key: "kdnr" },
    {
      label: t(locale, "customer"),
      key: "company.name1",
      render: (o) => o.company?.name1 ?? "",
    },
    {
      label: t(locale, "country"),
      key: "company.land",
      render: (o) => (
        <ReactCountryFlag countryCode={o.company?.land ?? ""} svg />
      ),
    },
    {
      label: t(locale, "clerk"),
      key: clerkSortKey,
      render: (o) => getSortValue(o, clerkSortKey),
    },
    {
      label: t(locale, "orderNumberCustomer"),
      key: "auftragsbestellnummerKunde",
    },
    {
      label: t(locale, "orderNumberInternal"),
      key: "auftragsbestellnummerIntern",
    },
    { label: t(locale, "orderDate"), key: "auftragsDatum" },
    {
      label: t(locale, "orderValue"),
      key: "auftragsWert",
      render: (o) => (
        <NumberFormatter
          value={o.auftragsWert}
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix={`${o.company?.wkz ?? "USD"} `}
        />
      ),
      align: "right",
    },
  ];

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const currentPageData = sortedOrders.slice(startIndex, startIndex + pageSize);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-4 items-end gap-2 md:gap-y-0">
        <SegmentedControl
          data={[...getOrderTargets(locale)]}
          value={target}
          onChange={setTarget}
          className="md:col-span-2"
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
          valueFormat={locale === "en" ? "MM/DD/YYYY" : "DD.MM.YYYY"}
          presets={getDatePresets(locale)}
          rightSection={<IconCalendarWeek size={16} />}
          rightSectionPointerEvents="none"
          className="md:col-span-2"
        />
        {!kdnr && (
          <>
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
              label={t(locale, "customer")}
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
              data={countryOptions}
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
                setFilters((prev) => ({
                  ...prev,
                  sachbearbeiterName: value || "",
                }))
              }
              checkIconPosition="right"
            />
          </>
        )}
      </div>

      {sortedOrders && sortedOrders.length > 0 ? (
        <>
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
                  {columns.map(({ label, key, align }) => (
                    <Table.Th
                      key={key ?? label}
                      onClick={() => key && handleSort(key)}
                      className={key ? "cursor-pointer select-none" : ""}
                    >
                      <div
                        className={`flex items-center ${align === "right" ? "justify-end" : ""} gap-1 whitespace-nowrap`}
                      >
                        {label}
                        {key && sortBy === key && (
                          <IconChevronUp
                            size={16}
                            className={`transition-all ${
                              sortDirection === "asc"
                                ? "rotate-0"
                                : "rotate-180"
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
                    onClick={() =>
                      router.push(`/order/${target}/${order.unid}`)
                    }
                    className="cursor-pointer"
                  >
                    {columns.map(({ key, render, label, align }) => (
                      <Table.Td key={key ?? label} align={align ?? "left"}>
                        {render
                          ? render(order)
                          : key
                            ? getSortValue(order, key)
                            : ""}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </>
      ) : (
        <p className="dimmed text-center p-4">{t(locale, "noOrders")}</p>
      )}
    </div>
  );
}
