"use client";
import Loader from "@/app/components/loader";
import { useOffice } from "@/app/context/officeContext";
import { brands } from "@/app/lib/data";
import { Campaign, Company } from "@/app/lib/interfaces";
import { notEmptyValidation } from "@/app/lib/utils";
import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Fieldset,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendarEvent,
  IconCalendarWeek,
  IconCheck,
  IconChevronLeft,
  IconCopy,
  IconDeviceFloppy,
  IconEdit,
  IconExternalLink,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getInitialValues } from "./form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { companies } = useOffice();

  const [campaign, setCampaign] = useState<Campaign>();
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedKdnrs, setSelectedKdnrs] = useState<number[]>([]);

  const router = useRouter();

  const form = useForm<Campaign>({
    initialValues: getInitialValues({} as Campaign),
    validate: {
      title: (value) => notEmptyValidation(value, "Bitte Titel angeben."),
    },
    validateInputOnChange: true,
  });

  const dealerLocLink = `https://meinl-dealers.vercel.app?campagne=${
    form.values.id
  }&brand=${form.values.brand.replaceAll(" ", "-")}`;

  useEffect(() => {
    getCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!campaign) return;

    form.setValues(getInitialValues(campaign));
    setSelectedKdnrs(campaign.dealers || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  const getCampaign = async () => {
    const response = await fetch(`/api/campaign/${id}`);
    const data = await response.json();
    setCampaign(data[0]);
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/campaign/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/campaign");
    }
  };

  const suggestions = useMemo(() => {
    const lower = search.toLowerCase();
    return companies.filter(
      (c) =>
        !selectedKdnrs.includes(c.kdnr) &&
        (c.kdnr.toString().includes(lower) ||
          c.name1.toLowerCase().includes(lower) ||
          c.name2.toLowerCase().includes(lower) ||
          c.name3.toLowerCase().includes(lower))
    );
  }, [search, companies, selectedKdnrs]);

  const selectCompany = (company: Company) => {
    const newSelected = [...selectedKdnrs, company.kdnr];
    setSelectedKdnrs(newSelected);
    form.setFieldValue("dealers", newSelected);
    setSearch("");
  };

  const removeCompany = (kdnr: number) => {
    const newSelected = selectedKdnrs.filter((id) => id !== kdnr);
    setSelectedKdnrs(newSelected);
    form.setFieldValue("dealers", newSelected);
  };

  if (!campaign) return <Loader />;

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2">
        <Button
          variant="light"
          color="gray"
          leftSection={<IconChevronLeft size={16} />}
          component={Link}
          href="/campaign"
        >
          Alle Kampagnen
        </Button>
      </div>

      <header className="flex items-center gap-4 p-4">
        <div className="flex flex-col gap-1 w-full">
          <h1>{campaign.title}</h1>
          <p className="dimmed flex gap-2">
            Kampagne für{" "}
            <Image
              src={`/brands/${campaign.brand
                .replaceAll(" ", "-")
                .toUpperCase()}.png`}
              width={24}
              height={24}
              alt={`${campaign.brand} Logo`}
              className="inverted object-contain"
            />{" "}
            {campaign.brand}
          </p>
        </div>
      </header>

      <form
        onSubmit={form.onSubmit(async (values) => {
          const response = await fetch("/api/campaign", {
            method: "POST",
            body: JSON.stringify(values),
          });
          if (response.ok) {
            getCampaign();
            setEdit(false);
          }
        })}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2 flex justify-between gap-2">
          {edit ? (
            <Button.Group>
              <Button
                color="dark"
                variant="light"
                onClick={async () => {
                  await getCampaign();
                  setEdit(false);
                }}
              >
                Verwerfen
              </Button>
              <Button
                type="submit"
                color="dark"
                leftSection={<IconDeviceFloppy size={16} />}
                disabled={!form.isValid()}
              >
                Änderungen speichern
              </Button>
            </Button.Group>
          ) : (
            <Button
              color="dark"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEdit(true)}
            >
              Kampagne bearbeiten
            </Button>
          )}
          {del ? (
            <Button.Group>
              <Button
                onClick={handleDelete}
                leftSection={<IconTrash size={16} />}
              >
                Kampagne endgültig löschen
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  setDel(false);
                }}
              >
                Abbrechen
              </Button>
            </Button.Group>
          ) : (
            <Button
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={() => {
                setDel(true);
              }}
            >
              Löschen
            </Button>
          )}
        </div>

        <div className="col-span-2 flex">
          <TextInput className="w-full" value={dealerLocLink} readOnly />
          <Button.Group>
            <CopyButton value={dealerLocLink}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? "red" : "dark"}
                  onClick={copy}
                  leftSection={
                    copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                  }
                >
                  {copied ? "Link kopiert" : "Link kopieren"}
                </Button>
              )}
            </CopyButton>

            <Button
              variant="light"
              color="dark"
              component="a"
              href={dealerLocLink}
              target="_blank"
              leftSection={<IconExternalLink size={16} />}
            >
              Öffnen
            </Button>
          </Button.Group>
        </div>

        <Fieldset>
          <h2>Daten</h2>
          <Select
            label="Brand"
            data={brands}
            allowDeselect={false}
            checkIconPosition="right"
            withAsterisk
            {...form.getInputProps("brand")}
            readOnly={!edit}
            aria-readonly={!edit}
          />
          <TextInput
            label="Titel"
            withAsterisk
            {...form.getInputProps("title")}
            readOnly={!edit}
          />
          <Textarea
            label="Beschreibung"
            {...form.getInputProps("description")}
            readOnly={!edit}
          />
          <div className="grid grid-cols-2 gap-4">
            <DatePickerInput
              label="Start"
              rightSection={<IconCalendarEvent size={20} />}
              rightSectionPointerEvents="none"
              {...form.getInputProps("start")}
              readOnly={!edit}
              aria-readonly={!edit}
            />
            <DatePickerInput
              label="Ende"
              rightSection={<IconCalendarWeek size={20} />}
              rightSectionPointerEvents="none"
              {...form.getInputProps("end")}
              readOnly={!edit}
              aria-readonly={!edit}
            />
          </div>
        </Fieldset>
        <Fieldset>
          <h2>Händler</h2>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <TextInput
                label="Teilnehmende Händler"
                placeholder="Nach Name oder Kdnr suchen ..."
                rightSection={
                  search.length > 0 ? (
                    <ActionIcon
                      variant="light"
                      color="dark"
                      onClick={() => setSearch("")}
                    >
                      <IconX />
                    </ActionIcon>
                  ) : undefined
                }
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                readOnly={!edit}
              />
              {search && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((c) => (
                    <div
                      key={c.kdnr}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                      onClick={() => selectCompany(c)}
                    >
                      <p>
                        <b>{c.name1}</b> {c.name2} {c.name3}
                      </p>
                      <p className="text-xs dimmed">{c.kdnr}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedKdnrs.length > 0 &&
              selectedKdnrs.map((kdnr) => {
                const company = companies.find((c) => c.kdnr === kdnr);
                if (!company) return null;
                return (
                  <Card key={kdnr} shadow="sm" p="md" bg="var(--background)">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3>
                          {company.name1} {company.name2} {company.name3}
                        </h3>
                        <p className="text-xs dimmed">{company.kdnr}</p>
                      </div>
                      <ActionIcon
                        color="red"
                        onClick={() => removeCompany(kdnr)}
                        disabled={!edit}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </div>
                  </Card>
                );
              })}
          </div>
        </Fieldset>
      </form>
    </main>
  );
}
