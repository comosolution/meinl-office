"use client";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Campaign } from "@/app/lib/interfaces";
import { notEmptyValidation } from "@/app/lib/utils";
import { Button, Paper, Select, Textarea, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendarEvent,
  IconCalendarWeek,
  IconChevronLeft,
  IconPlus,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brands } from "../../lib/data";

export default function Page() {
  const { data: session } = useSession();
  const { source, locale } = useOffice();
  const router = useRouter();

  const form = useForm<Campaign>({
    validateInputOnChange: true,
    initialValues: {
      id: 0,
      salt: null,
      brand: brands[0],
      title: "",
      description: "",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      dealers: [],
      products: [],
    },
    validate: {
      title: (value) =>
        notEmptyValidation(value, t(locale, "pleaseEnterTitle")),
    },
  });

  if (source === "OFFUSA") return;

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <Button
          variant="transparent"
          color="gray"
          component={Link}
          href="/campaign"
          leftSection={<IconChevronLeft size={16} />}
        >
          {t(locale, "allCampaigns")}
        </Button>
      </div>
      <Paper mx="auto" p="xl" w="100%" maw={800}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.onSubmit(async (values) => {
            const response = await fetch("/api/campaign/save", {
              method: "POST",
              body: JSON.stringify({
                ...values,
                source,
                user: session?.user?.name,
              }),
            });
            if (response.ok) {
              router.push("/campaign");
            }
          })}
        >
          <h1>{t(locale, "newCampaign")}</h1>
          <Select
            label={t(locale, "brand")}
            data={brands}
            allowDeselect={false}
            checkIconPosition="right"
            withAsterisk
            aria-readonly={false}
            {...form.getInputProps("brand")}
          />
          <TextInput
            label={t(locale, "title")}
            withAsterisk
            {...form.getInputProps("title")}
          />
          <Textarea
            label={t(locale, "description")}
            {...form.getInputProps("description")}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <DateTimePicker
              label={t(locale, "start")}
              valueFormat="DD.MM.YYYY HH:mm"
              rightSection={<IconCalendarEvent size={20} />}
              rightSectionPointerEvents="none"
              aria-readonly={false}
              {...form.getInputProps("start")}
            />
            <DateTimePicker
              label={t(locale, "end")}
              valueFormat="DD.MM.YYYY HH:mm"
              rightSection={<IconCalendarWeek size={20} />}
              rightSectionPointerEvents="none"
              aria-readonly={false}
              {...form.getInputProps("end")}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={!form.isValid()}
              leftSection={<IconPlus size={16} />}
            >
              {t(locale, "addCampaign")}
            </Button>
          </div>
        </form>
      </Paper>
    </main>
  );
}
