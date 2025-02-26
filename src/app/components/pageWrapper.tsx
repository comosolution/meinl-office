"use client";
import { useSession } from "next-auth/react";
import Loader from "./loader";
import Login from "./login";
import Sidebar from "./sidebar";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

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
    </div>
  );
}
