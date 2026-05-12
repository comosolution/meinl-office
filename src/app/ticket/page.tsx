"use client";
import { Button, SegmentedControl, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconPlus,
  IconReportAnalytics,
  IconSearch,
  IconStar,
  IconTable,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LineGraph from "../components/lineGraph";
import Loader from "../components/loader";
import SortableTable from "../components/sortableTable";
import StatsOverview from "../components/statsOverview";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Order, TicketSummary } from "../lib/interfaces";
import { parseDb2Date } from "../lib/utils";

export default function Page() {
  const { locale } = useOffice();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("all");
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const isMobile = useMediaQuery("(max-width: 620px)");

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

  const filteredTickets = useMemo(() => {
    const keywords = search.trim().toLowerCase().split(" ").filter(Boolean);

    return tickets.filter((t) => {
      const searchMatch =
        keywords.length === 0 ||
        keywords.every((keyword) =>
          [
            t.nr || "",
            String(t.kdnr) || "",
            t.kdnr_full || "",
            t.kdnr_name || "",
            t.artnr_ku || "",
            t.artnr_mei || "",
            t.created || "",
            t.createdby || "",
          ].some((value) => value.toLowerCase().includes(keyword)),
        );
      return searchMatch;
    });
  }, [tickets, search]);

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
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 py-4">
        <SegmentedControl
          size={isMobile ? "sm" : "lg"}
          value={value}
          onChange={setValue}
          data={[
            {
              label: t(locale, "allTickets"),
              value: "all",
              icon: IconTable,
            },
            {
              label: t(locale, "newTickets"),
              value: "new",
              icon: IconStar,
            },
            {
              label: t(locale, "ticketStats"),
              value: "dashboard",
              icon: IconReportAnalytics,
            },
          ].map((d) => {
            return {
              label: (
                <div className="flex items-center gap-2">
                  <d.icon size={isMobile ? 20 : 24} stroke={1.5} />
                  {isMobile ? <p>{d.label}</p> : <h2>{d.label}</h2>}
                </div>
              ),
              value: d.value,
            };
          })}
        />
        <div className="flex items-center">
          {value !== "dashboard" && (
            <TextInput
              variant="unstyled"
              placeholder={t(locale, "searchTickets")}
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          )}
          <Button
            component={Link}
            href="/ticket/new"
            leftSection={<IconPlus size={16} />}
          >
            {t(locale, "createTicket")}
          </Button>
        </div>
      </header>

      {value !== "dashboard" ? (
        <SortableTable
          tickets={
            value === "all"
              ? filteredTickets
              : filteredTickets.filter((t) => String(t.status_int.nr) === "100")
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <LineGraph tickets={tickets} orders={orders} />
          <StatsOverview tickets={tickets} orders={orders} />
        </div>
      )}
    </main>
  );
}
