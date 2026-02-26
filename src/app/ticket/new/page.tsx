"use client";
import { ContactSelect } from "@/app/components/contactSelect";
import { useOffice } from "@/app/context/officeContext";
import { Company, type TicketFormValues } from "@/app/lib/interfaces";
import {
  Button,
  FileInput,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Stepper,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronRight, IconPaperclip, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const { companies, source } = useOffice();
  const [active, setActive] = useState(0);
  const [company, setCompany] = useState<Company>();

  const router = useRouter();

  const form = useForm<TicketFormValues>({
    validateInputOnChange: true,
    initialValues: {
      kdnr: "",
      kdnr_full: "",
      kdnr_name: "",
      artnr_ku: "",
      sernr_ku: "",
      descr: "",
      files: [],
      menge: 1,
      vanr: "",
      vaname: "",
      name2: "",
      name3: "",
      vastr: "",
      vaplz: "",
      vaort: "",
      valand: "",
      zusatz: "",
    },
    validate: {
      kdnr: (v) => (v ? null : "Kunde ist erforderlich"),
      kdnr_name: (v) => (v ? null : "Kontaktperson ist erforderlich"),
      artnr_ku: (v) => (v ? null : "Artikel ist erforderlich"),
    },
  });

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  const handleSubmit = async (values: TicketFormValues) => {
    try {
      const filesData = await Promise.all(
        values.files.map(
          (file) =>
            new Promise<{ Filename: string; Data: string }>(
              (resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = (reader.result as string).split(",")[1];
                  resolve({
                    Filename: file.name,
                    Data: base64,
                  });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
              },
            ),
        ),
      );

      const payload = {
        nr: "",
        kdnr: values.kdnr,
        kdnr_name: values.kdnr_name,
        kdnr_full: values.kdnr_name,
        updatedby: session?.user?.name,
        createdby: session?.user?.name,
        artnr_ku: values.artnr_ku,
        descr: values.descr,
        menge: values.menge,
        source: "OF",
        versandadresse: {
          vanr: values.vanr,
          vaname: values.vaname,
          name2: values.name2,
          name3: values.name3,
          vastr: values.vastr,
          vaplz: values.vaplz,
          vaort: values.vaort,
          valand: values.valand,
          zusatz: values.zusatz,
        },
        Files: filesData.length > 0 ? filesData : null,
      };

      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(await res.text());
      }

      // TODO: Get new ticket ID from response and navigate to it
      router.push("/ticket");
    } catch (error) {
      console.error("Error preparing form data", error);
    }
  };

  const getCompany = async () => {
    const response = await fetch("/api/company/", {
      method: "POST",
      body: JSON.stringify({ kdnr: form.values.kdnr, source }),
    });

    const companies = await response.json();
    setCompany(companies[0]);
  };

  useEffect(() => {
    getCompany();
  }, [form.values.kdnr]);

  const addresses = company
    ? company.versandadressen.map((a) => {
        return {
          label: `${a.vastr}, ${a.vaplz} ${a.vaort}`,
          value: a.vanr,
        };
      })
    : [];

  return (
    <Paper mx="auto" p="xl" radius="md" mt="xl" w="100%" maw={800}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stepper active={active} allowNextStepsSelect={false}>
          <Stepper.Step label="Kunde">
            <Stack>
              <h2>Kunde auswählen</h2>
              <Select
                label="Kunde"
                placeholder="Kundennummer oder Name eingeben"
                searchable
                clearable
                data={companies.map((c) => {
                  return {
                    label: `${c.kdnr} – ${c.name1}`,
                    value: c.kdnr.toString(),
                  };
                })}
                checkIconPosition="right"
                {...form.getInputProps("kdnr")}
                withAsterisk
              />
              {form.values.kdnr && (
                <Select
                  label="Versandadressen"
                  data={[
                    ...addresses,
                    { label: "Neue Adresse", value: "0000" },
                  ]}
                  checkIconPosition="right"
                  searchable
                  {...form.getInputProps("vanr")}
                  withAsterisk
                />
              )}
              {form.values.vanr === "0000" && (
                <Paper p="lg" radius="md" bg="var(--background)" withBorder>
                  <h3>Neue Versandadresse</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput
                      label="Name 1"
                      className="col-span-2"
                      {...form.getInputProps("vaname")}
                      withAsterisk
                    />
                    <TextInput
                      label="Name 2"
                      {...form.getInputProps("name2")}
                    />
                    <TextInput
                      label="Name 3"
                      {...form.getInputProps("name3")}
                    />
                    <TextInput
                      label="Straße & Nr."
                      className="col-span-2"
                      {...form.getInputProps("vastrasse")}
                      withAsterisk
                    />
                    <TextInput
                      label="PLZ"
                      {...form.getInputProps("vaplz")}
                      withAsterisk
                    />
                    <TextInput
                      label="Ort"
                      {...form.getInputProps("vaort")}
                      withAsterisk
                    />
                    <TextInput
                      label="Land"
                      {...form.getInputProps("valand")}
                      withAsterisk
                    />
                    <TextInput
                      label="Zusatz"
                      {...form.getInputProps("zusatz")}
                    />
                  </div>
                </Paper>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Person">
            <Stack>
              <h2>Verantwortliche Person auswählen</h2>
              <ContactSelect
                customerId={form.values.kdnr}
                value={form.values.kdnr_name}
                onChange={(value) => form.setFieldValue("kdnr_name", value)}
                onSelectPerson={(person) => {
                  form.setFieldValue(
                    "kdnr_name",
                    `${person.vorname} ${person.nachname}`,
                  );
                  form.setFieldValue("kdnr_full", person.b2bnr);
                }}
                error={form.errors.kdnr_name?.toString()}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Details">
            <Stack>
              <h2>Details eingeben</h2>
              <div className="grid grid-cols-3 gap-2">
                {/* <ArticleSelect
                  value={form.values.artnr_ku}
                  onChange={(value) => form.setFieldValue("artnr_ku", value)}
                  error={form.errors.artnr_ku?.toString()}
                /> */}
                <TextInput
                  label="Artikelnummer"
                  {...form.getInputProps("artnr_ku")}
                  withAsterisk
                />
                <TextInput
                  label="Seriennummer"
                  {...form.getInputProps("sernr_ku")}
                />
                <NumberInput
                  label="Menge"
                  min={1}
                  {...form.getInputProps("menge")}
                  withAsterisk
                />
              </div>

              <Textarea
                label="Beschreibung"
                rows={4}
                {...form.getInputProps("descr")}
                withAsterisk
              />
              <FileInput
                label="Dateien"
                placeholder="Bilder oder PDFs hochladen (optional)"
                multiple
                clearable
                accept="image/*,.pdf"
                leftSection={<IconPaperclip size={16} />}
                leftSectionPointerEvents="none"
                value={form.values.files}
                onChange={(files) => form.setFieldValue("files", files ?? [])}
              />
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          {active === 0 ? (
            <div />
          ) : (
            <Button variant="transparent" onClick={prevStep}>
              Zurück
            </Button>
          )}
          {active < 2 ? (
            <Button
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
