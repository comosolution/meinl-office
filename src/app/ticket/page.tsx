"use client";
import { ActionIcon, Button, SegmentedControl, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Loader from "../components/loader";
import SourceRequired from "../components/sourceRequired";
import StatsOverview from "../components/statsOverview";
import LineGraph from "../components/ticket/lineGraph";
import TicketTable from "../components/ticket/ticketTable";
import { useOffice } from "../context/officeContext";
import { MEINL_RMA_VIEW_KEY } from "../lib/config";
import { t } from "../lib/i18n";
import { Order, TicketSummary } from "../lib/interfaces";
import { RecentTickets, getRecentTickets } from "../lib/recentTickets";
import { getErrorMessage, parseDb2Date } from "../lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const { locale, source } = useOffice();

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState(
    () => localStorage.getItem(MEINL_RMA_VIEW_KEY) ?? "all",
  );
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentTickets>({});

  const isMobile = useMediaQuery("(max-width: 620px)");

  const fetchTickets = async () => {
    setFetching(true);
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
        notifications.show({
          title: `Error ${response.status}`,
          message: getErrorMessage(await response.text()),
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
      setFetching(false);
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
            t.firma || "",
            t.artnr_ku || "",
            t.artnr_mei || "",
            t.created || "",
            t.createdby || "",
            t.status_int?.nr || "",
            t.status_int?.text || "",
          ].some((value) => value.toLowerCase().includes(keyword)),
        );
      return searchMatch;
    });
  }, [tickets, search]);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    localStorage.setItem(MEINL_RMA_VIEW_KEY, view);

    if (view === "recent") {
      setRecentlyViewed(getRecentTickets());
    }
  }, [view]);

  if (loading) return <Loader />;

  if (!tickets) return;
  if (source === "OFFUSA") return <SourceRequired requiredSource="OFFGUT" />;

  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2">
        <SegmentedControl
          size={isMobile ? "sm" : "xl"}
          value={view}
          onChange={setView}
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
        <div className="flex items-center gap-2">
          <ActionIcon
            variant="transparent"
            loading={fetching}
            onClick={fetchTickets}
          >
            <IconRefresh size={16} />
          </ActionIcon>
          {view !== "dashboard" && (
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

      {view !== "dashboard" ? (
        <TicketTable
          tickets={filteredTickets}
          view={view}
          createdBy={
            view === "mine" ? (session?.user?.name ?? undefined) : undefined
          }
          status={view === "new" ? "100" : undefined}
          kundenart={view === "new" ? "withoutExport" : "all"}
          recentlyViewed={view === "recent" ? recentlyViewed : undefined}
          onUpdate={fetchTickets}
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
