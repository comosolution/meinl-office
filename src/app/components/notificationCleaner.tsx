"use client";
import { notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function NotificationCleaner() {
  const pathname = usePathname();

  useEffect(() => {
    notifications.clean();
  }, [pathname]);

  return null;
}
