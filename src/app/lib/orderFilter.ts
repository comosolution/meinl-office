import { MEINL_OFFICE_ORDER_FILTER_KEY } from "./config";
import { OrderTarget } from "./order";

export type OrderFilterState = {
  target: OrderTarget | "";
  filters: {
    kdnr: string;
    name1: string;
    land: string;
    sachbearbeiterName: string;
    dateRange: [Date | null, Date | null];
  };
};

export function saveOrderFilter(state: OrderFilterState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      MEINL_OFFICE_ORDER_FILTER_KEY,
      JSON.stringify({
        target: state.target,
        filters: {
          kdnr: state.filters.kdnr,
          name1: state.filters.name1,
          land: state.filters.land,
          sachbearbeiterName: state.filters.sachbearbeiterName,
          dateRange: [
            state.filters.dateRange[0]
              ? new Date(state.filters.dateRange[0]).toISOString()
              : null,
            state.filters.dateRange[1]
              ? new Date(state.filters.dateRange[1]).toISOString()
              : null,
          ],
        },
      }),
    );
  } catch {}
}

export function loadOrderFilter(): OrderFilterState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(MEINL_OFFICE_ORDER_FILTER_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    return {
      target: parsed.target,
      filters: {
        kdnr: parsed.filters?.kdnr ?? "",
        name1: parsed.filters?.name1 ?? "",
        land: parsed.filters?.land ?? "",
        sachbearbeiterName: parsed.filters?.sachbearbeiterName ?? "",
        dateRange: [
          parsed.filters?.dateRange?.[0]
            ? new Date(parsed.filters.dateRange[0])
            : null,
          parsed.filters?.dateRange?.[1]
            ? new Date(parsed.filters.dateRange[1])
            : null,
        ],
      },
    };
  } catch {
    return null;
  }
}
