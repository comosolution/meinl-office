"use client";
import { Avatar, Button } from "@mantine/core";
import {
  IconBuildings,
  IconBuildingWarehouse,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import HistoryList from "./components/history";
import {
  MEINL_OFFICE_COMPANY_HISTORY_KEY,
  MEINL_OFFICE_DEALER_HISTORY_KEY,
  MEINL_OFFICE_PERSON_HISTORY_KEY,
} from "./lib/constants";
import {
  CompanyInStorage,
  DealerInStorage,
  PersonInStorage,
} from "./lib/interfaces";
import { getAvatarColor } from "./lib/utils";

export default function Page() {
  return (
    <main className="flex flex-col gap-4 px-8 py-4">
      <header className="flex justify-between items-center gap-2 p-4">
        <h1>Willkommen</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <h3>Max Mustermann</h3>
            <p className="dimmed">max.mustermann@meinl.de</p>
          </div>
          <Avatar size={48}>MM</Avatar>
        </div>
      </header>
      <div className="grid lg:grid-cols-2 gap-4">
        {[
          {
            label: "Firmen",
            icon: <IconBuildings size={24} />,
            href: "/company",
          },
          {
            label: "Personen",
            icon: <IconUsersGroup size={24} />,
            href: "/person",
          },
        ].map((item, index) => (
          <Button
            key={index}
            color="gray"
            variant="light"
            size="xl"
            radius="md"
            component={Link}
            href={item.href}
            leftSection={item.icon}
          >
            Alle {item.label}
          </Button>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <HistoryList
          title="Firmen"
          storageKey={MEINL_OFFICE_COMPANY_HISTORY_KEY}
          link={(company: CompanyInStorage) => `/company/${company.kdnr}`}
          getAvatar={(company: CompanyInStorage) => (
            <Avatar
              size={48}
              variant="filled"
              color={getAvatarColor(company.kdnr)}
            >
              <IconBuildings />
            </Avatar>
          )}
          getTitle={(company: CompanyInStorage) => company.name}
          getSubtitle={(company: CompanyInStorage) => company.kdnr}
        />
        <HistoryList
          title="Händler"
          storageKey={MEINL_OFFICE_DEALER_HISTORY_KEY}
          link={(company: DealerInStorage) =>
            `/company/${company.kdnr}/${company.id}`
          }
          getAvatar={(company: DealerInStorage) => (
            <Avatar
              size={48}
              variant="filled"
              color={getAvatarColor(company.kdnr)}
            >
              <IconBuildingWarehouse />
            </Avatar>
          )}
          getTitle={(company: DealerInStorage) => company.name}
          getSubtitle={(company: DealerInStorage) =>
            `${company.kdnr}-${company.id}`
          }
        />
        <HistoryList
          title="Personen"
          storageKey={MEINL_OFFICE_PERSON_HISTORY_KEY}
          link={(person) => `/person/${person.id}`}
          getAvatar={(person: PersonInStorage) => (
            <Avatar
              size={48}
              color={getAvatarColor(person.kdnr)}
              name={`${person.nachname} ${person.vorname}`}
            />
          )}
          getTitle={(person) => `${person.nachname}, ${person.vorname}`}
          getSubtitle={(person) => {
            return `${person.position || "Mitarbeiter"} bei ${person.company}`;
          }}
        />
      </div>
    </main>
  );
}
