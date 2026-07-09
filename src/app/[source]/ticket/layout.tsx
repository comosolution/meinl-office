"use client";
import HelpFAB from "../../components/helpFab";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <HelpFAB doc="1_ticket" />
    </div>
  );
}
