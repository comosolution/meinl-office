"use client";
import { NavLink } from "@mantine/core";
import {
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultBorder } from "../lib/styles";
import Search from "./search";

export default function Sidebar() {
  const path = usePathname();
  const nav = [
    {
      name: "Startseite",
      href: "/",
      icon: <IconLayoutDashboard size={16} />,
    },
    {
      name: "Kunden",
      href: "/company",
      icon: <IconBuildingWarehouse size={16} />,
    },
    {
      name: "Personen",
      href: "/person",
      icon: <IconUserCircle size={16} />,
    },
  ];

  return (
    <aside
      className="h-screen w-[260px] sticky top-0 z-50 flex flex-col gap-4 py-4 shadow-2xl"
      style={{
        borderRight: defaultBorder,
        backgroundImage:
          "linear-gradient(23deg, var(--main) -33%, #f3e7e9 33%, #f5f5f5 100%)",
      }}
    >
      <Link href="/">
        <header className="flex justify-center items-center">
          <Image src="/logo.svg" alt="Meinl Logo" width={24} height={24} />
          <h1 className="text-xl font-bold tracking-tighter">Office</h1>
        </header>
      </Link>
      <nav className="h-full flex flex-col place-content-between">
        <div className="flex flex-col">
          <Search />
          {nav.map((entry, index) => {
            const active =
              (path.includes(entry.href) && entry.href !== "/") ||
              (path === "/" && entry.href === "/");

            return (
              <NavLink
                key={index}
                label={entry.name}
                active={active}
                color={active ? "dark" : "red"}
                variant={active ? "filled" : "subtle"}
                leftSection={entry.icon}
                component={Link}
                href={entry.href}
              />
            );
          })}
        </div>
        <NavLink
          label="Ausloggen"
          active
          color="dark"
          leftSection={<IconLogout size={16} />}
        />
      </nav>
    </aside>
  );
}
