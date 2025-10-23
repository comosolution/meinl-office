"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import Map from "@/app/components/map";
import LogoPreview from "@/app/components/preview";
import FileUploader from "@/app/components/upload";
import { MEINL_OFFICE_DEALER_HISTORY_KEY } from "@/app/lib/constants";
import { Company, DealerInStorage } from "@/app/lib/interfaces";
import { getAvatarColor } from "@/app/lib/utils";
import {
  Avatar,
  Button,
  Checkbox,
  Fieldset,
  NumberInput,
  Table,
  Tabs,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBuildingEstate,
  IconBuildingWarehouse,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconDeviceFloppy,
  IconEdit,
  IconPhoto,
  IconShoppingCartPin,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getInitialValues, validateForm } from "../form";

export default function Page({
  params,
}: {
  params: Promise<{ kdnr: string; id: string }>;
}) {
  const { kdnr, id } = React.use(params);
  const [company, setCompany] = useState<Company>();
  const [distributor, setDistributor] = useState<Company>();
  const [activeTab, setActiveTab] = useState<string | null>("info");
  const [edit, setEdit] = useState(false);

  const router = useRouter();

  const form = useForm<Company>({
    initialValues: getInitialValues({} as Company),
    validateInputOnChange: true,
    validate: validateForm,
  });

  useEffect(() => {
    getCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kdnr]);

  useEffect(() => {
    if (!distributor) return;
    updateHistory();
    form.setValues(getInitialValues(distributor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const getCompany = async () => {
    const response = await fetch(`/api/company/${kdnr}`);

    if (!response.ok) {
      notifications.show({
        id: `error-${kdnr}`,
        title: `Fehler ${response.status}`,
        message: (
          <>
            <p>{await response.json()}</p>
            <Button
              size="xs"
              variant="light"
              mt={8}
              rightSection={<IconChevronRight size={12} />}
              onClick={() => {
                router.push("/");
                notifications.hide(`error-${kdnr}`);
              }}
              fullWidth
            >
              Zurück zur Startseite
            </Button>
          </>
        ),
        autoClose: false,
        withCloseButton: false,
      });
      return;
    }

    const companies: Company[] = await response.json();
    setCompany(companies[0]);
    setDistributor(companies[0].haendler.find((h) => h.id === +id));
  };

  const updateHistory = () => {
    if (!distributor) return;

    const newEntry: DealerInStorage = {
      id: distributor.id.toString(),
      kdnr: distributor.kdnr,
      name: distributor.name1,
    };

    const history: DealerInStorage[] = JSON.parse(
      localStorage.getItem(MEINL_OFFICE_DEALER_HISTORY_KEY) || "[]"
    );

    const filteredHistory = history.filter(
      (item) => item.kdnr !== newEntry.kdnr
    );

    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 5);
    localStorage.setItem(
      MEINL_OFFICE_DEALER_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  };

  if (!company || !distributor) return <Loader />;

  const actions = (
    <div className="col-span-2 flex justify-end gap-2">
      {edit ? (
        <Button.Group>
          <Button
            color="dark"
            variant="transparent"
            onClick={async () => {
              await getCompany();
              setEdit(false);
            }}
          >
            Verwerfen
          </Button>
          <Button
            type="submit"
            color="dark"
            variant="light"
            leftSection={<IconDeviceFloppy size={16} />}
            disabled={!form.isValid()}
          >
            Änderungen speichern
          </Button>
        </Button.Group>
      ) : (
        <Button
          color="dark"
          variant="transparent"
          leftSection={<IconEdit size={16} />}
          onClick={() => setEdit(true)}
        >
          Daten bearbeiten
        </Button>
      )}
    </div>
  );

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-baseline gap-2">
        <Button.Group>
          <Button
            variant="light"
            color="gray"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href="/company"
          >
            Alle Firmen
          </Button>
          <Button
            color="gray"
            variant="transparent"
            leftSection={<IconChevronLeft size={16} />}
            component={Link}
            href={`/company/${company.kdnr}`}
          >
            {company.name1}
          </Button>
        </Button.Group>
        <Contact email={company.mailadr} phone={company.telefon} />
      </div>

      <header className="flex items-center gap-4 py-4">
        <Avatar size={72} variant="filled" color={getAvatarColor(company.kdnr)}>
          <IconBuildingWarehouse size={40} stroke={2} />
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <h1>
            {distributor.name1}{" "}
            <span className="font-normal">
              {distributor.name2} {distributor.name3}
            </span>
          </h1>
          <p>
            Händler für{" "}
            <Link href={`/company/${kdnr}`} className="link">
              <b>{company.name1}</b> ({company.kdnr})
            </Link>{" "}
            – {distributor.brands as unknown as string}
          </p>
        </div>
        {distributor.logo && distributor.logo !== "" && (
          <Image
            src={distributor.logo}
            width={72}
            height={72}
            alt={`${distributor.name1} Logo`}
            className="object-contain"
          />
        )}
      </header>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<IconBuildingEstate size={16} />}>
            Händlerdaten
          </Tabs.Tab>
          <Tabs.Tab value="logo" leftSection={<IconPhoto size={16} />}>
            Händlerlogo
          </Tabs.Tab>
          <Tabs.Tab
            value="storelocator"
            leftSection={<IconShoppingCartPin size={16} />}
            rightSection={
              distributor.dealerloc ? (
                <IconCircleCheck size={16} color="gray" />
              ) : (
                <IconCircleX size={16} color="gray" />
              )
            }
          >
            DealerLocator
          </Tabs.Tab>
        </Tabs.List>

        <form
          onSubmit={form.onSubmit(async (values) => {
            const response = await fetch("/api/company", {
              method: "POST",
              body: JSON.stringify(values),
            });
            if (response.ok) {
              getCompany();
              setEdit(false);
            }
          })}
        >
          <Tabs.Panel value="info" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}
              <Fieldset>
                <h2>Unternehmen</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Name"
                    {...form.getInputProps("name1")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Zusatz"
                    {...form.getInputProps("name2")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Matchcode"
                    {...form.getInputProps("matchcode")}
                    readOnly
                  />
                  <NumberInput
                    label="Kundennummer"
                    {...form.getInputProps("kdnr")}
                    readOnly
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>Anschrift</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Land"
                    {...form.getInputProps("land")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Straße / Postfach"
                    {...form.getInputProps("strasse")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="PLZ"
                    {...form.getInputProps("plz")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Ort"
                    {...form.getInputProps("ort")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>Kommunikation</h2>
                <TextInput
                  label="Telefon"
                  {...form.getInputProps("telefon")}
                  readOnly
                />
                <TextInput
                  label="E-Mail"
                  {...form.getInputProps("mailadr")}
                  readOnly
                />
              </Fieldset>
              <Fieldset>
                <h2>Social Media</h2>
                <TextInput
                  label="Facebook"
                  rightSection={<IconBrandFacebook size={16} />}
                  {...form.getInputProps("facebook")}
                  readOnly={!edit}
                />
                <TextInput
                  label="Instagram"
                  rightSection={<IconBrandInstagram size={16} />}
                  {...form.getInputProps("instagram")}
                  readOnly={!edit}
                />
                <TextInput
                  label="YouTube"
                  rightSection={<IconBrandYoutube size={16} />}
                  {...form.getInputProps("youtube")}
                  readOnly={!edit}
                />
              </Fieldset>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="storelocator" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {actions}

              <Checkbox
                size="md"
                className="col-span-2"
                label={`${distributor.name1} im DealerLocator anzeigen.`}
                {...form.getInputProps("dealerloc", { type: "checkbox" })}
                disabled={!edit}
              />

              <Fieldset>
                <h2>Daten</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Website URL"
                    {...form.getInputProps("www")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label="Kundentyp"
                    {...form.getInputProps("type")}
                    readOnly
                  />
                  <TextInput
                    label="Breitengrad"
                    {...form.getInputProps("latitude")}
                    readOnly
                  />
                  <TextInput
                    label="Längengrad"
                    {...form.getInputProps("longitude")}
                    readOnly
                  />
                </div>
              </Fieldset>
              {distributor.latitude !== null &&
                distributor.longitude !== null && <Map company={distributor} />}
              <Fieldset>
                <h2>Kampagnen</h2>
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>Name</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {distributor.campagnen
                      .sort((a, b) => a.id - b.id)
                      .map((campaign, index) => (
                        <Table.Tr
                          key={index}
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/campaign/${campaign.id}`)
                          }
                        >
                          <Table.Td>{campaign.id}</Table.Td>
                          <Table.Td>{campaign.title}</Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </Fieldset>
            </div>
          </Tabs.Panel>
        </form>

        <Tabs.Panel value="logo" className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <LogoPreview company={distributor} onDelete={() => getCompany()} />
            <FileUploader
              company={distributor}
              onSuccess={() => getCompany()}
            />
          </div>
        </Tabs.Panel>
      </Tabs>
    </main>
  );
}
