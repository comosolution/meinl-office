"use client";
import { Button } from "@mantine/core";
import { IconError404, IconRefresh } from "@tabler/icons-react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function SourceRequired({
  requiredSource,
}: {
  requiredSource: "OFFGUT" | "OFFUSA";
}) {
  const { locale, setSource } = useOffice();

  const sourceName =
    requiredSource === "OFFGUT"
      ? t(locale, "sourceGermany")
      : t(locale, "sourceUSA");

  return (
    <main className="flex flex-col items-center text-center justify-center gap-2 px-4 py-24">
      <IconError404 size={64} />
      <p className="dimmed">
        {t(locale, "pageOnlyAvailableIn")} Office {sourceName}.
      </p>
      <Button
        variant="light"
        leftSection={<IconRefresh size={16} />}
        onClick={() => setSource(requiredSource)}
      >
        {t(locale, "switchTo")} Office {sourceName}
      </Button>
    </main>
  );
}
