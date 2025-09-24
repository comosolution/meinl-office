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
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendar,
  IconCirclePlus,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { brands } from "../lib/data";

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);

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
              <Table.Th>ID</Table.Th>
              <Table.Th>Brand</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>Ende</Table.Th>
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
              <Table.Tr key={index}>
                <Table.Td>{campaign.id}</Table.Td>
                <Table.Td>{campaign.brand}</Table.Td>
                <Table.Td>{campaign.title}</Table.Td>
                <Table.Td>{campaign.start}</Table.Td>
                <Table.Td>{campaign.end}</Table.Td>
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
        <div className="flex flex-col gap-4">
          <h2>Kampagne anlegen</h2>
          <Select label="Brand" data={brands} withAsterisk />
          <TextInput label="Titel" withAsterisk />
          <Textarea label="Beschreibung" />
          <div className="grid grid-cols-2 gap-4">
            <DatePickerInput
              label="Start"
              rightSection={<IconCalendar size={20} />}
              rightSectionPointerEvents="none"
            />
            <DatePickerInput
              label="Ende"
              rightSection={<IconCalendar size={20} />}
              rightSectionPointerEvents="none"
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button variant="transparent" color="gray" onClick={close}>
              Abbrechen
            </Button>
            <Button leftSection={<IconDeviceFloppy size={16} />}>
              Anlegen
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
