"use client";
import { CustomerSelect } from "@/app/components/customerSelect";
import { FileDropzone } from "@/app/components/fileDropzone";
import { ProductSelect } from "@/app/components/productSelect";
import { useOffice } from "@/app/context/officeContext";
import {
  countryCodes,
  normalizeAlpha2CountryCode,
} from "@/app/lib/countryCodes";
import { t } from "@/app/lib/i18n";
import { Company, type TicketFormValues } from "@/app/lib/interfaces";
import { isPreview } from "@/app/lib/utils";
import {
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildings,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
      nr_kunde: "",
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
      newPersonFirstName: "",
      newPersonLastName: "",
      newPersonEmail: "",
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
          ...(values.kdnr_full === "NEW"
            ? {
                newPersonFirstName: values.newPersonFirstName
                  ? null
                  : `${t(locale, "firstName")} ${t(locale, "invalidRequired")}`,
                newPersonLastName: values.newPersonLastName
                  ? null
                  : `${t(locale, "lastName")} ${t(locale, "invalidRequired")}`,
                newPersonEmail: values.newPersonEmail
                  ? null
                  : `${t(locale, "email")} ${t(locale, "invalidRequired")}`,
              }
            : {}),
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
    let b2bnr;

    try {
      if (form.values.kdnr_full === "NEW") {
        const payload = {
          id: 0,
          kdnr: Number(values.kdnr),
          vorname: values.newPersonFirstName,
          nachname: values.newPersonLastName,
          email: values.newPersonEmail,
          b2bpwd: null,
          b2bzugriff: 0,
          b2bdltyp: null,
          b2bdldis: false,
          source,
          user: session?.user?.name,
        };

        const res = await fetch("/api/person/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        b2bnr = await res.text();

        if (!res.ok) {
          notifications.show({
            title: t(locale, "error"),
            message: `Fehler beim Erstellen von ${values.newPersonFirstName} ${values.newPersonLastName}`,
          });
          return;
        }
      }

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
        kdnr_name:
          values.kdnr_full === "NEW"
            ? `${values.newPersonFirstName} ${values.newPersonLastName}`.trim()
            : values.kdnr_name,
        kdnr_full: values.kdnr_full === "NEW" ? b2bnr : values.kdnr_full,
        updatedby: session?.user?.name,
        createdby: session?.user?.name,
        artnr_ku: values.artnr_ku,
        sernr_ku: values.sernr_ku,
        nr_kunde: values.nr_kunde,
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
      form.setFieldValue(
        "valand",
        normalizeAlpha2CountryCode(address.valand) ?? "",
      );
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
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <Button
          variant="transparent"
          color="gray"
          component={Link}
          href="/ticket"
          leftSection={<IconChevronLeft size={16} />}
        >
          {t(locale, "allTickets")}
        </Button>
      </div>
      <Paper mx="auto" p="xl" w="100%" maw={800}>
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
                      renderOption={({ option }) => {
                        const highlighted = option.value === "0000";
                        return (
                          <Text
                            size="sm"
                            c={highlighted ? "yellow" : undefined}
                          >
                            {option.label}
                          </Text>
                        );
                      }}
                      checkIconPosition="right"
                      searchable
                      allowDeselect={false}
                      {...form.getInputProps("vanr")}
                      withAsterisk
                    />
                    <Paper p="lg" bg="var(--background)" shadow="xl">
                      <div className="grid md:grid-cols-2 gap-2">
                        <TextInput
                          label="Name 1"
                          className="md:col-span-2"
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
                          className="md:col-span-2"
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
                        <Select
                          label={t(locale, "country")}
                          data={countryCodes(locale)}
                          searchable
                          checkIconPosition="right"
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
                  data={
                    isPreview
                      ? [
                          { label: t(locale, "newPerson"), value: "NEW" },
                          ...personOptions,
                        ]
                      : personOptions
                  }
                  renderOption={({ option }) => {
                    const highlighted = option.value === "NEW";
                    return (
                      <Text size="sm" c={highlighted ? "yellow" : undefined}>
                        {option.label}
                      </Text>
                    );
                  }}
                  checkIconPosition="right"
                  {...form.getInputProps("kdnr_full")}
                  withAsterisk
                />
                {form.values.kdnr_full === "NEW" && (
                  <Paper p="lg" bg="var(--background)" shadow="xl">
                    <div className="grid md:grid-cols-2 gap-2">
                      <TextInput
                        label={t(locale, "lastName")}
                        withAsterisk
                        {...form.getInputProps("newPersonLastName")}
                      />
                      <TextInput
                        label={t(locale, "firstName")}
                        withAsterisk
                        {...form.getInputProps("newPersonFirstName")}
                      />
                      <TextInput
                        label={t(locale, "email")}
                        className="md:col-span-2"
                        withAsterisk
                        {...form.getInputProps("newPersonEmail")}
                      />
                    </div>
                  </Paper>
                )}
              </Stack>
            </Stepper.Step>

            <Stepper.Step
              label={t(locale, "details")}
              icon={<IconInfoCircle size={18} />}
            >
              <Stack>
                <div className="grid md:grid-cols-5 gap-2">
                  <ProductSelect
                    label={t(locale, "articleNumber")}
                    value={form.values.artnr_ku}
                    onChange={(val) =>
                      form.setFieldValue("artnr_ku", val ?? "")
                    }
                    withAsterisk
                    className="md:col-span-2"
                  />
                  <TextInput
                    label={t(locale, "serialNumber")}
                    className="md:col-span-2"
                    {...form.getInputProps("sernr_ku")}
                  />
                  <NumberInput
                    label={t(locale, "quantity")}
                    min={1}
                    {...form.getInputProps("menge")}
                    withAsterisk
                  />
                </div>
                <TextInput
                  label={t(locale, "customerReferenceNumber")}
                  {...form.getInputProps("nr_kunde")}
                />
                <Textarea
                  label={t(locale, "descriptionLabel")}
                  rows={4}
                  {...form.getInputProps("descr")}
                  withAsterisk
                />
                <FileDropzone
                  files={form.values.files}
                  onChange={(files) => form.setFieldValue("files", files)}
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
    </main>
  );
}
