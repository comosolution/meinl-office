"use client";
import { Button, SegmentedControl } from "@mantine/core";
import { IconDashboard, IconPlus, IconTable } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LineGraph from "../components/lineGraph";
import Loader from "../components/loader";
import SortableTable from "../components/sortableTable";
import StatsOverview from "../components/statsOverview";
import { useOffice } from "../context/officeContext";
import orderData from "../data/orders.json";
import { t } from "../lib/i18n";
import { Order, TicketSummary } from "../lib/interfaces";
import { parseDb2Date } from "../lib/utils";

export default function Page() {
  const { locale } = useOffice();
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("table");
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [orders, setOrders] = useState<Order[]>(orderData as Order[]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/ticket");
      if (response.ok) {
        const data: TicketSummary[] = await response.json();
        const transformed = data.map((ticket) => ({
          ...ticket,
          created: parseDb2Date(ticket.created),
          modified: parseDb2Date(ticket.modified),
        }));
        const sorted = transformed.sort((a, b) =>
          b.created.localeCompare(a.created),
        );
        setTickets(sorted);
      } else {
        console.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!tickets) {
    return;
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex justify-between items-center gap-2 py-4">
        <h1>{t(locale, "allTickets")}</h1>
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={value}
            onChange={setValue}
            data={[
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconTable size={16} />
                    <p>{t(locale, "ticketOverview")}</p>
                  </div>
                ),
                value: "table",
              },
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconDashboard size={16} />
                    <p>{t(locale, "ticketStats")}</p>
                  </div>
                ),
                value: "dashboard",
              },
            ]}
          />
          <Button
            component={Link}
            href="/ticket/new"
            leftSection={<IconPlus size={16} />}
          >
            {t(locale, "createTicket")}
          </Button>
        </div>
      </header>

      {value === "table" ? (
        <SortableTable tickets={tickets} />
      ) : (
        <div className="flex flex-col gap-4">
          <LineGraph tickets={tickets} orders={orders} />
          <StatsOverview tickets={tickets} orders={orders} />
        </div>
      )}
    </main>
  );
}
