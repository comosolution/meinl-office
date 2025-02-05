"use client";
import { ActionIcon, NavLink } from "@mantine/core";
import {
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MEINL_OFFICE_SIDEBAR_KEY } from "../lib/constants";
import { defaultBorder, navLink } from "../lib/styles";
import Search from "./search";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const path = usePathname();
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

  useEffect(() => {
    const savedState = localStorage.getItem(MEINL_OFFICE_SIDEBAR_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem(MEINL_OFFICE_SIDEBAR_KEY, (!prev).toString());
      return !prev;
    });
  };

  return (
    <aside
      className={`h-screen ${
        isCollapsed ? "w-[64px]" : "w-[260px]"
      } sticky top-0 z-50 flex flex-col gap-4 py-4 shadow-2xl transition-all duration-300 overflow-x-hidden`}
      style={{
        borderRight: defaultBorder,
        backgroundImage:
          "linear-gradient(23deg, var(--main) -33%, #f3e7e9 33%, #f5f5f5 100%)",
      }}
    >
      <div
        className={`flex ${
          isCollapsed ? "flex-col items-center" : "flex-row justify-between"
        } gap-2 px-2`}
      >
        <Link href="/">
          <header className="flex justify-center items-center">
            <Image src="/logo.svg" alt="Meinl Logo" width={24} height={24} />
            {!isCollapsed && (
              <h1 className="text-xl font-bold tracking-tighter">Office</h1>
            )}
          </header>
        </Link>
        <ActionIcon color="dark" variant="light" onClick={toggleSidebar}>
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand size={20} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={20} />
          )}
        </ActionIcon>
      </div>

      <nav className="h-full flex flex-col place-content-between">
        <div className="flex flex-col">
          <Search collapsed={isCollapsed} />
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
                className={navLink(isCollapsed)}
              />
            );
          })}
        </div>
        <NavLink
          label="Ausloggen"
          active
          color="white"
          leftSection={<IconLogout size={20} />}
          className={navLink(isCollapsed)}
        />
      </nav>
    </aside>
  );
}
