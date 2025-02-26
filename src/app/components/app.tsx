"use client";
import { SessionProvider } from "next-auth/react";
import { useOffice } from "../context/officeContext";
import Loader from "./loader";
import PageWrapper from "./pageWrapper";

export default function App({ children }: { children: React.ReactNode }) {
  const { loading } = useOffice();

  return loading ? (
    <main className="w-screen h-screen flex justify-center items-center">
      <Loader />
    </main>
  ) : (
    <SessionProvider>
      <PageWrapper>{children}</PageWrapper>
    </SessionProvider>
  );
}
