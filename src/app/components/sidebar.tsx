"use client";
import {
  ActionIcon,
  Badge,
  NavLink,
  SegmentedControl,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBuildings,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconMoon,
  IconNews,
  IconSun,
  IconTicket,
  IconUsersGroup,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_SIDEBAR_KEY } from "../lib/constants";
import { navLink } from "../lib/styles";
import Search from "./search";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { source, setSource, kundenart, setKundenart } = useOffice();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const router = useRouter();
  const path = usePathname();
  const nav = [
    {
      name: "Startseite",
      href: "/",
      icon: <IconLayoutDashboard size={20} />,
    },
    {
      name: "Firmen",
      href: "/company",
      icon: <IconBuildings size={20} />,
    },
    {
      name: "Personen",
      href: "/person",
      icon: <IconUsersGroup size={20} />,
    },
    {
      name: "Kampagnen",
      href: "/campaign",
      icon: <IconNews size={20} />,
    },
    {
      name: "RMA Tickets",
      href: "/ticket",
      icon: <IconTicket size={20} />,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", colorScheme === "dark");
  }, [colorScheme]);

  const SourceSwitch = () => {
    const name = source === "OFFGUT" ? "Deutschland" : "USA";

    return (
      <NavLink
        label={name}
        title={name}
        leftSection={source === "OFFGUT" ? <span>🇩🇪</span> : <span>🇺🇸</span>}
        styles={{
          root: navLink(isCollapsed),
        }}
        onClick={() => {
          setSource(source === "OFFGUT" ? "OFFUSA" : "OFFGUT");
          router.push("/");
        }}
      />
    );
  };

  const ThemeSwitch = () => {
    return mounted ? (
      <NavLink
        label="Theme"
        title="Theme"
        leftSection={
          colorScheme === "dark" ? (
            <IconSun size={20} />
          ) : (
            <IconMoon size={20} />
          )
        }
        styles={{
          root: navLink(isCollapsed),
        }}
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
      />
    ) : null;
  };

  const DevIndicator = () => {
    return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? (
      <Badge size="xs" variant="light" color="dark">
        DEV
      </Badge>
    ) : null;
  };

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
      className={`bg-(--background-subtle) h-screen ${
        isCollapsed ? "w-16" : "w-[260px]"
      } sticky top-0 z-50 flex flex-col gap-2 pt-4 shadow-2xl shadow-black/50 transition-all duration-300 overflow-x-hidden`}
    >
      <div
        className={`flex ${
          isCollapsed ? "flex-col" : "flex-row justify-between"
        } items-center gap-4 px-2`}
      >
        <Link
          href="/"
          className="flex justify-center items-center cursor-pointer hover:opacity-80"
        >
          <Image src="/logo.svg" alt="Meinl Logo" width={32} height={32} />
          {!isCollapsed && (
            <p className="text-2xl tracking-tighter text-[var(--main)]">
              Office
            </p>
          )}
        </Link>
        <DevIndicator />
        <ActionIcon color="dark" variant="transparent" onClick={toggleSidebar}>
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand size={20} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={20} />
          )}
        </ActionIcon>
      </div>
      <div>
        <SegmentedControl
          value={kundenart}
          onChange={setKundenart}
          data={[
            { label: "Alle", value: "all" },
            { label: "B2B", value: "b2b" },
            { label: "B2C", value: "b2c" },
          ]}
          orientation={isCollapsed ? "vertical" : "horizontal"}
          fullWidth
        />
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
                title={entry.name}
                active={active}
                color="red"
                variant={active ? "filled" : "subtle"}
                leftSection={entry.icon}
                component={Link}
                href={entry.href}
                styles={{
                  root: navLink(isCollapsed),
                }}
              />
            );
          })}
        </div>
        <div>
          <SourceSwitch />
          <ThemeSwitch />
          <NavLink
            label="Ausloggen"
            title="Ausloggen"
            active
            color="dark"
            leftSection={<IconLogout size={20} />}
            styles={{
              root: navLink(isCollapsed),
            }}
            onClick={() => signOut()}
          />
        </div>
      </nav>
    </aside>
  );
}
