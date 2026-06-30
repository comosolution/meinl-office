"use client";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import Link from "next/link";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function HelpFAB({ doc }: { doc: string }) {
  const { locale } = useOffice();

  return (
    <div className="fixed bottom-8 right-22 z-50 rounded-full shadow-md shadow-black/20">
      <Tooltip label={t(locale, "showDocumentation")} position="left" withArrow>
        <ActionIcon
          color="blue"
          size="xl"
          radius="xl"
          component={Link}
          href={`/settings/help?doc=${doc}`}
        >
          <IconHelp />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
