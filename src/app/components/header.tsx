"use client";
import { defaultBorder } from "../lib/styles";
import Search from "./search";

export default function Header() {
  return (
    <header
      className="w-full sticky top-0 z-30 flex gap-2 px-8 py-2 bg-white/50 backdrop-blur-md"
      style={{
        borderBottom: defaultBorder,
      }}
    >
      <Search />
    </header>
  );
}
