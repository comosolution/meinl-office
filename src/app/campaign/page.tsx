"use client";
import {
  Button,
  Drawer,
  Select,
  Table,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconCalendarWeek,
  IconCirclePlus,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { brands } from "../lib/data";
import { Campaign } from "../lib/interfaces";
import { notEmptyValidation } from "../lib/utils";

export default function Page() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Campaign>({
    validateInputOnChange: true,
    initialValues: {
      id: 0,
      brand: "Meinl Cymbals",
      title: "",
      description: "",
      start: null,
      end: null,
      dealers: [""],
    },
    validate: {
      title: (value) => notEmptyValidation(value, "Bitte Titel angeben."),
    },
  });

  return (
    <>
      <main className="flex flex-col gap-8 px-8 py-4">
        <header className="flex justify-between items-center gap-2 p-4">
          <h1>Kampagnen</h1>
          <div className="flex gap-1">
            <Button
              color="dark"
              leftSection={<IconCirclePlus size={16} />}
              onClick={open}
            >
              Kampagne anlegen
            </Button>
          </div>
        </header>
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Brand</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>Ende</Table.Th>
              <Table.Th>Dealer</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[
              {
                id: 1,
                brand: "Meinl Cymbals",
                title: "Master Cymbals Set",
                description:
                  "A custom-made cymbal set for professionals handmade in Germany",
                start: "2025-09-24T11:06:06.703Z",
                end: "2025-09-28T12:00:00.000Z",
                dealers: ["52700", "31225"],
              },
            ].map((campaign, index) => (
              <Table.Tr
                key={index}
                className="cursor-pointer"
                onClick={() => router.push(`/campaign/${campaign.id}`)}
              >
                <Table.Td>{campaign.id}</Table.Td>
                <Table.Td>{campaign.brand}</Table.Td>
                <Table.Td>{campaign.title}</Table.Td>
                <Table.Td>{campaign.start}</Table.Td>
                <Table.Td>{campaign.end}</Table.Td>
                <Table.Td>{campaign.dealers.length}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </main>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={form.onSubmit(async (values) => {
            // const response = await fetch("/api/customer", {
            //   method: "POST",
            //   body: JSON.stringify(values),
            // });
            // if (response.ok) {
            console.log(values);
            close();
            // }
          })}
        >
          <h2>Kampagne anlegen</h2>
          <Select
            label="Brand"
            data={brands}
            allowDeselect={false}
            withAsterisk
            {...form.getInputProps("brand")}
          />
          <TextInput
            label="Titel"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Beschreibung"
            {...form.getInputProps("description")}
          />
          <div className="grid grid-cols-2 gap-4">
            <DatePickerInput
              label="Start"
              rightSection={<IconCalendarEvent size={20} />}
              rightSectionPointerEvents="none"
              {...form.getInputProps("start")}
            />
            <DatePickerInput
              label="Ende"
              rightSection={<IconCalendarWeek size={20} />}
              rightSectionPointerEvents="none"
              {...form.getInputProps("end")}
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button variant="transparent" color="gray" onClick={close}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={!form.isValid()}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              Anlegen
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
