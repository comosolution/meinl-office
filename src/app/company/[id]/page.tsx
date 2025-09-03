"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import Map from "@/app/components/map";
import { MEINL_OFFICE_COMPANY_HISTORY_KEY } from "@/app/lib/constants";
import { Company, CompanyInStorage } from "@/app/lib/interfaces";
import { getAvatarColor } from "@/app/lib/utils";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Fieldset,
  NumberInput,
  Tabs,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBuildingEstate,
  IconChevronLeft,
  IconCircleCheck,
  IconCircleX,
  IconDeviceFloppy,
  IconEdit,
  IconHistory,
  IconSettings,
  IconShoppingCartPin,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getInitialValues, validateForm } from "./form";
import EmployeesTab from "./tabs/employeesTab";

const brands = [
  "Meinl Cymbals",
  "Meinl Percussion",
  "Meinl Sonic Energy",
  "Meinl Stick & Brush",
  "Nino Percussion",
  "Ortega",
  "Ibanez",
  "Tama",
  "Hardcase",
  "Backun",
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [company, setCompany] = useState<Company>();
  const [activeTab, setActiveTab] = useState<string | null>("info");
  const [edit, setEdit] = useState(false);

  const form = useForm<Company>({
    initialValues: getInitialValues({} as Company),
    validateInputOnChange: true,
    validate: validateForm,
  });

  useEffect(() => {
    getCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!company) return;
    updateHistory();
    form.setValues(getInitialValues(company));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const getCompany = async () => {
    const response = await fetch(`/api/customer/${id}`);
    const companies = await response.json();
    setCompany(companies[0]);
  };

  const updateHistory = () => {
    if (!company) return;

    const newEntry: CompanyInStorage = {
      kdnr: company.kdnr.toString(),
      name: company.name1,
    };

    const history: CompanyInStorage[] = JSON.parse(
      localStorage.getItem(MEINL_OFFICE_COMPANY_HISTORY_KEY) || "[]"
    );

    const filteredHistory = history.filter(
      (item) => item.kdnr !== newEntry.kdnr
    );

    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 5);
    localStorage.setItem(
      MEINL_OFFICE_COMPANY_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  };

  if (!company) return <Loader />;

  const actions = (
    <div className="col-span-2 flex justify-end gap-2">
      {edit ? (
        <Button.Group>
          <Button
            color="gray"
            variant="light"
            onClick={async () => {
              await getCompany();
              setEdit(false);
            }}
          >
            Verwerfen
          </Button>
          <Button
            type="submit"
            leftSection={<IconDeviceFloppy size={16} />}
            disabled={!form.isValid()}
          >
            Änderungen speichern
          </Button>
        </Button.Group>
      ) : (
        <Button
          color="gray"
          variant="light"
          leftSection={<IconEdit size={16} />}
          onClick={() => setEdit(true)}
        >
          Firmendaten bearbeiten
        </Button>
      )}
    </div>
  );

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2 px-4">
        <Button
          variant="light"
          color="gray"
          leftSection={<IconChevronLeft size={16} />}
          component={Link}
          href="/company"
        >
          Alle Firmen
        </Button>
        <Contact email={company.allgemail} phone={company.telefon} />
      </div>

      <header className="flex items-center gap-4 p-4">
        <Avatar
          size={72}
          color={getAvatarColor(company.kdnr)}
          name={company.name1[0]}
        />
        <div className="flex flex-col gap-1 w-full">
          <h1>
            {company.name1}{" "}
            <span className="font-normal">
              {company.name2} {company.name3}
            </span>
          </h1>
          <p className="dimmed">{company.kdnr}</p>
        </div>
      </header>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<IconBuildingEstate size={16} />}>
            Firmendaten
          </Tabs.Tab>
          <Tabs.Tab
            value="storelocator"
            leftSection={<IconShoppingCartPin size={16} />}
            rightSection={
              company.dealerloc ? (
                <IconCircleCheck size={16} color="gray" />
              ) : (
                <IconCircleX size={16} color="gray" />
              )
            }
          >
            DealerLocator
          </Tabs.Tab>
          <Tabs.Tab
            value="employees"
            leftSection={<IconUsersGroup size={16} />}
            rightSection={
              <Badge size="xs" color="gray">
                {company.personen.length}
              </Badge>
            }
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

        <form
          onSubmit={form.onSubmit(async (values) => {
            const response = await fetch("/api/customer", {
              method: "POST",
              body: JSON.stringify(values),
            });
            if (response.ok) {
              getCompany();
              setEdit(false);
            }
          })}
        >
          <Tabs.Panel value="info" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>Unternehmen</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Name"
                    {...form.getInputProps("name1")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Zusatz"
                    {...form.getInputProps("name2")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Matchcode"
                    {...form.getInputProps("matchcode")}
                    readOnly
                  />
                  <NumberInput
                    label="Kundennummer"
                    {...form.getInputProps("kdnr")}
                    readOnly
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <h2>Anschrift</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Land"
                    {...form.getInputProps("land")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Straße / Postfach"
                    {...form.getInputProps("strasse")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="PLZ"
                    {...form.getInputProps("plz")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Ort"
                    {...form.getInputProps("ort")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <h2>Kommunikation</h2>
                <TextInput
                  label="Telefon"
                  {...form.getInputProps("telefon")}
                  readOnly
                />
                <TextInput
                  label="E-Mail"
                  {...form.getInputProps("allgemail")}
                  readOnly
                />
              </Fieldset>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="storelocator" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}

              <Checkbox
                size="md"
                className="col-span-2"
                label={`${company.name1} im DealerLocator anzeigen.`}
                {...form.getInputProps("dealerloc", { type: "checkbox" })}
                disabled={!edit}
              />

              <Fieldset>
                <h2>Daten</h2>
                <TextInput
                  label="Website URL"
                  {...form.getInputProps("www")}
                  readOnly={!edit}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Breitengrad"
                    {...form.getInputProps("latitude")}
                    readOnly
                  />
                  <TextInput
                    label="Längengrad"
                    {...form.getInputProps("longitude")}
                    readOnly
                  />
                </div>
              </Fieldset>

              <Fieldset>
                <h2>Brands</h2>
                <Checkbox.Group {...form.getInputProps("brands")}>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <Checkbox
                        key={brand}
                        label={brand}
                        value={brand}
                        disabled={!edit}
                      />
                    ))}
                  </div>
                </Checkbox.Group>
              </Fieldset>

              {company.latitude !== null && company.longitude !== null && (
                <div className="col-span-2">
                  <Map company={company} />
                </div>
              )}
            </div>
          </Tabs.Panel>
        </form>

        <EmployeesTab company={company} />
      </Tabs>
    </main>
  );
}
