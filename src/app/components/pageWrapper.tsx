"use client";
import { Avatar, Burger, Drawer } from "@mantine/core";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_WELCOME_KEY } from "../lib/constants";
import { isPreview } from "../lib/utils";
import FAB from "./fab";
import Loader from "./loader";
import Login from "./login";
import Logo from "./logo";
import Sidebar from "./sidebar";
import WelcomeModal from "./welcomeModal";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { locale } = useOffice();

  const [showWelcome, setShowWelcome] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const welcomeCompleted = localStorage.getItem(MEINL_OFFICE_WELCOME_KEY);
    setShowWelcome(welcomeCompleted !== "true");
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    dayjs.locale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="flex">
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        withCloseButton={false}
        padding={0}
        size={240}
        className="md:hidden"
      >
        <Sidebar asDrawer onClose={() => setDrawerOpen(false)} />
      </Drawer>
      <Sidebar />
      <main className="w-full flex flex-col">
        <header className="md:hidden shadow-2xl flex justify-between items-center gap-2 px-8 py-2">
          <Burger
            opened={drawerOpen}
            onClick={() => setDrawerOpen((o) => !o)}
            size="sm"
            aria-label="Toggle navigation"
          />
          <Link href="/">
            <Logo />
          </Link>
          <Avatar variant="filled" size={28} name={session?.user?.name ?? ""} />
        </header>
        {children}
      </main>
      <FAB />
      {showWelcome && isPreview && (
        <WelcomeModal onComplete={handleWelcomeComplete} />
      )}
    </div>
  );
}
