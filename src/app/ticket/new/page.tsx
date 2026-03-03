"use client";
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
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const { companies, persons, source } = useOffice();
  const [active, setActive] = useState(0);
  const [loadedKdnr, setLoadedKdnr] = useState<string>();
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
      vaname2: "",
      vaname3: "",
      vastrasse: "",
      vaplz: "",
      vaort: "",
      valand: "",
      zusatz: "",
    },
    validate: {
      kdnr: (v) => (v ? null : "Kunde ist erforderlich"),
      vanr: (v) => (v ? null : "Versandadresse ist erforderlich"),
      kdnr_full: (v) => (v ? null : "Kontaktperson ist erforderlich"),
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
        kdnr_full: values.kdnr_full,
        updatedby: session?.user?.name,
        createdby: session?.user?.name,
        artnr_ku: values.artnr_ku,
        descr: values.descr,
        menge: values.menge,
        source: "OF",
        versandadresse: {
          vanr: values.vanr,
          vaname: values.vaname,
          vaname2: values.vaname2,
          vaname3: values.vaname3,
          vastrasse: values.vastrasse,
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
    if (!form.values.kdnr) return;
    if (form.values.kdnr === loadedKdnr) return;

    form.setFieldValue("kdnr_full", "");
    form.setFieldValue("kdnr_name", "");
    form.setFieldValue("vanr", "");

    setLoadedKdnr(form.values.kdnr);
    getCompany();
  }, [form.values.kdnr]);

  useEffect(() => {
    if (!company || !form.values.kdnr) return;

    const person = company.personen.find(
      (p) => p.b2bnr === form.values.kdnr_full,
    );

    if (!person) return;

    form.setFieldValue("kdnr_name", `${person.vorname} ${person.nachname}`);
  }, [form.values.kdnr_full]);

  useEffect(() => {
    if (!company) return;

    const va = company.versandadressen[0];

    if (va) {
      form.setFieldValue("vanr", va.vanr ?? "0000");
    } else {
      form.setFieldValue("vanr", "0000");
    }
  }, [company]);

  useEffect(() => {
    if (!company || !form.values.vanr) return;

    const address = company.versandadressen.find(
      (a) => a.vanr === form.values.vanr,
    );

    if (!address) {
      form.setFieldValue("vaname", "");
      form.setFieldValue("vaname2", "");
      form.setFieldValue("vaname3", "");
      form.setFieldValue("vastrasse", "");
      form.setFieldValue("vaplz", "");
      form.setFieldValue("vaort", "");
      form.setFieldValue("valand", "");
      form.setFieldValue("zusatz", "");
    } else {
      form.setFieldValue("vaname", address.vaname ?? "");
      form.setFieldValue("vaname2", address.vaname2 ?? "");
      form.setFieldValue("vaname3", address.vaname3 ?? "");
      form.setFieldValue("vastrasse", address.vastrasse ?? "");
      form.setFieldValue("vaplz", address.vaplz ?? "");
      form.setFieldValue("vaort", address.vaort ?? "");
      form.setFieldValue("valand", address.valand ?? "");
      form.setFieldValue("zusatz", address.zusatz ?? "");
    }
  }, [form.values.vanr, company]);

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

  const addresses = company
    ? company.versandadressen.map((a) => {
        return {
          label: `${a.vaname}, ${a.vastrasse}, ${a.vaplz} ${a.vaort}`,
          value: a.vanr,
        };
      })
    : [];

  const personOptions = company
    ? Array.from(
        new Map(
          persons
            .filter((p) => p.kdnr === company.kdnr)
            .map((p) => [p.b2bnr, p]),
        ).values(),
      ).map((p) => ({
        label: `${p.vorname} ${p.nachname} (${p.b2bnr})`,
        value: p.b2bnr,
      }))
    : [];

  return (
    <Paper mx="auto" p="xl" radius="md" mt="xl" w="100%" maw={800}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <h1>Neues Ticket</h1>
        <Stepper active={active} allowNextStepsSelect={false}>
          <Stepper.Step label="Kunde">
            <Stack>
              <Select
                label="Kunde"
                placeholder="Kundennummer oder Name eingeben"
                searchable
                clearable
                data={customerOptions}
                checkIconPosition="right"
                {...form.getInputProps("kdnr")}
                withAsterisk
              />
              {form.values.kdnr && (
                <>
                  <Select
                    label="Versandadresse"
                    data={[
                      ...addresses,
                      { label: "Neue Adresse", value: "0000" },
                    ]}
                    checkIconPosition="right"
                    searchable
                    {...form.getInputProps("vanr")}
                    withAsterisk
                  />
                  <Paper
                    p="lg"
                    radius="md"
                    bg="var(--background)"
                    shadow="xl"
                    withBorder
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <TextInput
                        label="Name 1"
                        className="col-span-2"
                        {...form.getInputProps("vaname")}
                        withAsterisk
                      />
                      <TextInput
                        label="Name 2"
                        {...form.getInputProps("vaname2")}
                      />
                      <TextInput
                        label="Name 3"
                        {...form.getInputProps("vaname3")}
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
                </>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Person">
            <Stack>
              <Select
                label="Name der Kontaktperson"
                searchable
                clearable
                data={personOptions}
                checkIconPosition="right"
                {...form.getInputProps("kdnr_full")}
                withAsterisk
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Details">
            <Stack>
              <div className="grid grid-cols-3 gap-2">
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
            <Button type="button" variant="transparent" onClick={prevStep}>
              Zurück
            </Button>
          )}
          {active < 2 ? (
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
