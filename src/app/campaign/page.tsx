"use client";
import {
  Avatar,
  Button,
  Drawer,
  Select,
  Table,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { brands } from "../lib/data";
import { Campaign } from "../lib/interfaces";
import { notEmptyValidation } from "../lib/utils";

export default function Page() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const getCampaigns = async () => {
    setLoading(true);
    const res = await fetch("/api/campaign");
    const data = await res.json();
    setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => {
    getCampaigns();
  }, []);

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

  const formatDate = (date: string | Date) => {
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
      return date.toString();
    }
  };

  if (loading) return <Loader />;

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
              Neue Kampagne anlegen
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
              <Table.Th>Händler</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {campaigns
              .sort((a, b) => a.id - b.id)
              .map((campaign, index) => (
                <Table.Tr
                  key={index}
                  className="cursor-pointer"
                  onClick={() => router.push(`/campaign/${campaign.id}`)}
                >
                  <Table.Td>{campaign.id}</Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Avatar size={28}>
                        <Image
                          src={`/brands/${campaign.brand
                            ?.replaceAll(" ", "-")
                            .toUpperCase()}.png`}
                          width={20}
                          height={20}
                          alt={`${campaign.brand} Logo`}
                          className="inverted object-contain"
                        />
                      </Avatar>
                      <p>{campaign.brand}</p>
                    </div>
                  </Table.Td>
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
              getCampaigns();
              close();
            }
          })}
        >
          <h2>Kampagne anlegen</h2>
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
          <Textarea
            label="Beschreibung"
            {...form.getInputProps("description")}
          />
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
          <div className="flex justify-between gap-4">
            <Button variant="transparent" color="gray" onClick={close}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={!form.isValid()}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              Speichern
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
