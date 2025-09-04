import { Person } from "@/app/lib/interfaces";
import { formatDateToString } from "@/app/lib/utils";
import {
  Autocomplete,
  Button,
  Checkbox,
  Fieldset,
  MultiSelect,
  Tabs,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { FormValues, getInitialValues, validateForm } from "../form";

export default function InfoTab({ person }: { person: Person }) {
  const [edit, setEdit] = useState(false);

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: getInitialValues(person),
    validate: (values: FormValues) => validateForm(values),
  });

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

  return (
    <Tabs.Panel value="info" className="py-4">
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={form.onSubmit((values) => {
          const formattedDob = formatDateToString(values.geburtsdatum as Date);
          const formattedCompetences = values.zustaendig.join(",");
          const formattedAdvisors = values.betreutvon.join(",");

          console.log(
            JSON.stringify(
              {
                ...values,
                geburtsdatum: formattedDob,
                zustaendig: formattedCompetences,
                betreutvon: formattedAdvisors,
              },
              null,
              2
            )
          );
        })}
      >
        <div className="col-span-2 flex justify-end gap-2">
          {edit ? (
            <Button.Group>
              <Button
                color="dark"
                variant="light"
                // TODO: reset form
                onClick={() => setEdit(false)}
              >
                Verwerfen
              </Button>
              <Button
                type="submit"
                color="dark"
                leftSection={<IconDeviceFloppy size={16} />}
                disabled={!form.isValid()}
              >
                Änderungen speichern
              </Button>
            </Button.Group>
          ) : (
            <Button
              color="dark"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEdit(true)}
            >
              Persönliche Daten bearbeiten
            </Button>
          )}
        </div>

        <Fieldset>
          <h2>Person</h2>
          <div className="grid grid-cols-2 gap-4">
            <Autocomplete
              label="Anrede"
              data={["Frau", "Herr"]}
              key={form.key("anrede")}
              {...form.getInputProps("anrede")}
              readOnly={!edit}
            />
            <Autocomplete
              label="Titel"
              data={[
                "Dr.",
                "Dr. med.",
                "Dr.-Ing.",
                "Dipl.-Ing.",
                "Prof.",
                "Prof. Dr.",
              ]}
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
              key={form.key("jobpos")}
              {...form.getInputProps("jobpos")}
              readOnly={!edit}
            />
            <TextInput
              label="Abteilung"
              key={form.key("abteilung")}
              {...form.getInputProps("abteilung")}
              readOnly={!edit}
            />
          </div>
        </Fieldset>
        <Fieldset>
          <h2>Privat</h2>
          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Geburtsdatum"
              key={form.key("geburtsdatum")}
              {...form.getInputProps("geburtsdatum")}
              readOnly={!edit}
            />
            <TextInput
              label="Familienstand"
              key={form.key("familienstand")}
              {...form.getInputProps("familienstand")}
              readOnly={!edit}
            />
            <TextInput
              label="Hobbies"
              key={form.key("hobbies")}
              {...form.getInputProps("hobbies")}
              readOnly={!edit}
            />
            <Autocomplete
              label="T-Shirt"
              data={["XS", "S", "M", "L", "XL", "XXL"]}
              key={form.key("tshirt")}
              {...form.getInputProps("tshirt")}
              readOnly={!edit}
            />
            <TextInput
              label="Musikrichtung"
              key={form.key("musikrichtung")}
              {...form.getInputProps("musikrichtung")}
              readOnly={!edit}
            />
            <TextInput
              label="Instrument"
              key={form.key("instrument")}
              {...form.getInputProps("instrument")}
              readOnly={!edit}
            />
          </div>
        </Fieldset>
        <Fieldset>
          <h2>Kommunikation</h2>
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
            label="Betreut von"
            key={form.key("betreutvon")}
            {...form.getInputProps("betreutvon")}
            readOnly={!edit}
          />
        </Fieldset>
        <Fieldset>
          <h2>Zuständigkeiten</h2>
          <Checkbox.Group
            key={form.key("zustaendig")}
            {...form.getInputProps("zustaendig")}
          >
            <div className="grid grid-cols-2 gap-2">
              {allCompetences.map((c, i) => (
                <Checkbox key={i} label={c} value={c} disabled={!edit} />
              ))}
            </div>
          </Checkbox.Group>
        </Fieldset>
      </form>
    </Tabs.Panel>
  );
}
