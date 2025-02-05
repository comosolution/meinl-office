import { Person } from "@/app/lib/interfaces";
import {
  Button,
  Checkbox,
  Fieldset,
  MultiSelect,
  Tabs,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { getInitialValues, validateForm } from "../form";

export default function InfoTab({ person }: { person: Person }) {
  const [edit, setEdit] = useState(false);

  const form = useForm<Person>({
    validateInputOnChange: true,
    initialValues: getInitialValues(person),
    validate: (values: Person) => validateForm(values),
  });

  const advisors = person.betreutvon.split(",");

  const allCompetences = [
    "Administration",
    "Hardcase",
    "Ibanez Akustik-Gitarre",
    "Ibanez E-Gitarre",
    "Ibanez E-Bass",
    "Meinl Cymbals",
    "Meinl Percussion",
    "Meinl Sonic Energy",
    "Meinl Stick & Brush",
    "Meinl Viva Rhythm",
    "Nino",
    "Ortega",
    "Tama",
    "VIP",
  ];
  const competences = person.zustaendig.toLowerCase().split(",");

  return (
    <Tabs.Panel value="info" className="py-4">
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={form.onSubmit((values) => {
          console.log(JSON.stringify(values, null, 2));
        })}
      >
        <Fieldset legend="Person">
          <TextInput
            label="Anrede"
            key={form.key("anrede")}
            {...form.getInputProps("anrede")}
            readOnly={!edit}
          />
          <TextInput
            label="Titel"
            key={form.key("titel")}
            {...form.getInputProps("titel")}
            readOnly={!edit}
          />
          <TextInput
            label="Nachname"
            key={form.key("nachname")}
            {...form.getInputProps("nachname")}
            readOnly={!edit}
          />
          <TextInput
            label="Vorname"
            key={form.key("vorname")}
            {...form.getInputProps("vorname")}
            readOnly={!edit}
          />
          <TextInput
            label="Position"
            key={form.key("position")}
            {...form.getInputProps("position")}
            readOnly={!edit}
          />
          <TextInput
            label="Abteilung"
            key={form.key("abteilung")}
            {...form.getInputProps("abteilung")}
            readOnly={!edit}
          />
        </Fieldset>
        <Fieldset legend="Kommunikation">
          <TextInput
            label="Telefon"
            key={form.key("telefon")}
            {...form.getInputProps("telefon")}
            readOnly={!edit}
          />
          <TextInput
            label="Mobil"
            key={form.key("mobil")}
            {...form.getInputProps("mobil")}
            readOnly={!edit}
          />
          <TextInput
            label="E-Mail"
            key={form.key("email")}
            {...form.getInputProps("email")}
            readOnly={!edit}
          />
          <MultiSelect
            // TODO: union checked values back into string
            label="Betreut von"
            data={advisors}
            defaultValue={advisors}
            readOnly={!edit}
          />
        </Fieldset>
        <Fieldset legend="Zuständigkeiten">
          <div className="grid grid-cols-2 gap-2">
            {allCompetences.map((z, i) => (
              // TODO: union checked values back into string
              <Checkbox
                key={i}
                label={z}
                defaultChecked={competences.includes(z.toLowerCase())}
                readOnly={!edit}
              />
            ))}
          </div>
        </Fieldset>
        <div className="col-span-2 flex justify-end gap-2">
          {edit ? (
            <>
              <Button
                color="gray"
                variant="light"
                // TODO: reset form
                onClick={() => setEdit(false)}
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
            </>
          ) : (
            <Button
              color="gray"
              variant="outline"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEdit(true)}
            >
              Persönliche Daten bearbeiten
            </Button>
          )}
        </div>
      </form>
    </Tabs.Panel>
  );
}
