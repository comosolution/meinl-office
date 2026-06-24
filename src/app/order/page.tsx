"use client";
import { Button, SegmentedControl, TextInput } from "@mantine/core";
import { IconBasketPlus, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import OrderTable from "../components/orderTable";
import SourceRequired from "../components/sourceRequired";
import { useOffice } from "../context/officeContext";
import { MEINL_AE_USA_URL } from "../lib/config";
import { t } from "../lib/i18n";

export default function Page() {
  const { locale, source } = useOffice();
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState("I");

  if (source === "OFFGUT") return <SourceRequired requiredSource="OFFUSA" />;

  return (
    <main className="flex flex-col gap-4 px-4 md:px-8 py-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 py-4">
        <h1>{t(locale, "orders")}</h1>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <TextInput
            variant="unstyled"
            placeholder={t(locale, "searchOrders")}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <SegmentedControl
            data={[
              { label: t(locale, "internal"), value: "I" },
              { label: "B2B", value: "B" },
              { label: "EDI", value: "E" },
            ]}
            value={target}
            onChange={setTarget}
          />
          <Button
            component={Link}
            href={MEINL_AE_USA_URL}
            target="_blank"
            leftSection={<IconBasketPlus size={16} />}
          >
            {t(locale, "newOrder")}
          </Button>
        </div>
      </header>
      <OrderTable search={search} target={target} />
    </main>
  );
}
