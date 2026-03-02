import { ActionIcon, Menu } from "@mantine/core";
import {
  IconBuildings,
  IconNews,
  IconPlus,
  IconTicket,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";

export default function FAB() {
  const data = [
    {
      label: "Neue Firma",
      href: "/comapny/new",
      icon: <IconBuildings size={16} />,
      disabled: true,
    },
    {
      label: "Neue Person",
      href: "/person/new",
      icon: <IconUser size={16} />,
      disabled: true,
    },
    {
      label: "Neue Kampagne",
      href: "/campaign/new",
      icon: <IconNews size={16} />,
    },
    {
      label: "Neues RMA Ticket",
      href: "/ticket/new",
      icon: <IconTicket size={16} />,
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
          <ActionIcon size="xl" radius="xl">
            <IconPlus />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {data.map((d, i) => (
            <Menu.Item
              key={i}
              leftSection={d.icon}
              component={Link}
              href={d.href}
              disabled={d.disabled}
            >
              {d.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
