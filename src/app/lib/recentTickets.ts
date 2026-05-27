import { MEINL_RMA_TICKET_KEY } from "./config";

export type RecentTickets = Record<string, string>;

export function trackTicket(nr: string): void {
  if (typeof window === "undefined") return;

  const stored = getRecentTickets();
  stored[nr] = new Date().toISOString();
  const pruned = Object.fromEntries(
    Object.entries(stored)
      .sort((a, b) => b[1].localeCompare(a[1]))
      .slice(0, 50),
  );

  localStorage.setItem(MEINL_RMA_TICKET_KEY, JSON.stringify(pruned));
}

export function getRecentTickets(): RecentTickets {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(MEINL_RMA_TICKET_KEY) ?? "{}");
  } catch {
    return {};
  }
}
