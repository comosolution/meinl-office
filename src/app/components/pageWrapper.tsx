"use client";
import { ActionIcon, Drawer } from "@mantine/core";
import { IconMenu3 } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_WELCOME_KEY } from "../lib/config";
import FAB from "./fab";
import Loader from "./loader";
import Login from "./login";
import Logo from "./logo";
import Search from "./search";
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
    return <Loader full />;
  }

  if (!session) {
    return <Login />;
  }

  /* if (!session.user?.roles?.includes("dev")) {
    return <AccessDenied />;
  } */

  return (
    <div className="flex">
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        withCloseButton={false}
        padding={0}
        size={240}
        overlayProps={{ blur: 4 }}
        className="md:hidden"
      >
        <Sidebar asDrawer onClose={() => setDrawerOpen(false)} />
      </Drawer>
      <Sidebar />
      <main className="w-full min-w-0 flex flex-col">
        <header className="md:hidden bg-(--background-subtle) flex justify-between items-center gap-2 p-4">
          <ActionIcon
            variant="transparent"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <IconMenu3 />
          </ActionIcon>
          <Link href="/">
            <Logo />
          </Link>
          <Search />
        </header>
        <div className="pb-20">{children}</div>
      </main>
      <FAB />
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}
    </div>
  );
}
