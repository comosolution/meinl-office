"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import { MEINL_OFFICE_PERSON_HISTORY_KEY } from "@/app/lib/constants";
import { Company, Person, PersonInStorage } from "@/app/lib/interfaces";
import { getAvatarColor } from "@/app/lib/utils";
import { Avatar, Button, Tabs } from "@mantine/core";
import {
  IconChevronLeft,
  IconHistory,
  IconId,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InfoTab from "./tabs/infoTab";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [company, setCompany] = useState<Company>();
  const [person, setPerson] = useState<Person>();
  const [activeTab, setActiveTab] = useState<string | null>("info");

  useEffect(() => {
    getCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (company) {
      setPerson(company?.personen[0]);
    }
  }, [company]);

  useEffect(() => {
    updateHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

  const getCustomer = async () => {
    const response = await fetch(`/api/customer/${id}`, {
      method: "GET",
    });
    const companies = await response.json();
    setCompany(companies[0]);
  };

  const updateHistory = () => {
    if (!person) return;

    const newEntry: PersonInStorage = {
      kdnr: person.b2bnr,
      vorname: person.vorname,
      nachname: person.nachname,
      position: person.jobpos,
    };
    const history = JSON.parse(
      localStorage.getItem(MEINL_OFFICE_PERSON_HISTORY_KEY) || "[]"
    );

    const filteredHistory = history.filter(
      (item: PersonInStorage) => item.kdnr !== newEntry.kdnr
    );

    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 5);
    localStorage.setItem(
      MEINL_OFFICE_PERSON_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  };

  if (!person || !company) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2 px-4">
        <Button.Group>
          <Button
            color="gray"
            variant="light"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href="/person"
          >
            Alle Personen
          </Button>
          <Button
            color="gray"
            variant="transparent"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href={`/company/${company?.kdnr}`}
          >
            {company?.name1}
          </Button>
        </Button.Group>
        <Contact
          email={person.email}
          phone={person.telefon}
          mobile={person.mobil}
        />
      </div>
      <header className="flex items-center gap-4 p-4">
        <Avatar
          size={72}
          color={getAvatarColor(person.kdnr)}
          name={`${person.nachname[0]} ${person.vorname[0]}`}
        />
        <div className="flex flex-col gap-1 w-full">
          <h1>
            {person.nachname}, {person.vorname}
          </h1>
          <div className="flex justify-between items-baseline gap-2">
            <p>
              {person.jobpos.trim().length > 0 && `${person.jobpos} bei `}
              <Link href={`/company/${company?.kdnr}`} className="link">
                <b>{company?.name1}</b> ({company?.kdnr})
              </Link>
            </p>
            <p className="dimmed">{person.b2bnr}</p>
          </div>
        </div>
      </header>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<IconId size={16} />}>
            Persönliche Daten
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Historie
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Einstellungen
          </Tabs.Tab>
        </Tabs.List>

        <InfoTab person={person} />
      </Tabs>
    </main>
  );
}
