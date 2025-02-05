"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import { Company } from "@/app/lib/interfaces";
import { Button, Tabs } from "@mantine/core";
import {
  IconBuildingEstate,
  IconChevronLeft,
  IconHistory,
  IconSettings,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import EmployeesTab from "./tabs/employeesTab";
import InfoTab from "./tabs/infoTab";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [company, setCompany] = useState<Company>();
  const [activeTab, setActiveTab] = useState<string | null>("info");

  useEffect(() => {
    getCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getCustomer = async () => {
    const response = await fetch(`/api/customer/${id}`, {
      method: "GET",
    });
    const companies = await response.json();
    setCompany(companies[0]);
  };

  return company ? (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2 px-4">
        <Button
          variant="light"
          color="gray"
          size="xs"
          leftSection={<IconChevronLeft size={16} />}
          component={Link}
          href="/company"
        >
          Alle Kunden
        </Button>
        <Contact email={company.email} phone={company.telefon} />
      </div>
      <header className="flex justify-between items-baseline gap-2 p-4">
        <h1 className="text-4xl">
          <b>{company.name1}</b> {company.name2} {company.name3}
        </h1>
        <p className="dimmed">{company.kdnr}</p>
      </header>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<IconBuildingEstate size={16} />}>
            Firmendaten
          </Tabs.Tab>
          <Tabs.Tab
            value="employees"
            leftSection={<IconUsersGroup size={16} />}
          >
            Mitarbeiter
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Historie
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Einstellungen
          </Tabs.Tab>
        </Tabs.List>

        <InfoTab company={company} />
        <EmployeesTab company={company} />
      </Tabs>
    </main>
  ) : (
    <Loader />
  );
}
