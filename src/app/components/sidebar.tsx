"use client";
import {
  ActionIcon,
  Avatar,
  Badge,
  Menu,
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
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_SIDEBAR_KEY } from "../lib/constants";
import { t } from "../lib/i18n";
import { navLink } from "../lib/styles";
import Search from "./search";

export default function Sidebar() {
  const { data: session } = useSession();
  const { source, setSource, service, setService, locale, setLocale } =
    useOffice();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const router = useRouter();
  const path = usePathname();

  const nav = [
    {
      name: t(locale, "startPage"),
      href: "/",
      icon: <IconLayoutDashboard size={20} />,
    },
    {
      name: t(locale, "companies"),
      href: "/company",
      icon: <IconBuildings size={20} />,
    },
    {
      name: t(locale, "people"),
      href: "/person",
      icon: <IconUsersGroup size={20} />,
    },
    {
      name: t(locale, "campaigns"),
      href: "/campaign",
      icon: <IconNews size={20} />,
    },
    {
      name: t(locale, "tickets"),
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

  const ServiceSwitch = () => {
    return (
      <SegmentedControl
        value={service}
        onChange={setService}
        data={[{ label: t(locale, "all"), value: "" }, "B2B", "B2C"]}
        orientation={isCollapsed ? "vertical" : "horizontal"}
        fullWidth
      />
    );
  };

  const SourceSwitch = () => {
    const name = source === "OFFGUT" ? "Deutschland" : "USA";

    return (
      <NavLink
        label={name}
        title={name}
        leftSection={
          <div className="w-5">
            <ReactCountryFlag countryCode={source === "OFFGUT" ? "DE" : "US"} />
          </div>
        }
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

  const LanguageSwitch = () => {
    return (
      <NavLink
        label={t(locale, "language")}
        title={t(locale, "language")}
        leftSection={
          <div className="w-5">
            <ReactCountryFlag countryCode={locale === "de" ? "DE" : "US"} svg />
          </div>
        }
        styles={{
          root: navLink(isCollapsed),
        }}
        onClick={() => {
          setLocale(locale === "de" ? "en" : "de");
        }}
      />
    );
  };

  const ThemeSwitch = () => {
    const name = colorScheme === "dark" ? "Dark Theme" : "Light Theme";

    return mounted ? (
      <Menu.Item
        leftSection={
          colorScheme === "dark" ? (
            <IconMoon size={14} />
          ) : (
            <IconSun size={14} />
          )
        }
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
      >
        {name}
      </Menu.Item>
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
        } items-center gap-2 px-2`}
      >
        <Link
          href="/"
          className="flex justify-center items-center cursor-pointer hover:opacity-80"
        >
          <Image src="/logo.svg" alt="Meinl Logo" width={32} height={32} />
          {!isCollapsed && (
            <p className="text-2xl tracking-tighter text-(--main)">Office</p>
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
      <ServiceSwitch />
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
        <div className="flex flex-col">
          <LanguageSwitch />
          <SourceSwitch />
          <Menu
            shadow="md"
            width={200}
            trigger="click-hover"
            position="right-end"
            offset={0}
            loop={false}
            trapFocus={false}
            menuItemTabIndex={0}
          >
            <Menu.Target>
              <NavLink
                label={session?.user?.name}
                title={session?.user?.name ?? ""}
                styles={{
                  root: navLink(isCollapsed),
                }}
                leftSection={
                  <Avatar
                    color="red"
                    size={20}
                    name={session?.user?.name ?? ""}
                  />
                }
                className="mb-2"
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{session?.user?.email}</Menu.Label>
              <ThemeSwitch />
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                onClick={() => signOut()}
              >
                {t(locale, "logout")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </nav>
    </aside>
  );
}
