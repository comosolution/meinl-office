"use client";
import { SessionProvider } from "next-auth/react";
import { useOffice } from "../context/officeContext";
import Loader from "./loader";
import PageWrapper from "./pageWrapper";

export default function App({ children }: { children: React.ReactNode }) {
  const { loading } = useOffice();

  if (loading) {
    return <Loader />;
  }

  return (
    <SessionProvider>
      <PageWrapper>{children}</PageWrapper>
    </SessionProvider>
  );
}
