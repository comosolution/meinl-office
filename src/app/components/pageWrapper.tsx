"use client";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_WELCOME_KEY } from "../lib/constants";
import FAB from "./fab";
import Loader from "./loader";
import Login from "./login";
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
      <Sidebar />
      <main className="w-full flex flex-col">{children}</main>
      <FAB />
      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}
    </div>
  );
}
