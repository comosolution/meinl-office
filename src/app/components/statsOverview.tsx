"use client";
import { BarChart } from "@mantine/charts";
import { Paper } from "@mantine/core";
import { Order, TicketSummary } from "../lib/interfaces";
import { getTop10Customers, getTop10Items } from "../lib/utils";
import StatsTable from "./statsTable";

export default function StatsOverview({
  tickets,
  orders,
}: {
  tickets: TicketSummary[];
  orders: Order[];
}) {
  const topCustomers = getTop10Customers(tickets).map((c) => ({
    key: c.kdnr,
    label: c.kdnr,
    count: c.count,
    href: `/company/${c.kdnr}`,
  }));

  const topItems = getTop10Items(tickets).map((i) => ({
    key: i.artnr,
    label: i.artnr,
    count: i.count,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsTable title="Nach Kunde" entries={topCustomers} />
      <StatsTable title="Nach Artikelnummer" entries={topItems} />
      <Paper p="md" radius="md">
        <h2 className="text-center pb-8">Insgesamt</h2>
        <BarChart
          h={360}
          data={[
            {
              label: "Insgesamt",
              Bestellungen: orders.length,
              Tickets: tickets.length,
            },
          ]}
          dataKey="label"
          series={[
            { name: "Bestellungen", color: "dark.6" },
            { name: "Tickets", color: "red.6" },
          ]}
          tickLine="none"
          withXAxis={false}
        />
      </Paper>
    </div>
  );
}
