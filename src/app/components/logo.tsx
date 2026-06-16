"use client";
import Image from "next/image";
import { useOffice } from "../context/officeContext";

export default function Logo() {
  const { source } = useOffice();

  return (
    <div className="flex justify-center items-center">
      <Image src="/logo.svg" alt="Meinl Logo" width={32} height={32} />
      <p className="text-2xl tracking-tighter text-(--main)">
        Office{" "}
        {source === "OFFUSA" && (
          <span className="text-lg leading-none">USA</span>
        )}
      </p>
    </div>
  );
}
