"use client";
import { Button, SegmentedControl, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LineGraph from "../components/lineGraph";
import Loader from "../components/loader";
import SortableTable from "../components/sortableTable";
import StatsOverview from "../components/statsOverview";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Order, TicketSummary } from "../lib/interfaces";
import { RecentTickets, getRecentTickets } from "../lib/recentTickets";
import { parseDb2Date } from "../lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const { locale } = useOffice();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("all");
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentTickets>({});

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

  useEffect(() => {
    if (value === "recent") {
      setRecentlyViewed(getRecentTickets());
    }
  }, [value]);

  if (loading) {
    return <Loader />;
  }

  if (!tickets) {
    return;
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2">
        <SegmentedControl
          size={isMobile ? "sm" : "xl"}
          value={value}
          onChange={setValue}
          data={[
            {
              label: t(locale, "allTickets"),
              value: "all",
            },
            {
              label: t(locale, "newTickets"),
              value: "new",
            },
            {
              label: t(locale, "myTickets"),
              value: "mine",
            },
            {
              label: t(locale, "recentTickets"),
              value: "recent",
            },
            {
              label: t(locale, "ticketStats"),
              value: "dashboard",
            },
          ]}
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
          tickets={filteredTickets}
          createdBy={
            value === "mine" ? (session?.user?.name ?? undefined) : undefined
          }
          status={value === "new" ? "100" : undefined}
          kundenart={value === "new" ? "withoutExport" : "all"}
          recentlyViewed={value === "recent" ? recentlyViewed : undefined}
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
