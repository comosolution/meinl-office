"use client";
import { Button } from "@mantine/core";
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
import Search from "./search";

export default function Sidebar() {
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
      className="h-screen w-[260px] sticky top-0 z-50 flex flex-col gap-8 p-4 shadow-xl"
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

      <nav className="flex flex-col gap-2">
        <Search />
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
    <Button
      color="dark"
      variant={active ? "filled" : "transparent"}
      justify="left"
      leftSection={icon}
      component={Link}
      href={href}
    >
      {name}
    </Button>
  );
}
