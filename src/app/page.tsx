"use client";
import { Avatar } from "@mantine/core";
import HistoryList from "./components/history";
import { useOffice } from "./context/officeContext";
import {
  MEINL_OFFICE_COMPANY_HISTORY_KEY,
  MEINL_OFFICE_PERSON_HISTORY_KEY,
} from "./lib/constants";
import { CompanyInStorage, PersonInStorage } from "./lib/interfaces";

export default function Page() {
  const { companies } = useOffice();

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
        <HistoryList
          title="Firmen"
          storageKey={MEINL_OFFICE_COMPANY_HISTORY_KEY}
          linkPrefix="/company"
          getAvatar={(company: CompanyInStorage) =>
            company.name[0].toUpperCase()
          }
          getTitle={(company: CompanyInStorage) => company.name}
          getSubtitle={(company: CompanyInStorage) => company.kdnr}
        />
        <HistoryList
          title="Personen"
          storageKey={MEINL_OFFICE_PERSON_HISTORY_KEY}
          linkPrefix="/person"
          getAvatar={(person: PersonInStorage) =>
            `${person.nachname[0].toUpperCase()}${person.vorname[0].toUpperCase()}`
          }
          getTitle={(person) => `${person.nachname}, ${person.vorname}`}
          getSubtitle={(person) => {
            return `${person.position && `${person.position} bei `}${
              companies.find(
                (c) => c.kdnr.toString() === person.kdnr.split("-")[0]
              )?.name1
            }`;
          }}
        />
      </div>
    </main>
  );
}
