"use client";
import { useOffice } from "../context/officeContext";
import Loader from "./loader";
import Sidebar from "./sidebar";

export default function App({ children }: { children: React.ReactNode }) {
  const { loading } = useOffice();

  return loading ? (
    <main className="w-screen h-screen flex justify-center items-center">
      <Loader />
    </main>
  ) : (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex flex-col">{children}</main>
    </div>
  );
}
