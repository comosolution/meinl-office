"use client";
import {
  Button,
  Drawer,
  Select,
  Table,
  Textarea,
  TextInput,
  Tooltip,
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
import { format, formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { brands } from "../lib/data";
import { Campaign } from "../lib/interfaces";
import { notEmptyValidation } from "../lib/utils";

export default function Page() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const getCampaigns = async () => {
    const res = await fetch("/api/campaign");
    const data = await res.json();
    setCampaigns(data);
  };

  useEffect(() => {
    getCampaigns();
  }, []);

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

  const formatDate = (date: string) => {
    if (!date) return;

    try {
      const distance = formatDistance(date, new Date(), {
        addSuffix: true,
        locale: de,
      });

      return (
        <Tooltip
          label={format(date, "dd.MM.yyyy hh:mm:ss")}
          position="left"
          withArrow
        >
          <span>{distance}</span>
        </Tooltip>
      );
    } catch {
      return date;
    }
  };

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
            {campaigns.map((campaign, index) => (
              <Table.Tr
                key={index}
                className="cursor-pointer"
                onClick={() => router.push(`/campaign/${campaign.id}`)}
              >
                <Table.Td>{campaign.id}</Table.Td>
                <Table.Td>{campaign.brand}</Table.Td>
                <Table.Td>{campaign.title}</Table.Td>
                <Table.Td>
                  {campaign.start ? formatDate(campaign.start) : ""}
                </Table.Td>
                <Table.Td>
                  {campaign.end ? formatDate(campaign.end) : ""}
                </Table.Td>
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
            const response = await fetch("/api/campaign", {
              method: "POST",
              body: JSON.stringify(values),
            });
            if (response.ok) {
              close();
            }
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
