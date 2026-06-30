import { Locale, t } from "./i18n";

export type OrderTarget = "I" | "B" | "E";

export const getOrderTargets = (locale: Locale) => [
  { label: t(locale, "internal"), value: "I" as OrderTarget },
  { label: "B2B", value: "B" as OrderTarget },
  { label: "EDI", value: "E" as OrderTarget },
];

export const getOrderTargetColor = (target: OrderTarget) => {
  if (target === "I") return "yellow";
  if (target === "B") return "red";
  if (target === "E") return "blue";
};
