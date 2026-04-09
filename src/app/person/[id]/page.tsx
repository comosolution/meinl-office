"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import { useOffice } from "@/app/context/officeContext";
import {
  MEINL_AE_URL,
  MEINL_AE_USA_URL,
  MEINL_OFFICE_PERSON_HISTORY_KEY,
} from "@/app/lib/constants";
import {
  b2bAccess,
  competences,
  downloads,
  familyStatus,
  genders,
  sizes,
  titles,
} from "@/app/lib/data";
import { t } from "@/app/lib/i18n";
import { Person, PersonInStorage } from "@/app/lib/interfaces";
import { formatDateToString, getAvatarColor } from "@/app/lib/utils";
import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Fieldset,
  Paper,
  Radio,
  Select,
  Tabs,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBalloon,
  IconBasketPlus,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconEdit,
  IconIdBadge2,
  IconLockQuestion,
  IconLockStar,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormValues, getInitialValues, validateForm } from "./form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const { source, locale } = useOffice();

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
    const response = await fetch("/api/person", {
      method: "POST",
      body: JSON.stringify({ id, source }),
    });

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
              {t(locale, "backToStart")}
            </Button>
          </>
        ),
        autoClose: false,
        withCloseButton: false,
      });
      return;
    }

    const persons = await response.json();
    setPerson(persons);
  };

  const updateHistory = () => {
    if (!person) return;

    const newEntry: PersonInStorage = {
      id: person.id.toString(),
      kdnr: person.kdnr,
      kundenart: person.kundenart,
      vorname: person.vorname,
      nachname: person.nachname,
      position: person.jobpos,
      company: person.name1,
      source,
    };
    const history = JSON.parse(
      localStorage.getItem(MEINL_OFFICE_PERSON_HISTORY_KEY) || "[]",
    );

    const filteredHistory = history.filter(
      (item: PersonInStorage) => item.kdnr !== newEntry.kdnr,
    );

    const updatedHistory = [newEntry, ...filteredHistory];
    localStorage.setItem(
      MEINL_OFFICE_PERSON_HISTORY_KEY,
      JSON.stringify(updatedHistory),
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
            {t(locale, "discard")}
          </Button>
          <Button
            type="submit"
            color="dark"
            variant="light"
            leftSection={<IconDeviceFloppy size={16} />}
            disabled={!form.isValid()}
          >
            {t(locale, "saveChanges")}
          </Button>
        </Button.Group>
      ) : (
        <Button
          color="dark"
          variant="transparent"
          leftSection={<IconEdit size={16} />}
          onClick={() => setEdit(true)}
        >
          {t(locale, "editData")}
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
            {t(locale, "allPeople")}
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
        <Button.Group>
          <Contact
            email={person.email}
            phone={person.phone}
            mobile={person.mobil}
          />
          <Button
            component="a"
            href={`${source === "OFFGUT" ? MEINL_AE_URL : MEINL_AE_USA_URL}?kdnr=${person.kdnr}`}
            target="_blank"
            leftSection={<IconBasketPlus size={16} />}
          >
            {t(locale, "newOrder")}
          </Button>
        </Button.Group>
      </div>
      <header className="flex items-center gap-4 py-4">
        <Avatar
          size={72}
          color={getAvatarColor(person.kdnr)}
          name={`${person.nachname} ${person.vorname}`}
        />
        <div className="flex flex-col gap-1 w-full">
          <h1>
            {person.nachname}, {person.vorname}
          </h1>
          <div className="flex justify-between items-baseline gap-2">
            <p>
              {person.jobpos || t(locale, "employee")} –{" "}
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
            {t(locale, "personalData")}
          </Tabs.Tab>
          <Tabs.Tab value="b2b" leftSection={<IconIdBadge2 size={16} />}>
            B2B
          </Tabs.Tab>
          <Tabs.Tab value="private" leftSection={<IconBalloon size={16} />}>
            {t(locale, "privateSection")}
          </Tabs.Tab>
        </Tabs.List>

        <form
          onSubmit={form.onSubmit(async (values) => {
            const formattedDob = formatDateToString(values.gebdat as Date);
            const formattedCompetences = values.zustaendig.join(",");
            const formattedB2bDlTyp = values.b2bdltyp.join(",");

            const response = await fetch("/api/person/save", {
              method: "POST",
              body: JSON.stringify({
                ...values,
                geburtsdatum: formattedDob,
                zustaendig: formattedCompetences,
                b2bdltyp: formattedB2bDlTyp,
                source,
                user: session?.user?.name,
              }),
            });
            if (response.ok) {
              getCustomer();
              setEdit(false);
            }
          })}
        >
          <Tabs.Panel value="info" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>{t(locale, "person")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Autocomplete
                    label={t(locale, "salutation") ?? "Anrede"}
                    data={genders}
                    {...form.getInputProps("anrede")}
                    readOnly={!edit}
                  />
                  <Autocomplete
                    label={t(locale, "title") ?? "Titel"}
                    data={titles}
                    {...form.getInputProps("titel")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "lastName") ?? "Nachname"}
                    {...form.getInputProps("nachname")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "firstName") ?? "Vorname"}
                    {...form.getInputProps("vorname")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "position")}
                    {...form.getInputProps("jobpos")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "department")}
                    {...form.getInputProps("abteilung")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "communication")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={t(locale, "phone")}
                    {...form.getInputProps("phone")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "mobile")}
                    {...form.getInputProps("mobil")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "fax")}
                    {...form.getInputProps("fax")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "email")}
                    {...form.getInputProps("email")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "managedBy")}
                    {...form.getInputProps("betreutvon")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "officeAddress")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={t(locale, "country")}
                    {...form.getInputProps("land")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "street")}
                    {...form.getInputProps("strasse")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "postalCode")}
                    {...form.getInputProps("plz")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "city")}
                    {...form.getInputProps("ort")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "responsibilities")}</h2>
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

          <Tabs.Panel value="b2b" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>B2B-Zugriff</h2>
                <Radio.Group {...form.getInputProps("b2bzugriff")}>
                  <div className="flex flex-col gap-2">
                    {b2bAccess(source).map((b, i) => (
                      <Radio
                        key={i}
                        label={b.label}
                        value={b.value}
                        disabled={!edit}
                      />
                    ))}
                  </div>
                </Radio.Group>
              </Fieldset>
              <Fieldset>
                <h2>Verfügbare Downloads</h2>
                <Checkbox
                  label="Keine Downloads"
                  {...form.getInputProps("b2bdldis", { type: "checkbox" })}
                  disabled={!edit}
                />
                {!form.values.b2bdldis && (
                  <Paper py="md" shadow="xl" bg="var(--background)" withBorder>
                    <Checkbox.Group {...form.getInputProps("b2bdltyp")}>
                      <div className="flex flex-col gap-2">
                        {downloads(source).map((d, i) => (
                          <Checkbox
                            key={i}
                            label={d.label}
                            value={d.value}
                            disabled={!edit}
                          />
                        ))}
                      </div>
                    </Checkbox.Group>
                  </Paper>
                )}
              </Fieldset>
              <Button.Group>
                <Button
                  variant="light"
                  leftSection={<IconLockStar size={16} />}
                  disabled={!edit}
                  fullWidth
                >
                  Passwort erzeugen
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconLockQuestion size={16} />}
                  disabled={!edit}
                  fullWidth
                >
                  Passwort eingeben
                </Button>
              </Button.Group>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="private" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>{t(locale, "personalAddress")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={t(locale, "country")}
                    {...form.getInputProps("landpr")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "street")}
                    {...form.getInputProps("strassepr")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "postalCode")}
                    {...form.getInputProps("plzpr")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "city")}
                    {...form.getInputProps("ortpr")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "details")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <DateInput
                    label={t(locale, "dateOfBirth")}
                    locale="de"
                    valueFormat="DD.MM.YYYY"
                    {...form.getInputProps("gebdat")}
                    readOnly={!edit}
                  />
                  <Select
                    label={t(locale, "maritalStatus")}
                    data={familyStatus}
                    {...form.getInputProps("famstand")}
                    checkIconPosition="right"
                    readOnly={!edit}
                    aria-readonly={!edit}
                  />
                  <TextInput
                    label={t(locale, "hobbies")}
                    {...form.getInputProps("hobbies")}
                    readOnly={!edit}
                  />
                  <Autocomplete
                    label={t(locale, "tShirtSize")}
                    data={sizes}
                    {...form.getInputProps("tshirt")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "musicGenre")}
                    {...form.getInputProps("musikri")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "instrument")}
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
