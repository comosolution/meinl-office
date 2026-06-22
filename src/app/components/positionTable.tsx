import { NumberFormatter, Table } from "@mantine/core";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { OrderPosition } from "../lib/interfaces";

export function PositionsTable({ positions }: { positions: OrderPosition[] }) {
  const { locale } = useOffice();

  return (
    <div className="overflow-x-auto">
      <Table layout="fixed" style={{ fontSize: "var(--mantine-font-size-xs)" }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={50}>
              {t(locale as Parameters<typeof t>[0], "quantity")}
            </Table.Th>
            <Table.Th w={100}>
              {t(locale as Parameters<typeof t>[0], "articleNumber")}
            </Table.Th>
            <Table.Th w={220}>
              {t(locale as Parameters<typeof t>[0], "descriptionLabel")}
            </Table.Th>
            <Table.Th w={60} ta="right">
              {t(locale as Parameters<typeof t>[0], "listPrice")}
            </Table.Th>
            <Table.Th w={30} ta="right">
              %
            </Table.Th>
            <Table.Th w={30} ta="right">
              %
            </Table.Th>
            <Table.Th w={30} ta="right">
              %
            </Table.Th>
            <Table.Th w={60} ta="right">
              {t(locale as Parameters<typeof t>[0], "netPrice")}
            </Table.Th>
            <Table.Th w={50}>
              {t(locale as Parameters<typeof t>[0], "free")}
            </Table.Th>
            <Table.Th w={40}>Pos#</Table.Th>
            <Table.Th w={120}>
              {t(locale as Parameters<typeof t>[0], "remark")}
            </Table.Th>
            <Table.Th w={50}>
              {t(locale as Parameters<typeof t>[0], "active")}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {positions.map((pos, i) => (
            <Table.Tr key={i}>
              <Table.Td
                className={
                  pos.menge > pos.bestand ? "text-(--main) font-bold" : ""
                }
              >
                {pos.menge}
              </Table.Td>
              <Table.Td>{pos.artnr}</Table.Td>
              <Table.Td className="whitespace-normal! max-w-xs">
                {pos.artikelbezeichnung}
              </Table.Td>
              <Table.Td ta="right">
                <NumberFormatter
                  value={pos.listPreis}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Table.Td>
              <Table.Td
                ta="right"
                className={pos.rabatt1.modified ? "text-(--main)" : ""}
              >
                {pos.rabatt1.value}
              </Table.Td>
              <Table.Td
                ta="right"
                className={pos.rabatt2.modified ? "text-(--main)" : ""}
              >
                {pos.rabatt2.value}
              </Table.Td>
              <Table.Td
                ta="right"
                className={pos.rabatt3.modified ? "text-(--main)" : ""}
              >
                {pos.rabatt3.value}
              </Table.Td>
              <Table.Td
                ta="right"
                className={
                  pos.nettoPreis.modified
                    ? "text-(--main) font-bold"
                    : pos.preiskennzeichen !== ""
                      ? "text-(--mantine-color-blue-4) font-bold"
                      : ""
                }
              >
                <NumberFormatter
                  value={pos.nettoPreis.value}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Table.Td>
              <Table.Td className={pos.kostenlos ? "text-(--main)" : ""}>
                {pos.kostenlos ? t(locale, "yes") : ""}
              </Table.Td>
              <Table.Td>{pos.posnr}</Table.Td>
              <Table.Td className="whitespace-normal! max-w-xs">
                {pos.bemerkung}
              </Table.Td>
              <Table.Td className={pos.aktiv ? "text-(--main)" : ""}>
                {pos.aktiv ? t(locale, "yes") : ""}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
