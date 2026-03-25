"use client";
import { LineChart } from "@mantine/charts";
import { Paper, SegmentedControl, Select } from "@mantine/core";
import { useMemo, useState } from "react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Order, TicketSummary } from "../lib/interfaces";
import { getReturnsData } from "../lib/utils";

export default function LineGraph({
  tickets,
  orders,
}: {
  tickets: TicketSummary[];
  orders: Order[];
}) {
  const { locale } = useOffice();
  const [period, setPeriod] = useState<"90d" | "12m" | "5y">("90d");
  const [selectedArtnr, setSelectedArtnr] = useState<string | null>(null);
  const [selectedKdnr, setSelectedKdnr] = useState<string | null>(null);

  const artnrOptions = useMemo(() => {
    const uniqueArtnrs = Array.from(new Set(tickets.map((t) => t.artnr_ku)))
      .filter((artnr) => artnr && artnr.trim())
      .sort();
    return uniqueArtnrs.map((artnr) => ({ value: artnr, label: artnr }));
  }, [tickets]);

  const kdnrOptions = useMemo(() => {
    const uniqueKdnrs = Array.from(new Set(tickets.map((t) => t.kdnr)))
      .filter((kdnr) => kdnr && kdnr.trim())
      .sort();
    return uniqueKdnrs.map((kdnr) => ({ value: kdnr, label: kdnr }));
  }, [tickets]);

  const data = useMemo(() => {
    return getReturnsData(
      tickets,
      orders,
      period,
      selectedArtnr ?? undefined,
      selectedKdnr ?? undefined,
    );
  }, [tickets, orders, period, selectedArtnr, selectedKdnr]);

  return (
    <Paper p="md">
      <div className="flex justify-between items-center gap-2 mb-2">
        <h2>{t(locale, "history")}</h2>
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={period}
            onChange={(value) => setPeriod(value as "90d" | "12m" | "5y")}
            data={[
              { label: t(locale, "days90"), value: "90d" },
              { label: t(locale, "months12"), value: "12m" },
              { label: t(locale, "years5"), value: "5y" },
            ]}
          />
          <Select
            placeholder={t(locale, "allCustomers")}
            searchable
            clearable
            value={selectedKdnr}
            onChange={setSelectedKdnr}
            data={kdnrOptions}
            checkIconPosition="right"
          />
          <Select
            placeholder={t(locale, "allArticles")}
            searchable
            clearable
            value={selectedArtnr}
            onChange={setSelectedArtnr}
            data={artnrOptions}
            checkIconPosition="right"
          />
        </div>
      </div>
      <LineChart
        h={320}
        data={data}
        dataKey="date"
        series={[
          { name: "Bestellungen", color: "dark.6" },
          { name: "Tickets", color: "red.6" },
        ]}
        curveType="linear"
        tickLine="none"
        withLegend
      />
    </Paper>
  );
}
