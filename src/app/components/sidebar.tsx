"use client";
import {
  ActionIcon,
  Avatar,
  Badge,
  Menu,
  NavLink,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBasket,
  IconBuildings,
  IconHistory,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconMoon,
  IconNews,
  IconSun,
  IconTicket,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useOffice } from "../context/officeContext";
import { MEINL_AE_USA_URL, MEINL_OFFICE_SIDEBAR_KEY } from "../lib/config";
import { t } from "../lib/i18n";
import { navLink } from "../lib/styles";
import { isPreview } from "../lib/utils";
import Search from "./search";

export default function Sidebar({
  asDrawer = false,
  onClose,
}: {
  asDrawer?: boolean;
  onClose?: () => void;
}) {
  const { data: session } = useSession();
  const { source, setSource, locale, setLocale } = useOffice();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const router = useRouter();
  const path = usePathname();

  const collapsed = asDrawer ? false : isCollapsed;

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
      hidden: source !== "OFFGUT",
    },
    {
      name: t(locale, "tickets"),
      href: "/ticket",
      icon: <IconTicket size={20} />,
      hidden: source !== "OFFGUT",
    },
    {
      name: t(locale, "orders"),
      href: MEINL_AE_USA_URL,
      icon: <IconBasket size={20} />,
      hidden: source !== "OFFUSA",
      external: true,
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
        leftSection={
          <div className="w-5">
            <ReactCountryFlag
              countryCode={source === "OFFGUT" ? "DE" : "US"}
              svg
            />
          </div>
        }
        styles={{
          root: navLink(collapsed),
        }}
        onClick={() => {
          setSource(source === "OFFGUT" ? "OFFUSA" : "OFFGUT");
          router.push("/");
          onClose?.();
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
            <ReactCountryFlag countryCode={locale === "de" ? "DE" : "US"} />
          </div>
        }
        styles={{
          root: navLink(collapsed),
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
    return isPreview ? (
      <Badge size="xs" variant="light" color="yellow">
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

  const content = (
    <>
      <div
        className={`flex ${
          collapsed ? "flex-col" : "flex-row justify-between"
        } items-center gap-2 px-2`}
      >
        <Link
          href="/"
          className="flex justify-center items-center cursor-pointer hover:opacity-80"
          onClick={() => onClose?.()}
        >
          <Image src="/logo.svg" alt="Meinl Logo" width={32} height={32} />
          {!collapsed && (
            <p className="text-2xl tracking-tighter text-(--main)">
              Office{" "}
              {source === "OFFUSA" && (
                <span className="text-lg leading-none">USA</span>
              )}
            </p>
          )}
        </Link>
        <DevIndicator />
        {!asDrawer && (
          <ActionIcon
            color="gray"
            variant="transparent"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <IconLayoutSidebarLeftExpand size={20} />
            ) : (
              <IconLayoutSidebarLeftCollapse size={20} />
            )}
          </ActionIcon>
        )}
      </div>
      <nav className="h-full flex flex-col place-content-between">
        <div className="flex flex-col">
          {!asDrawer && <Search inSidebar collapsed={collapsed} />}
          {nav
            .filter((e) => !e.hidden)
            .map((e, i) => {
              const active =
                (path.includes(e.href) && e.href !== "/") ||
                (path === "/" && e.href === "/");

              return (
                <NavLink
                  key={i}
                  label={e.name}
                  title={e.name}
                  active={active}
                  color="red"
                  variant={active ? "filled" : "subtle"}
                  leftSection={e.icon}
                  component={Link}
                  href={e.href}
                  target={e.external ? "_blank" : undefined}
                  styles={{
                    root: navLink(collapsed),
                  }}
                  onClick={() => onClose?.()}
                />
              );
            })}
        </div>
        <div className="flex flex-col">
          <SourceSwitch />
          <LanguageSwitch />
          <Menu
            shadow="md"
            width={220}
            trigger={asDrawer ? "click" : "click-hover"}
            position={asDrawer ? "top" : "right-end"}
            offset={0}
            loop={false}
            trapFocus={false}
            menuItemTabIndex={0}
          >
            <Menu.Target>
              <NavLink
                label={session?.user?.name ?? t(locale, "profile")}
                title={session?.user?.name ?? t(locale, "profile")}
                styles={{
                  root: navLink(collapsed),
                }}
                leftSection={
                  <Avatar
                    color="yellow"
                    variant="light"
                    size={20}
                    name={session?.user?.name ?? ""}
                  />
                }
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{session?.user?.email}</Menu.Label>
              <Menu.Item
                leftSection={<IconUserCircle size={14} />}
                component={Link}
                href="/settings/profile"
                onClick={() => onClose?.()}
              >
                {t(locale, "profile")}
              </Menu.Item>
              <Menu.Item
                leftSection={<IconHistory size={14} />}
                component={Link}
                href="/settings/changelog"
                onClick={() => onClose?.()}
              >
                {t(locale, "changelog")}
              </Menu.Item>
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
    </>
  );

  if (asDrawer) {
    return (
      <div className="bg-(--background-subtle) flex flex-col gap-2 pt-4 overflow-x-hidden">
        {content}
      </div>
    );
  }

  return (
    <aside
      className={`bg-(--background-subtle) h-screen ${
        collapsed ? "w-16" : "w-54"
      } shrink-0 sticky top-0 z-50 hidden md:flex flex-col gap-2 pt-4 shadow-2xl shadow-black/50 transition-all duration-300 overflow-x-hidden`}
    >
      {content}
    </aside>
  );
}
