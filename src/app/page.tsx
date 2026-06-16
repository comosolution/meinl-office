"use client";
import { Avatar } from "@mantine/core";
import { IconBuildings, IconBuildingWarehouse } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import packageJson from "../../package.json";
import HistoryList from "./components/history";
import Title from "./components/title";
import { useOffice } from "./context/officeContext";
import {
  MEINL_OFFICE_COMPANY_HISTORY_KEY,
  MEINL_OFFICE_DEALER_HISTORY_KEY,
  MEINL_OFFICE_PERSON_HISTORY_KEY,
} from "./lib/config";
import { t } from "./lib/i18n";
import {
  CompanyInStorage,
  DealerInStorage,
  PersonInStorage,
} from "./lib/interfaces";
import { getAvatarColor } from "./lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const { locale } = useOffice();

  return (
    <main className="flex flex-col gap-2 px-4 md:px-8 py-4">
      <header className="flex flex-col lg:flex-row justify-between items-center gap-2 py-4">
        <Title />
        <Link
          href="/settings/profile"
          className="flex flex-row-reverse lg:flex-row items-center gap-2 hover:text-(--main) transition-all"
        >
          <div className="flex flex-col lg:items-end">
            <h3>{session?.user?.name}</h3>
            <p className="dimmed text-xs">{session?.user?.email}</p>
          </div>
          <Avatar
            color="yellow"
            variant="light"
            size={48}
            name={session?.user?.name ?? ""}
          />
        </Link>
      </header>
      <div className="grid lg:grid-cols-3 gap-4">
        <HistoryList
          title={t(locale, "companies")}
          storageKey={MEINL_OFFICE_COMPANY_HISTORY_KEY}
          link={(company: CompanyInStorage) => `/company/${company.kdnr}`}
          getAvatar={(company: CompanyInStorage) => (
            <Avatar
              size={48}
              variant="filled"
              color={getAvatarColor(company.kundenart)}
            >
              <IconBuildings />
            </Avatar>
          )}
          getTitle={(company: CompanyInStorage) => company.name}
          getSubtitle={(company: CompanyInStorage) => company.kdnr}
          getSource={(company: CompanyInStorage) => company.source}
        />
        <HistoryList
          title={t(locale, "dealers")}
          storageKey={MEINL_OFFICE_DEALER_HISTORY_KEY}
          link={(company: DealerInStorage) =>
            `/company/${company.kdnr}/${company.id}`
          }
          getAvatar={(company: DealerInStorage) => (
            <Avatar
              size={48}
              variant="filled"
              color={getAvatarColor(company.kundenart)}
            >
              <IconBuildingWarehouse />
            </Avatar>
          )}
          getTitle={(company: DealerInStorage) => company.name}
          getSubtitle={(company: DealerInStorage) =>
            `${company.kdnr}-${company.id}`
          }
          getSource={(company: DealerInStorage) => company.source}
        />
        <HistoryList
          title={t(locale, "people")}
          storageKey={MEINL_OFFICE_PERSON_HISTORY_KEY}
          link={(person) => `/person/${person.id}`}
          getAvatar={(person: PersonInStorage) => (
            <Avatar
              size={48}
              color={getAvatarColor(person.kundenart)}
              name={`${person.nachname} ${person.vorname}`}
            />
          )}
          getTitle={(person) => `${person.nachname}, ${person.vorname}`}
          getSubtitle={(person) => person.company ?? ""}
          getSource={(person: PersonInStorage) => person.source}
        />
      </div>
      <footer className="flex justify-center py-4">
        <Link
          href="/settings/changelog"
          className="link text-xs text-center dimmed"
        >
          Meinl Office {packageJson.version}
        </Link>
      </footer>
    </main>
  );
}
