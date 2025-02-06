"use client";
import { IconBuildingWarehouse } from "@tabler/icons-react";
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
    <main className="flex flex-col gap-8 px-8 py-4">
      <header className="flex justify-between items-baseline gap-2 p-4">
        <h1 className="text-4xl font-bold">Willkommen</h1>
      </header>
      <div className="grid grid-cols-2 gap-4">
        <HistoryList
          title="Firmen"
          storageKey={MEINL_OFFICE_COMPANY_HISTORY_KEY}
          linkPrefix="/company"
          getAvatar={() => <IconBuildingWarehouse size={24} />}
          getTitle={(company: CompanyInStorage) => company.name}
          getSubtitle={(company: CompanyInStorage) => company.kdnr}
        />
        <HistoryList
          title="Personen"
          storageKey={MEINL_OFFICE_PERSON_HISTORY_KEY}
          linkPrefix="/person"
          getAvatar={(person: PersonInStorage) =>
            `${person.nachname.substring(0, 1).toUpperCase()}${person.vorname
              .substring(0, 1)
              .toUpperCase()}`
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
