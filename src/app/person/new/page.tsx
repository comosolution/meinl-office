"use client";
import { useOffice } from "@/app/context/officeContext";
import {
  competences,
  familyStatus,
  genders,
  sizes,
  titles,
} from "@/app/lib/data";
import { formatDateToString } from "@/app/lib/utils";
import {
  Autocomplete,
  Button,
  Checkbox,
  Group,
  Paper,
  Select,
  Stack,
  Stepper,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconBalloon,
  IconBuildings,
  IconChecklist,
  IconChevronRight,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getInitialValues, validateForm, type FormValues } from "../[id]/form";

export default function NewPersonPage() {
  const { companies, source } = useOffice();
  const [active, setActive] = useState(0);

  const router = useRouter();
  const STEPS = 4;

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: { ...getInitialValues({} as any), id: 0 },
    validate: (values: FormValues) => validateForm(values, active),
  });

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActive((current) => (current < STEPS ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const uniqueCompanies = Array.from(
    new Map(companies.map((c) => [c.kdnr, c])).values(),
  );

  const customerOptions = useMemo(
    () =>
      uniqueCompanies.map((c) => ({
        label: `${c.name1} (${c.kdnr})`,
        value: c.kdnr.toString(),
      })),
    [uniqueCompanies],
  );

  return (
    <Paper mx="auto" p="xl" radius="md" mt="xl" w="100%" maw={800}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.onSubmit(async (values: FormValues) => {
          const formattedDob = formatDateToString(values.gebdat as Date);
          const formattedCompetences = values.zustaendig.join(",");

          const payload = {
            ...values,
            id: 0,
            kdnr: Number(values.kdnr),
            geburtsdatum: formattedDob,
            zustaendig: formattedCompetences,
            source,
          };

          try {
            const res = await fetch("/api/person/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const resText = await res.text();

            if (res.ok) {
              router.push(`/person/${resText}`);
            } else {
              console.error(resText);
            }
          } catch (err) {
            console.error("Error saving person", err);
          }
        })}
      >
        <h1>Neue Person</h1>
        <Stepper active={active} allowNextStepsSelect={false}>
          <Stepper.Step label="Firma" icon={<IconBuildings size={18} />}>
            <Stack>
              <Select
                label="Firma"
                placeholder="Kundennummer oder Name eingeben"
                searchable
                clearable
                data={customerOptions}
                checkIconPosition="right"
                {...form.getInputProps("kdnr")}
                withAsterisk
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Person" icon={<IconUser size={18} />}>
            <Stack>
              <h2>Persönliche Daten</h2>
              <div className="grid grid-cols-2 gap-4">
                <Autocomplete
                  label="Anrede"
                  data={genders}
                  {...form.getInputProps("anrede")}
                  withAsterisk
                />
                <Autocomplete
                  label="Titel"
                  data={titles}
                  {...form.getInputProps("titel")}
                />
                <TextInput
                  label="Nachname"
                  {...form.getInputProps("nachname")}
                  withAsterisk
                />
                <TextInput
                  label="Vorname"
                  {...form.getInputProps("vorname")}
                  withAsterisk
                />
                <TextInput label="Position" {...form.getInputProps("jobpos")} />
                <TextInput
                  label="Abteilung"
                  {...form.getInputProps("abteilung")}
                />
              </div>
              <h2>Kommunikation</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Telefon" {...form.getInputProps("phone")} />
                <TextInput label="Mobil" {...form.getInputProps("mobil")} />
                <TextInput label="Fax" {...form.getInputProps("fax")} />
                <TextInput
                  label="E-Mail"
                  {...form.getInputProps("email")}
                  withAsterisk
                />
                <TextInput
                  label="Betreut von"
                  {...form.getInputProps("betreutvon")}
                />
              </div>
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Zuständigkeiten"
            icon={<IconChecklist size={18} />}
          >
            <Stack>
              <h2>Zuständigkeiten</h2>
              <Checkbox.Group {...form.getInputProps("zustaendig")}>
                <div className="grid grid-cols-2 gap-2">
                  {competences.map((c, i) => (
                    <Checkbox key={i} label={c} value={c} />
                  ))}
                </div>
              </Checkbox.Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Privat" icon={<IconBalloon size={18} />}>
            <Stack>
              <h2>Privatanschrift</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Land" {...form.getInputProps("landpr")} />
                <TextInput
                  label="Straße"
                  {...form.getInputProps("strassepr")}
                />
                <TextInput label="PLZ" {...form.getInputProps("plzpr")} />
                <TextInput label="Ort" {...form.getInputProps("ortpr")} />
              </div>
              <h2>Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label="Geburtsdatum"
                  locale="de"
                  valueFormat="DD.MM.YYYY"
                  defaultLevel="decade"
                  {...form.getInputProps("gebdat")}
                />
                <Select
                  label="Familienstand"
                  data={familyStatus}
                  {...form.getInputProps("famstand")}
                  checkIconPosition="right"
                  aria-readonly={false}
                />
                <TextInput label="Hobbies" {...form.getInputProps("hobbies")} />
                <Autocomplete
                  label="T-Shirt"
                  data={sizes}
                  {...form.getInputProps("tshirt")}
                />
                <TextInput
                  label="Musikrichtung"
                  {...form.getInputProps("musikri")}
                />
                <TextInput
                  label="Instrument"
                  {...form.getInputProps("instrument")}
                />
              </div>
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          {active === 0 ? (
            <div />
          ) : (
            <Button type="button" variant="transparent" onClick={prevStep}>
              Zurück
            </Button>
          )}
          {active < STEPS - 1 ? (
            <Button
              type="button"
              disabled={!form.isValid()}
              rightSection={<IconChevronRight size={16} />}
              onClick={nextStep}
            >
              Weiter
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!form.isValid()}
              leftSection={<IconPlus size={16} />}
            >
              Person anlegen
            </Button>
          )}
        </Group>
      </form>
    </Paper>
  );
}
