"use client";
import { Button } from "@mantine/core";
import { IconLock, IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import Logo from "./logo";

export default function AccessDenied() {
  const { locale } = useOffice();

  return (
    <main className="min-h-screen flex flex-col items-center justify-between gap-2 p-8">
      <Logo />
      <div className="flex flex-col items-center text-center justify-center gap-2">
        <IconLock size={64} />
        <h1>Access denied</h1>
        <p className="dimmed">
          Please contact your administrator to gain access.
        </p>
      </div>
      <Button leftSection={<IconLogout size={14} />} onClick={() => signOut()}>
        {t(locale, "logout")}
      </Button>
    </main>
  );
}
