"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import { MEINL_OFFICE_PERSON_HISTORY_KEY } from "@/app/lib/constants";
import {
  competences,
  familyStatus,
  genders,
  sizes,
  titles,
} from "@/app/lib/data";
import { Person, PersonInStorage } from "@/app/lib/interfaces";
import { formatDateToString, getAvatarColor } from "@/app/lib/utils";
import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Fieldset,
  Select,
  Tabs,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBalloon,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconEdit,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormValues, getInitialValues, validateForm } from "./form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [person, setPerson] = useState<Person>();
  const [activeTab, setActiveTab] = useState<string | null>("info");
  const [edit, setEdit] = useState(false);

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: getInitialValues({} as Person),
    validate: (values: FormValues) => validateForm(values),
  });

  const router = useRouter();

  useEffect(() => {
    getCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!person) return;
    updateHistory();
    form.setValues(getInitialValues(person));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

  const getCustomer = async () => {
    const response = await fetch(`/api/person/${id}`);

    if (!response.ok) {
      notifications.show({
        id: `error-${id}`,
        title: `Fehler ${response.status}`,
        message: (
          <>
            <p>{await response.json()}</p>
            <Button
              size="xs"
              variant="light"
              mt={8}
              rightSection={<IconChevronRight size={12} />}
              onClick={() => {
                router.push("/");
                notifications.hide(`error-${id}`);
              }}
              fullWidth
            >
              Zurück zur Startseite
            </Button>
          </>
        ),
        position: "top-center",
        autoClose: false,
        withCloseButton: false,
      });
      return;
    }

    const companies = await response.json();
    setPerson(companies);
  };

  const updateHistory = () => {
    if (!person) return;

    const newEntry: PersonInStorage = {
      kdnr: person.id.toString(),
      vorname: person.vorname,
      nachname: person.nachname,
      position: person.jobpos,
      company: person.name1,
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

  const actions = (
    <div className="col-span-2 flex justify-end gap-2">
      {edit ? (
        <Button.Group>
          <Button
            color="dark"
            variant="transparent"
            // TODO: reset form
            onClick={() => setEdit(false)}
          >
            Verwerfen
          </Button>
          <Button
            type="submit"
            color="dark"
            variant="light"
            leftSection={<IconDeviceFloppy size={16} />}
            disabled={!form.isValid()}
          >
            Änderungen speichern
          </Button>
        </Button.Group>
      ) : (
        <Button
          color="dark"
          variant="transparent"
          leftSection={<IconEdit size={16} />}
          onClick={() => setEdit(true)}
        >
          Daten bearbeiten
        </Button>
      )}
    </div>
  );

  if (!person) return <Loader />;

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2">
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
            href={`/company/${person.kdnr}`}
          >
            {person.name1}
          </Button>
        </Button.Group>
        <Contact
          email={person.email}
          phone={person.phone}
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
              {person.jobpos || "Mitarbeiter"} bei{" "}
              <Link href={`/company/${person.kdnr}`} className="link">
                <b>{person.name1}</b> ({person.kdnr})
              </Link>
            </p>
            <p className="dimmed">{person.b2bnr}</p>
          </div>
        </div>
      </header>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<IconUser size={16} />}>
            Persönliche Daten
          </Tabs.Tab>
          <Tabs.Tab value="private" leftSection={<IconBalloon size={16} />}>
            Privat
          </Tabs.Tab>
        </Tabs.List>

        <form
          onSubmit={form.onSubmit((values) => {
            const formattedDob = formatDateToString(
              values.geburtsdatum as Date
            );
            const formattedCompetences = values.zustaendig.join(",");

            console.log(
              JSON.stringify(
                {
                  ...values,
                  geburtsdatum: formattedDob,
                  zustaendig: formattedCompetences,
                },
                null,
                2
              )
            );
          })}
        >
          <Tabs.Panel value="info" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>Person</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Autocomplete
                    label="Anrede"
                    data={genders}
                    {...form.getInputProps("anrede")}
                    readOnly={!edit}
                  />
                  <Autocomplete
                    label="Titel"
                    data={titles}
                    {...form.getInputProps("titel")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Nachname"
                    {...form.getInputProps("nachname")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Vorname"
                    {...form.getInputProps("vorname")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Position"
                    {...form.getInputProps("jobpos")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Abteilung"
                    {...form.getInputProps("abteilung")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>Kommunikation</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Telefon"
                    {...form.getInputProps("phone")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Mobil"
                    {...form.getInputProps("mobil")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="E-Mail"
                    {...form.getInputProps("email")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Betreut von"
                    {...form.getInputProps("betreutvon")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>Büroanschrift</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Land"
                    {...form.getInputProps("land")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Straße"
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
                <h2>Zuständigkeiten</h2>
                <Checkbox.Group {...form.getInputProps("zustaendig")}>
                  <div className="grid grid-cols-2 gap-2">
                    {competences.map((c, i) => (
                      <Checkbox key={i} label={c} value={c} disabled={!edit} />
                    ))}
                  </div>
                </Checkbox.Group>
              </Fieldset>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="private" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>Privatanschrift</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Land"
                    {...form.getInputProps("land")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Straße"
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
                <h2>Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <DateInput
                    label="Geburtsdatum"
                    valueFormat="DD.MM.YYYY"
                    {...form.getInputProps("geburtsdatum")}
                    readOnly={!edit}
                  />
                  <Select
                    label="Familienstand"
                    data={familyStatus}
                    {...form.getInputProps("famstand")}
                    checkIconPosition="right"
                    readOnly={!edit}
                    aria-readonly={!edit}
                  />
                  <TextInput
                    label="Hobbies"
                    {...form.getInputProps("hobbies")}
                    readOnly={!edit}
                  />
                  <Autocomplete
                    label="T-Shirt"
                    data={sizes}
                    {...form.getInputProps("tshirt")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Musikrichtung"
                    {...form.getInputProps("musikrichtung")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Instrument"
                    {...form.getInputProps("instrument")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
            </div>
          </Tabs.Panel>
        </form>
      </Tabs>
    </main>
  );
}
