"use client";
import { CustomerSelect } from "@/app/components/customerSelect";
import { ProductSelect } from "@/app/components/productSelect";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
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
import {
  IconBuildings,
  IconChevronRight,
  IconInfoCircle,
  IconPaperclip,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const { source, locale } = useOffice();
  const [active, setActive] = useState(0);
  const [loadedKdnr, setLoadedKdnr] = useState<string>();
  const [company, setCompany] = useState<Company>();

  const router = useRouter();
  const STEPS = 3;

  const form = useForm<TicketFormValues>({
    validateInputOnChange: true,
    initialValues: {
      kdnr: "",
      kdnr_full: null,
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
    validate: (values: TicketFormValues) => {
      if (active === 0) {
        return {
          kdnr: values.kdnr
            ? null
            : `${t(locale, "customer")} ${t(locale, "invalidRequired")}`,
          vanr: values.vanr
            ? null
            : `${t(locale, "shippingAddress")} ${t(locale, "invalidRequired")}`,
        };
      }
      if (active === 1) {
        return {
          kdnr_full: values.kdnr_full
            ? null
            : `${t(locale, "contactPerson")} ${t(locale, "invalidRequired")}`,
          kdnr_name: values.kdnr_name
            ? null
            : `${t(locale, "contactPerson")} ${t(locale, "invalidRequired")}`,
        };
      }
      if (active === 2) {
        return {
          artnr_ku: values.artnr_ku
            ? null
            : `${t(locale, "articleNumber")} ${t(locale, "invalidRequired")}`,
          descr: values.descr
            ? null
            : `${t(locale, "descriptionLabel")} ${t(locale, "invalidRequired")}`,
          menge:
            values.menge > 0
              ? null
              : `${t(locale, "quantity")} ${t(locale, "invalidRequired")}`,
        };
      }
      return {};
    },
  });

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActive((current) => (current < STEPS ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

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
        user: session?.user?.name,
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

    form.setFieldValue("kdnr_full", null);
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

  const addresses = company
    ? company.versandadressen.map((a) => {
        return {
          label: `${a.vaname}, ${a.vastrasse}, ${a.vaplz} ${a.vaort}`,
          value: a.vanr,
        };
      })
    : [];

  const uniquePersons = Array.from(
    company ? new Map(company.personen.map((p) => [p.b2bnr, p])).values() : [],
  );

  const personOptions = useMemo(
    () =>
      uniquePersons.map((p) => ({
        label: `${p.vorname} ${p.nachname} (${p.b2bnr})`,
        value: p.b2bnr,
      })),
    [uniquePersons],
  );

  return (
    <Paper mx="auto" p="xl" mt="xl" w="100%" maw={800}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <h1>{t(locale, "createTicket")}</h1>
        <Stepper active={active} allowNextStepsSelect={false}>
          <Stepper.Step
            label={t(locale, "customer")}
            icon={<IconBuildings size={18} />}
          >
            <Stack>
              <CustomerSelect
                label={t(locale, "customer")}
                placeholder={t(locale, "selectCustomer")}
                withAsterisk
                value={form.values.kdnr || null}
                onChange={(val) => form.setFieldValue("kdnr", val ?? "")}
              />
              {form.values.kdnr && (
                <>
                  <Select
                    label={t(locale, "shippingAddress")}
                    data={[
                      ...addresses,
                      { label: t(locale, "newAddress"), value: "0000" },
                    ]}
                    checkIconPosition="right"
                    searchable
                    allowDeselect={false}
                    {...form.getInputProps("vanr")}
                    withAsterisk
                  />
                  <Paper p="lg" bg="var(--background)" shadow="xl">
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
                        label={t(locale, "streetAndNumber")}
                        className="col-span-2"
                        {...form.getInputProps("vastrasse")}
                        withAsterisk
                      />
                      <TextInput
                        label={t(locale, "postalCode")}
                        {...form.getInputProps("vaplz")}
                        withAsterisk
                      />
                      <TextInput
                        label={t(locale, "city")}
                        {...form.getInputProps("vaort")}
                        withAsterisk
                      />
                      <TextInput
                        label={t(locale, "country")}
                        {...form.getInputProps("valand")}
                        withAsterisk
                      />
                      <TextInput
                        label={t(locale, "extra")}
                        {...form.getInputProps("zusatz")}
                      />
                    </div>
                  </Paper>
                </>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label={t(locale, "contactPerson")}
            icon={<IconUser size={18} />}
          >
            <Stack>
              <Select
                label={t(locale, "contactPerson")}
                searchable
                clearable
                data={personOptions}
                checkIconPosition="right"
                {...form.getInputProps("kdnr_full")}
                withAsterisk
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label={t(locale, "details")}
            icon={<IconInfoCircle size={18} />}
          >
            <Stack>
              <div className="grid grid-cols-5 gap-2">
                <ProductSelect
                  label={t(locale, "articleNumber")}
                  value={form.values.artnr_ku}
                  onChange={(val) => form.setFieldValue("artnr_ku", val ?? "")}
                  withAsterisk
                  className="col-span-2"
                />
                <TextInput
                  label={t(locale, "serialNumber")}
                  className="col-span-2"
                  {...form.getInputProps("sernr_ku")}
                />
                <NumberInput
                  label={t(locale, "quantity")}
                  min={1}
                  {...form.getInputProps("menge")}
                  withAsterisk
                />
              </div>

              <Textarea
                label={t(locale, "descriptionLabel")}
                rows={4}
                {...form.getInputProps("descr")}
                withAsterisk
              />
              <FileInput
                label={t(locale, "files")}
                placeholder={t(locale, "uploadFiles")}
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
              {t(locale, "previous")}
            </Button>
          )}
          {active < STEPS - 1 ? (
            <Button
              type="button"
              disabled={!form.isValid()}
              rightSection={<IconChevronRight size={16} />}
              onClick={nextStep}
            >
              {t(locale, "next")}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!form.isValid()}
              leftSection={<IconPlus size={16} />}
            >
              {t(locale, "createTicket")}
            </Button>
          )}
        </Group>
      </form>
    </Paper>
  );
}
