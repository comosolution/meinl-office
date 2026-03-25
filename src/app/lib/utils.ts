import clsx, { ClassValue } from "clsx";
import {
  format,
  isAfter,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { Order, TicketSummary } from "./interfaces";

export function parseDb2Date(db2Date: string): string {
  const parts = db2Date.split("-");
  if (parts.length !== 4) return db2Date;
  const date = parts.slice(0, 3).join("-");
  const timeParts = parts[3].split(".");
  if (timeParts.length === 4) {
    const time = `${timeParts[0]}:${timeParts[1]}:${timeParts[2]}.${timeParts[3]}`;
    return `${date}T${time}`;
  }
  return db2Date;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function exportXLSX(data: string) {
  try {
    const jsonData = JSON.parse(data);
    if (!Array.isArray(jsonData)) {
      throw new Error("Invalid data format: Expected an array of objects");
    }

    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

    const fileName = `Export_${new Date().toISOString()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Error exporting XLSX:", error);
  }
}

export function getReturnsData(
  tickets: TicketSummary[],
  orders: Order[],
  period: "90d" | "12m" | "5y",
  artnrKu?: string,
  kdnr?: string,
) {
  const today = new Date();

  let buckets: string[];
  let startDate: Date;

  if (period === "90d") {
    startDate = subDays(today, 89);
    buckets = Array.from({ length: 90 }).map((_, i) =>
      format(subDays(today, 89 - i), "dd.MM."),
    );
  } else if (period === "12m") {
    startDate = startOfMonth(subMonths(today, 11));
    buckets = Array.from({ length: 12 }).map((_, i) =>
      format(subMonths(today, 11 - i), "MMM yy"),
    );
  } else {
    startDate = startOfYear(subYears(today, 4));
    buckets = Array.from({ length: 5 }).map((_, i) =>
      format(subYears(today, 4 - i), "yyyy"),
    );
  }

  const ticketCounts: Record<string, number> = {};
  const orderCounts: Record<string, number> = {};

  for (const ticket of tickets) {
    const created = new Date(ticket.created.trim());
    if (!isAfter(created, startDate)) continue;
    if (artnrKu && ticket.artnr_ku !== artnrKu) continue;
    if (kdnr && ticket.kdnr !== kdnr) continue;

    let key = "";

    if (period === "90d") key = format(created, "dd.MM.");
    if (period === "12m") key = format(created, "MMM yy");
    if (period === "5y") key = format(created, "yyyy");

    ticketCounts[key] = (ticketCounts[key] || 0) + 1;
  }

  for (const order of orders) {
    const orderDate = new Date(order.BESTELLDATUMDESKUNDEN);
    if (!isAfter(orderDate, startDate)) continue;
    if (kdnr && String(order.KUNDENNUMMER) !== kdnr) continue;

    let key = "";

    if (period === "90d") key = format(orderDate, "dd.MM.");
    if (period === "12m") key = format(orderDate, "MMM yy");
    if (period === "5y") key = format(orderDate, "yyyy");

    orderCounts[key] = (orderCounts[key] || 0) + 1;
  }

  return buckets.map((date) => ({
    date,
    Tickets: ticketCounts[date] || 0,
    Bestellungen: orderCounts[date] || 0,
  }));
}

export const getTop10Customers = (tickets: TicketSummary[]) => {
  const countMap: Record<string, number> = {};

  for (const ticket of tickets) {
    countMap[ticket.kdnr] = (countMap[ticket.kdnr] || 0) + 1;
  }

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kdnr, count]) => ({ kdnr, count }));

  return sorted;
};

export const getTop10Items = (tickets: TicketSummary[]) => {
  const countMap: Record<string, number> = {};

  for (const ticket of tickets) {
    if (ticket.artnr_ku === "") continue;
    countMap[ticket.artnr_ku] = (countMap[ticket.artnr_ku] || 0) + 1;
  }

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([artnr, count]) => ({ artnr, count }));

  return sorted;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeLocaleCompare = (a?: string | null, b?: string | null) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b);
};

export const notEmptyValidation = (value: string, error: string) => {
  return value.trim().length < 1 ? error : null;
};

export const parseUrl = (url: string) => {
  return url.startsWith("http") ? url : `https://${url}`;
};

export const parseDateString = (dob: string) => {
  if (!dob) return null;
  const year = parseInt(dob.substring(0, 4), 10);
  const month = parseInt(dob.substring(4, 6), 10) - 1;
  const day = parseInt(dob.substring(6, 8), 10);
  return new Date(year, month, day);
};

export const formatDateToString = (date: Date | string | null): string => {
  if (!date) return "";

  if (typeof date === "string") {
    const d = parseDateString(date);
    if (!d) return "";
    date = d;
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2 digits
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}${month}${day}`;
};

export const getAvatarColor = (input: string | number) => {
  return +input < 60 ? "red" : "yellow";
};

export const fetchResults = async <T>(
  source: string,
  service: string,
  type: "companies" | "persons" | "dealers",
  query?: string,
): Promise<T[]> => {
  const res = await fetch("/api/search", {
    method: "POST",
    body: JSON.stringify({
      type,
      search: query || " ",
      source,
      service,
    }),
  });
  return res.json();
};
