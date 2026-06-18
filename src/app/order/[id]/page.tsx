"use client";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const { locale, source } = useOffice();

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
        </div>
        <div className="flex flex-col md:flex-row gap-2"></div>
      </div>
      <header className="flex items-center gap-4 py-4">
        <h1>
          {t(locale, "order")} {id}
        </h1>
      </header>
    </main>
  );
}
