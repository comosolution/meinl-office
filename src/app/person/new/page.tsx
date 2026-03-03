"use client";
import { useOffice } from "@/app/context/officeContext";
import { formatDateToString } from "@/app/lib/utils";
import {
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
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { getInitialValues, type FormValues } from "../[id]/form";

export default function NewPersonPage() {
  const { companies, source } = useOffice();
  const [active, setActive] = useState(0);

  const STEPS = 3;

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: { ...getInitialValues({} as any), id: 0 },
    validate: {
      kdnr: (v) => (v ? null : "Firma ist erforderlich"),
    },
  });

  const nextStep = () =>
    setActive((current) => (current < STEPS ? current + 1 : current));

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
          const payload = {
            ...values,
            id: 0,
            kdnr: Number(values.kdnr) || 0,
            source: source,
            geburtsdatum: formattedDob,
            zustaendig: Array.isArray(values.zustaendig)
              ? values.zustaendig.join(",")
              : values.zustaendig,
          };

          console.log(JSON.stringify(payload));

          // try {
          //   const res = await fetch("/api/person/save", {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify(payload),
          //   });

          //   if (res.ok) {
          //     router.push("/person");
          //   } else {
          //     console.error(await res.text());
          //   }
          // } catch (err) {
          //   console.error("Error saving person", err);
          // }
        })}
      >
        <h1>Neue Person</h1>
        <Stepper active={active} allowNextStepsSelect={false}>
          <Stepper.Step label="Firma">
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

          <Stepper.Step label="Person">
            <Stack>
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Vorname"
                  {...form.getInputProps("vorname")}
                  required
                />
                <TextInput
                  label="Nachname"
                  {...form.getInputProps("nachname")}
                  required
                />
                <TextInput label="Position" {...form.getInputProps("jobpos")} />
                <TextInput
                  label="Abteilung"
                  {...form.getInputProps("abteilung")}
                />
                <TextInput label="E-Mail" {...form.getInputProps("email")} />
                <TextInput label="Mobil" {...form.getInputProps("mobil")} />
                <TextInput
                  label="Betreut von"
                  {...form.getInputProps("betreutvon")}
                />
              </div>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Details">
            <Stack>
              <div className="grid grid-cols-2 gap-2">
                <DateInput
                  label="Geburtsdatum"
                  valueFormat="DD.MM.YYYY"
                  {...form.getInputProps("gebdat")}
                />
                <TextInput label="T-Shirt" {...form.getInputProps("tshirt")} />
                <TextInput
                  label="Hobbies (kommagetrennt)"
                  {...form.getInputProps("hobbies")}
                />
                <TextInput
                  label="Instrument"
                  {...form.getInputProps("instrument")}
                />
                <Checkbox.Group {...(form.getInputProps("zustaendig") as any)}>
                  <div className="grid grid-cols-2 gap-2">
                    <Checkbox value="Administration" label="Administration" />
                    <Checkbox value="Vertrieb" label="Vertrieb" />
                    <Checkbox value="Marketing" label="Marketing" />
                    <Checkbox value="IT" label="IT" />
                  </div>
                </Checkbox.Group>
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
              Ticket erstellen
            </Button>
          )}
        </Group>
      </form>
    </Paper>
  );
}
