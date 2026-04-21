"use client";
import { CustomerSelect } from "@/app/components/customerSelect";
import { useOffice } from "@/app/context/officeContext";
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
import { formatDateToString } from "@/app/lib/utils";
import {
  Autocomplete,
  Button,
  Checkbox,
  Group,
  Paper,
  Radio,
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
  IconIdBadge2,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getInitialValues, validateForm, type FormValues } from "../[id]/form";

export default function NewPersonPage() {
  const { data: session } = useSession();
  const { locale, source } = useOffice();

  const [active, setActive] = useState(0);

  const router = useRouter();
  const STEPS = 5;

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

  return (
    <Paper mx="auto" p="xl" mt="xl" w="100%" maw={800}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.onSubmit(async (values: FormValues) => {
          const formattedDob = formatDateToString(values.gebdat as Date);
          const formattedCompetences = values.zustaendig.join(",");
          const formattedB2bDlTyp = values.b2bdltyp.join(",");

          const payload = {
            ...values,
            id: 0,
            kdnr: Number(values.kdnr),
            geburtsdatum: formattedDob,
            zustaendig: formattedCompetences,
            b2bdltyp: formattedB2bDlTyp,
            source,
            user: session?.user?.name,
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
        <h1>{t(locale, "newPerson")}</h1>
        <Stepper active={active} allowNextStepsSelect={false}>
          <Stepper.Step
            label={t(locale, "company")}
            icon={<IconBuildings size={18} />}
          >
            <Stack>
              <CustomerSelect
                withAsterisk
                value={form.values.kdnr?.toString() ?? null}
                onChange={(val) =>
                  form.setFieldValue("kdnr", val ? Number(val) : "")
                }
                autoFocus
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label={t(locale, "person")}
            icon={<IconUser size={18} />}
          >
            <Stack>
              <h2>{t(locale, "personalData")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <Autocomplete
                  label={t(locale, "salutation")}
                  data={genders}
                  {...form.getInputProps("anrede")}
                  withAsterisk
                />
                <Autocomplete
                  label={t(locale, "title")}
                  data={titles}
                  {...form.getInputProps("titel")}
                />
                <TextInput
                  label={t(locale, "lastName")}
                  {...form.getInputProps("nachname")}
                  withAsterisk
                />
                <TextInput
                  label={t(locale, "firstName")}
                  {...form.getInputProps("vorname")}
                  withAsterisk
                />
                <TextInput
                  label={t(locale, "position")}
                  {...form.getInputProps("jobpos")}
                />
                <TextInput
                  label={t(locale, "department")}
                  {...form.getInputProps("abteilung")}
                />
              </div>
              <h2>{t(locale, "communication")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label={t(locale, "phone")}
                  {...form.getInputProps("phone")}
                />
                <TextInput
                  label={t(locale, "mobile")}
                  {...form.getInputProps("mobil")}
                />
                <TextInput
                  label={t(locale, "fax")}
                  {...form.getInputProps("fax")}
                />
                <TextInput
                  label={t(locale, "email")}
                  {...form.getInputProps("email")}
                  withAsterisk
                />
                <TextInput
                  label={t(locale, "managedBy")}
                  {...form.getInputProps("betreutvon")}
                />
              </div>
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label={t(locale, "b2b")}
            icon={<IconIdBadge2 size={18} />}
          >
            <Stack>
              <h2>{t(locale, "b2bAccess")}</h2>
              <Radio.Group {...form.getInputProps("b2bzugriff")}>
                <div className="flex flex-col gap-2">
                  {b2bAccess(source).map((b, i) => (
                    <Radio key={i} label={b.label} value={b.value} />
                  ))}
                </div>
              </Radio.Group>
              <h2>{t(locale, "availableDownloads")}</h2>
              <Checkbox
                label={t(locale, "noDownloads")}
                {...form.getInputProps("b2bdldis", { type: "checkbox" })}
              />
              {!form.values.b2bdldis && (
                <Paper py="md" shadow="xl" bg="var(--background)" withBorder>
                  <Checkbox.Group {...form.getInputProps("b2bdltyp")}>
                    <div className="flex flex-col gap-2">
                      {downloads(source).map((d, i) => (
                        <Checkbox key={i} label={d.label} value={d.value} />
                      ))}
                    </div>
                  </Checkbox.Group>
                </Paper>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label={t(locale, "responsibilities")}
            icon={<IconChecklist size={18} />}
          >
            <Stack>
              <h2>{t(locale, "responsibilities")}</h2>
              <Checkbox.Group {...form.getInputProps("zustaendig")}>
                <div className="grid grid-cols-2 gap-2">
                  {competences.map((c, i) => (
                    <Checkbox key={i} label={c} value={c} />
                  ))}
                </div>
              </Checkbox.Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label={t(locale, "privateSection")}
            icon={<IconBalloon size={18} />}
          >
            <Stack>
              <h2>{t(locale, "personalAddress")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label={t(locale, "country")}
                  {...form.getInputProps("landpr")}
                />
                <TextInput
                  label={t(locale, "street")}
                  {...form.getInputProps("strassepr")}
                />
                <TextInput
                  label={t(locale, "postalCode")}
                  {...form.getInputProps("plzpr")}
                />
                <TextInput
                  label={t(locale, "city")}
                  {...form.getInputProps("ortpr")}
                />
              </div>
              <h2>{t(locale, "details")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label={t(locale, "dateOfBirth")}
                  locale="de"
                  valueFormat="DD.MM.YYYY"
                  defaultLevel="decade"
                  {...form.getInputProps("gebdat")}
                />
                <Select
                  label={t(locale, "maritalStatus")}
                  data={familyStatus}
                  {...form.getInputProps("famstand")}
                  checkIconPosition="right"
                  aria-readonly={false}
                />
                <TextInput
                  label={t(locale, "hobbies")}
                  {...form.getInputProps("hobbies")}
                />
                <Autocomplete
                  label={t(locale, "tShirtSize")}
                  data={sizes}
                  {...form.getInputProps("tshirt")}
                />
                <TextInput
                  label={t(locale, "musicGenre")}
                  {...form.getInputProps("musikri")}
                />
                <TextInput
                  label={t(locale, "instrument")}
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
              {t(locale, "back")}
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
              {t(locale, "createPerson")}
            </Button>
          )}
        </Group>
      </form>
    </Paper>
  );
}
