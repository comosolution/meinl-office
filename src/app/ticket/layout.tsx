"use client";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import Link from "next/link";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { isPreview } from "../lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useOffice();

  return (
    <div>
      {children}
      {isPreview && (
        <div className="fixed bottom-8 right-22 z-50 rounded-full shadow-md shadow-black/20">
          <Tooltip
            label={t(locale, "showDocumentation")}
            position="left"
            withArrow
          >
            <ActionIcon
              color="blue"
              size="xl"
              radius="xl"
              component={Link}
              href="/settings/help?doc=1_ticket"
            >
              <IconHelp />
            </ActionIcon>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
