import { ActionIcon, Menu } from "@mantine/core";
import {
  IconBasket,
  IconBuildings,
  IconExternalLink,
  IconNews,
  IconPlus,
  IconTicket,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useOffice } from "../context/officeContext";
import { MEINL_AE_URL, MEINL_AE_USA_URL } from "../lib/constants";
import { t } from "../lib/i18n";

export default function FAB() {
  const { locale, source } = useOffice();

  const data = [
    {
      label: t(locale, "newCompany"),
      href: "/comapny/new",
      icon: <IconBuildings size={16} />,
      disabled: true,
    },
    {
      label: t(locale, "newPerson"),
      href: "/person/new",
      icon: <IconUser size={16} />,
    },
    {
      label: t(locale, "newCampaign"),
      href: "/campaign/new",
      icon: <IconNews size={16} />,
      hidden: source !== "OFFGUT",
    },
    {
      label: t(locale, "newTicket"),
      href: "/ticket/new",
      icon: <IconTicket size={16} />,
      hidden: source !== "OFFGUT",
    },
    {
      label: t(locale, "newOrder"),
      href: `${source === "OFFGUT" ? MEINL_AE_URL : MEINL_AE_USA_URL}`,
      icon: <IconBasket size={16} />,
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 rounded-full shadow-md shadow-black/20">
      <Menu
        position="left-end"
        width={200}
        offset={4}
        trigger="click-hover"
        shadow="md"
        transitionProps={{ transition: "rotate-left", duration: 150 }}
      >
        <Menu.Target>
          <ActionIcon color="yellow" size="xl" radius="xl">
            <IconPlus />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {data
            .filter((e) => !e.hidden)
            .map((e, i) => (
              <Menu.Item
                key={i}
                leftSection={e.icon}
                rightSection={
                  e.external ? (
                    <IconExternalLink size={14} color="gray" />
                  ) : null
                }
                component={Link}
                href={e.href}
                target={e.external ? "_blank" : undefined}
                disabled={e.disabled}
              >
                {e.label}
              </Menu.Item>
            ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
