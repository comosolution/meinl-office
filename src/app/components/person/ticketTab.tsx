import { TicketSummary } from "@/app/lib/interfaces";
import { getErrorMessage, parseDb2Date } from "@/app/lib/utils";
import { Tabs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import Loader from "../loader";
import TicketTable from "../ticket/ticketTable";

export default function TicketTab({ kdnr }: { kdnr: string }) {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);

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
        const filtered = transformed.filter(
          (ticket) => ticket.kdnr_full === kdnr || ticket.kdnr === kdnr,
        );
        const sorted = filtered.sort((a, b) =>
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
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <Loader />;

  return (
    <Tabs.Panel value="tickets" className="py-4">
      <TicketTable tickets={tickets} view="person" onUpdate={fetchTickets} />
    </Tabs.Panel>
  );
}
