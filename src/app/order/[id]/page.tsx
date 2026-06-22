"use client";
import Loader from "@/app/components/loader";
import { PositionsTable } from "@/app/components/positionTable";
import SourceRequired from "@/app/components/sourceRequired";
import { useOffice } from "@/app/context/officeContext";
import { MEINL_AE_URL } from "@/app/lib/config";
import { t } from "@/app/lib/i18n";
import { Order, OrderPosition } from "@/app/lib/interfaces";
import { Button, Paper, SegmentedControl, Table } from "@mantine/core";
import {
  IconBasketPlus,
  IconChevronLeft,
  IconLayoutGrid,
  IconList,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const { locale, source } = useOffice();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order>();
  const [view, setView] = useState<"brand" | "list">("brand");

  const getOrder = async () => {
    try {
      const response = await fetch("/api/order/details", {
        method: "POST",
        body: JSON.stringify({ unid: id, source, user: session?.user }),
      });
      if (response.ok) setOrder(await response.json());
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  if (!order || loading) return <Loader />;
  if (source === "OFFGUT") return <SourceRequired requiredSource="OFFUSA" />;

  const parseDate = (s: string) =>
    s && s !== "00000000"
      ? format(
          new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`),
          "MM/dd/yyyy",
        )
      : "–";

  const grouped = order.positionen
    ? order.positionen.reduce<Record<string, OrderPosition[]>>((acc, pos) => {
        (acc[pos.marke] ??= []).push(pos);
        return acc;
      }, {})
    : null;

  const headRows: { label: string; value: string }[] = [
    { label: t(locale, "orderDate"), value: parseDate(order.auftragsDatum) },
    { label: t(locale, "customerNumber"), value: order.kdnr },
    { label: t(locale, "company"), value: order.company?.name1 ?? "–" },
    { label: t(locale, "clerk"), value: order.sachbearbeiterName },
    {
      label: t(locale, "orderValue"),
      value: `${order.auftragsWert.toLocaleString(
        locale === "de" ? "de-DE" : "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )} USD`,
    },
    { label: t(locale, "orderType"), value: order.beschaffungsart },
    {
      label: t(locale, "orderNumberInternal"),
      value: order.auftragsbestellnummerIntern,
    },
    {
      label: t(locale, "orderNumberCustomer"),
      value: order.auftragsbestellnummerKunde || "–",
    },
  ];

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            color="gray"
            variant="light"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href="/order"
          >
            {t(locale, "allOrders")}
          </Button>
          <Button
            variant="transparent"
            color="gray"
            component={Link}
            href={`/company/${order.kdnr}`}
            leftSection={<IconChevronLeft size={16} />}
          >
            {order.company.name1}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            component="a"
            href={`${MEINL_AE_URL}?kdnr=${order.kdnr}`}
            target="_blank"
            leftSection={<IconBasketPlus size={16} />}
          >
            {t(locale, "newOrder")}
          </Button>
        </div>
      </div>
      <header className="flex items-center gap-4 py-4">
        <h1>
          {t(locale, "order")} {order.auftragsbestellnummerIntern || id}
        </h1>
      </header>

      <div className="overflow-x-auto max-w-xl">
        <Table variant="vertical" withTableBorder withColumnBorders>
          <Table.Tbody>
            {headRows.map(({ label, value }) => (
              <Table.Tr key={label}>
                <Table.Th w={160}>{label}</Table.Th>
                <Table.Td>{value}</Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr>
              <Table.Th w={200}>{t(locale, "shippingAddress")}</Table.Th>
              <Table.Td className="whitespace-normal!">
                {[
                  order.versandadresse?.name1,
                  order.versandadresse?.name2,
                  order.versandadresse?.name3,
                  order.versandadresse?.strasse,
                  order.versandadresse?.plz,
                  order.versandadresse?.ort,
                  order.versandadresse?.land,
                ]
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3>{t(locale, "orderDetails")}</h3>
          <SegmentedControl
            value={view}
            onChange={(v) => setView(v as "brand" | "list")}
            data={[
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconLayoutGrid size={14} />
                    {t(locale, "byBrand")}
                  </div>
                ),
                value: "brand",
              },
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconList size={14} />
                    {t(locale, "listView")}
                  </div>
                ),
                value: "list",
              },
            ]}
          />
        </div>

        {view === "brand" &&
          grouped &&
          Object.entries(grouped).map(([marke, positions]) => {
            const total = positions.reduce(
              (sum, p) => sum + p.nettoPreis.value * p.menge,
              0,
            );
            return (
              <Paper key={marke} p="md">
                <div className="flex flex-col gap-4">
                  <header className="flex justify-between items-baseline gap-2">
                    <h2>{marke}</h2>
                    <p className="text-sm">
                      {t(locale, "orderValue")}:{" "}
                      <b>
                        {total.toLocaleString(
                          locale === "de" ? "de-DE" : "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}{" "}
                        {order.company?.wkz ?? "USD"}
                      </b>
                    </p>
                  </header>
                  <PositionsTable positions={positions} />
                </div>
              </Paper>
            );
          })}

        {view === "list" && order.positionen && (
          <Paper p="md">
            <PositionsTable
              positions={[...order.positionen].sort(
                (a, b) => a.posnr - b.posnr,
              )}
            />
          </Paper>
        )}

        {order.positionen && (
          <p
            className="text-sm text-right"
            style={{ paddingRight: "var(--mantine-spacing-md)" }}
          >
            {t(locale, "orderValue")}:{" "}
            <b>
              {order.auftragsWert.toLocaleString(
                locale === "de" ? "de-DE" : "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}{" "}
              {order.company?.wkz ?? "USD"}
            </b>
          </p>
        )}
      </div>
    </main>
  );
}
