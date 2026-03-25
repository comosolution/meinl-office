"use client";
import { useOffice } from "@/app/context/officeContext";
import { Campaign } from "@/app/lib/interfaces";
import { notEmptyValidation } from "@/app/lib/utils";
import { Button, Paper, Select, Textarea, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendarEvent,
  IconCalendarWeek,
  IconPlus,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { brands } from "../../lib/data";

export default function Page() {
  const { data: session } = useSession();
  const { source } = useOffice();
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
      title: (value) => notEmptyValidation(value, "Bitte Titel angeben."),
    },
  });

  return (
    <Paper mx="auto" p="xl" mt="xl" w="100%" maw={800}>
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
        <h1>Neue Kampagne</h1>
        <Select
          label="Brand"
          data={brands}
          allowDeselect={false}
          checkIconPosition="right"
          withAsterisk
          aria-readonly={false}
          {...form.getInputProps("brand")}
        />
        <TextInput
          label="Titel"
          withAsterisk
          {...form.getInputProps("title")}
        />
        <Textarea label="Beschreibung" {...form.getInputProps("description")} />
        <div className="grid grid-cols-2 gap-4">
          <DateTimePicker
            label="Start"
            valueFormat="DD.MM.YYYY HH:mm"
            rightSection={<IconCalendarEvent size={20} />}
            rightSectionPointerEvents="none"
            aria-readonly={false}
            {...form.getInputProps("start")}
          />
          <DateTimePicker
            label="Ende"
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
            Kampagne erstellen
          </Button>
        </div>
      </form>
    </Paper>
  );
}
