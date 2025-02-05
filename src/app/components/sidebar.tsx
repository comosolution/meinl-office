"use client";
import {
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconUserCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import { defaultBorder } from "../lib/styles";

export default function Sidebar() {
  const nav = [
    {
      name: "Startseite",
      href: "/",
      icon: <IconLayoutDashboard size={20} />,
    },
    {
      name: "Kunden",
      href: "/company",
      icon: <IconBuildingWarehouse size={20} />,
    },
    {
      name: "Personen",
      href: "/person",
      icon: <IconUserCircle size={20} />,
    },
  ];

  return (
    <aside
      className="h-screen w-[240px] sticky top-0 z-50 flex flex-col gap-8 p-4 shadow-xl"
      style={{
        borderRight: defaultBorder,
        backgroundImage: "linear-gradient(to top, #f3e7e9 66%, #f5f5f5 100%)",
      }}
    >
      <Link href="/">
        <header className="flex items-center px-4">
          <Image src="/logo.svg" alt="Meinl Logo" width={24} height={24} />
          <h1 className="text-xl font-bold tracking-tighter">Office</h1>
        </header>
      </Link>
      <nav className="flex flex-col gap-2">
        {nav.map((entry, index) => (
          <NavItem
            key={index}
            icon={entry.icon}
            name={entry.name}
            href={entry.href}
          />
        ))}
      </nav>
    </aside>
  );
}

function NavItem({
  icon,
  name,
  href,
}: {
  icon: JSX.Element;
  name: string;
  href: string;
}) {
  const path = usePathname();
  const active =
    (path.includes(href) && href !== "/") || (path === "/" && href === "/");

  return (
    <Link
      href={href}
      className="flex gap-2 px-4 py-2 rounded-md hover:bg-white/50 transition-all duration-300"
      style={{
        color: active ? "var(--foreground)" : "var(--mantine-color-dimmed)",
        background: active ? "rgba(255, 255, 255, 0.5)" : "",
      }}
    >
      {icon}
      <p className="font-medium">{name}</p>
    </Link>
  );
}
