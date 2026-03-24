"use client";
import { SessionProvider } from "next-auth/react";
import PageWrapper from "./pageWrapper";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PageWrapper>{children}</PageWrapper>
    </SessionProvider>
  );
}
