"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import { Company, Person } from "@/app/lib/interfaces";
import { Button, Tabs } from "@mantine/core";
import {
  IconChevronLeft,
  IconHistory,
  IconId,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

  const getCustomer = async () => {
    const response = await fetch(`/api/customer/${id}`, {
      method: "GET",
    });
    const companies = await response.json();
    setCompany(companies[0]);
  };

  return person && company ? (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2 px-4">
        <div className="flex gap-2">
          <Button
            color="gray"
            variant="light"
            size="xs"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href="/person"
          >
            Alle Personen
          </Button>
          <Button
            color="gray"
            variant="transparent"
            size="xs"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href={`/company/${company.kdnr}`}
          >
            {company.name1}
          </Button>
        </div>
        <Contact email={person.email} phone={person.telefon} />
      </div>
      <header className="flex flex-col gap-1 p-4">
        <h1 className="text-4xl">
          <b>
            {person.nachname}, {person.vorname}
          </b>
        </h1>
        <div className="flex justify-between items-baseline gap-2">
          <p>
            {person.position && `${person.position} bei `}
            <Link href={`/company/${company?.kdnr}`}>
              <b>{company?.name1}</b> ({company?.kdnr})
            </Link>
          </p>
          <p className="dimmed">{person.b2bnr}</p>
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

        <Tabs.Panel value="info" className="py-4">
          <form></form>
        </Tabs.Panel>
      </Tabs>
    </main>
  ) : (
    <Loader />
  );
}
