"use client";
import Loader from "@/app/components/loader";
import { PositionsTable } from "@/app/components/positionTable";
import SourceRequired from "@/app/components/sourceRequired";
import { useOffice } from "@/app/context/officeContext";
import { MEINL_AE_URL } from "@/app/lib/config";
import { t } from "@/app/lib/i18n";
import { Order, OrderPosition } from "@/app/lib/interfaces";
import { parseOrderDate } from "@/app/lib/utils";
import {
  Badge,
  Button,
  NumberFormatter,
  Paper,
  SegmentedControl,
  Table,
} from "@mantine/core";
import {
  IconBasketPlus,
  IconChevronLeft,
  IconLayoutList,
  IconList,
} from "@tabler/icons-react";
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

  const grouped = order.positionen
    ? order.positionen.reduce<Record<string, OrderPosition[]>>((acc, pos) => {
        (acc[pos.marke] ??= []).push(pos);
        return acc;
      }, {})
    : null;

  const valutaFilled =
    !!(order.valuta?.datum && order.valuta.datum !== "00000000") ||
    !!order.valuta?.tage;
  const valutaValue =
    [
      order.valuta?.datum && order.valuta.datum !== "00000000"
        ? `Due on date: ${parseOrderDate(order.valuta.datum, locale)}`
        : "",
      order.valuta?.tage ? `Days until due: ${order.valuta.tage}` : "",
    ]
      .filter(Boolean)
      .join(" / ") || "–";

  const zkDiffers =
    !!order.zahlungsKondition?.AS400 &&
    order.zahlungsKondition.AS400 !== order.zahlungsKondition.order;
  const zkValue = order.zahlungsKondition?.order || "–";
  const zkDisplay = zkDiffers
    ? `${zkValue} (${order.zahlungsKondition.AS400})`
    : zkValue;

  const zaDiffers =
    !!order.zahlungsArt?.AS400 &&
    order.zahlungsArt.AS400 !== order.zahlungsArt.order;
  const zaValue = order.zahlungsArt?.order || "–";
  const zaDisplay = zaDiffers
    ? `${zaValue} (${order.zahlungsArt.AS400})`
    : zaValue;

  const headRows: {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
  }[] = [
    {
      label: t(locale, "customerNumber"),
      value: (
        <Link href={`/company/${order.kdnr}`} className="link">
          {order.kdnr}
        </Link>
      ),
    },
    { label: t(locale, "company"), value: order.company?.name1 ?? "–" },
    {
      label: t(locale, "orderDate"),
      value: parseOrderDate(order.auftragsDatum, locale),
    },
    {
      label: t(locale, "orderValue"),
      value: (
        <NumberFormatter
          value={order.auftragsWert}
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix={`${order.company?.wkz ?? "USD"} `}
        />
      ),
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
    {
      label: t(locale, "remark"),
      value: order.bemerkung || "–",
    },
    {
      label: t(locale, "startText"),
      value: order.starttext || "–",
    },
    {
      label: t(locale, "invoiceText"),
      value: order.invoiceText || "–",
    },
    {
      label: t(locale, "proformaInvoiceText"),
      value: order.proformaInvoiceText || "–",
    },
    { label: t(locale, "valuta"), value: valutaValue, highlight: valutaFilled },
    {
      label: t(locale, "paymentCondition"),
      value: zkDisplay,
      highlight: zkDiffers,
    },
    { label: t(locale, "paymentType"), value: zaDisplay, highlight: zaDiffers },
  ];

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row justify-between gap-2">
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
          component="a"
          href={`${MEINL_AE_URL}?kdnr=${order.kdnr}`}
          target="_blank"
          leftSection={<IconBasketPlus size={16} />}
        >
          {t(locale, "newOrder")}
        </Button>
      </div>
      <header className="flex flex-col py-4">
        <h1>
          {t(locale, "order")} {order.auftragsbestellnummerIntern || id}
        </h1>
        <p className="text-sm">
          {t(locale, "createdOn")} {parseOrderDate(order.auftragsDatum, locale)}{" "}
          {t(locale, "by")} <b>{order.sachbearbeiter?.name}</b> (
          {order.sachbearbeiter?.kuerzel})
        </p>
      </header>

      <div className="overflow-x-auto shadow-2xl rounded-(--mantine-radius-default)">
        <Table variant="vertical">
          <Table.Tbody>
            {headRows
              .filter(
                ({ value }) => value !== "–" && value !== "" && value != null,
              )
              .map(({ label, value, highlight }) => (
                <Table.Tr key={label}>
                  <Table.Th w={200} bg="var(--background-subtle)">
                    {label}
                  </Table.Th>
                  <Table.Td
                    style={highlight ? { color: "var(--main)" } : undefined}
                  >
                    <span className="whitespace-pre-wrap">{value}</span>
                  </Table.Td>
                </Table.Tr>
              ))}
            {order.versandadresse &&
              Object.values(order.versandadresse).some(Boolean) && (
                <Table.Tr>
                  <Table.Th w={200} bg="var(--background-subtle)">
                    <div className="flex items-center gap-1">
                      {t(locale, "shippingAddress")}{" "}
                      {order.versandadresse?.vanr === "" && (
                        <Badge size="xs" variant="light" color="blue">
                          temp
                        </Badge>
                      )}
                    </div>
                  </Table.Th>
                  <Table.Td className="whitespace-normal!">
                    {(
                      [
                        { value: order.versandadresse?.name1, max: 30 },
                        { value: order.versandadresse?.name2, max: 30 },
                        { value: order.versandadresse?.name3, max: 30 },
                        { value: order.versandadresse?.strasse, max: 30 },
                        { value: order.versandadresse?.ort, max: 25 },
                        { value: order.versandadresse?.plz, max: 5 },
                        { value: order.versandadresse?.land, max: Infinity },
                      ] as { value: string | undefined; max: number }[]
                    )
                      .filter(({ value }) => value)
                      .map(({ value, max }, i) => (
                        <p key={i}>
                          {value!.slice(0, max)}
                          {value!.length > max && (
                            <span className="text-(--main) font-bold">
                              {value!.slice(max)}
                            </span>
                          )}
                        </p>
                      ))}
                  </Table.Td>
                </Table.Tr>
              )}
          </Table.Tbody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <div className="flex justify-between items-center">
          <h3>{t(locale, "orderDetails")}</h3>
          <SegmentedControl
            value={view}
            onChange={(v) => setView(v as "brand" | "list")}
            data={[
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconLayoutList size={16} />
                    {t(locale, "byBrand")}
                  </div>
                ),
                value: "brand",
              },
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconList size={16} />
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
          Object.entries(grouped).map(([marke, positions]) => (
            <Paper key={marke} p="md">
              <div className="flex flex-col gap-4">
                <h2 className="text-(--mantine-color-yellow-5)">{marke}</h2>
                <PositionsTable positions={positions} />
              </div>
            </Paper>
          ))}

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
              <NumberFormatter
                value={order.auftragsWert}
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
                prefix={`${order.company?.wkz ?? "USD"} `}
              />
            </b>
          </p>
        )}
      </div>
    </main>
  );
}
