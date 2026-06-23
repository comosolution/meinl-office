"use client";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import { useOffice } from "../context/officeContext";
import { NotificationCleaner } from "./notificationCleaner";
import PageWrapper from "./pageWrapper";

export default function App({ children }: { children: React.ReactNode }) {
  const { locale } = useOffice();

  return (
    <SessionProvider>
      <DatesProvider settings={{ locale: locale }}>
        <Notifications position="top-center" />
        <NotificationCleaner />
        <PageWrapper>{children}</PageWrapper>
      </DatesProvider>
    </SessionProvider>
  );
}
