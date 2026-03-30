"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import Map from "@/app/components/map";
import LogoPreview from "@/app/components/preview";
import FileUploader from "@/app/components/upload";
import { useOffice } from "@/app/context/officeContext";
import { MEINL_OFFICE_DEALER_HISTORY_KEY } from "@/app/lib/constants";
import { t } from "@/app/lib/i18n";
import { Company, DealerInStorage } from "@/app/lib/interfaces";
import { getAvatarColor, parseUrl } from "@/app/lib/utils";
import {
  ActionIcon,
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
  IconExternalLink,
  IconPhoto,
  IconShoppingCartPin,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const { source, locale } = useOffice();

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
    const response = await fetch("/api/company/", {
      method: "POST",
      body: JSON.stringify({ kdnr, source }),
    });

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
              {t(locale, "backToStart")}
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
      kundenart: distributor.kundenart,
      name: distributor.name1,
      source,
    };

    const history: DealerInStorage[] = JSON.parse(
      localStorage.getItem(MEINL_OFFICE_DEALER_HISTORY_KEY) || "[]",
    );

    const filteredHistory = history.filter(
      (item) => item.kdnr !== newEntry.kdnr,
    );

    const updatedHistory = [newEntry, ...filteredHistory];
    localStorage.setItem(
      MEINL_OFFICE_DEALER_HISTORY_KEY,
      JSON.stringify(updatedHistory),
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
            {t(locale, "discard")}
          </Button>
          <Button
            type="submit"
            color="dark"
            variant="light"
            leftSection={<IconDeviceFloppy size={16} />}
            disabled={!form.isValid()}
          >
            {t(locale, "saveChanges")}
          </Button>
        </Button.Group>
      ) : (
        <Button
          color="dark"
          variant="transparent"
          leftSection={<IconEdit size={16} />}
          onClick={() => setEdit(true)}
        >
          {t(locale, "editData")}
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
            {t(locale, "allCompanies")}
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
        <Button.Group>
          <Contact email={company.mailadr} phone={company.telefon} />
        </Button.Group>
      </div>

      <header className="flex items-center gap-4 py-4">
        <Avatar
          size={72}
          variant="filled"
          color={getAvatarColor(company.kundenart)}
        >
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
            {t(locale, "dealerFor")}{" "}
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
            {t(locale, "dealer")}
          </Tabs.Tab>
          <Tabs.Tab value="logo" leftSection={<IconPhoto size={16} />}>
            {t(locale, "companyLogo")}
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
            {t(locale, "dealerLocator")}
          </Tabs.Tab>
        </Tabs.List>

        <form
          onSubmit={form.onSubmit(async (values) => {
            const response = await fetch("/api/company/save", {
              method: "POST",
              body: JSON.stringify({
                ...values,
                source,
                user: session?.user?.name,
              }),
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
                <h2>{t(locale, "company")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={t(locale, "nameLabel")}
                    {...form.getInputProps("name1")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "nameLabel") + " 2"}
                    {...form.getInputProps("name2")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "matchcode")}
                    {...form.getInputProps("matchcode")}
                    readOnly
                  />
                  <NumberInput
                    label={t(locale, "customerNumber")}
                    {...form.getInputProps("kdnr")}
                    readOnly
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "address")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={t(locale, "country")}
                    {...form.getInputProps("land")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "streetPostbox")}
                    {...form.getInputProps("strasse")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "postalCode")}
                    {...form.getInputProps("plz")}
                    readOnly={!edit}
                  />
                  <TextInput
                    label={t(locale, "city")}
                    {...form.getInputProps("ort")}
                    readOnly={!edit}
                  />
                </div>
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "communication")}</h2>
                <TextInput
                  label={t(locale, "phone")}
                  {...form.getInputProps("telefon")}
                  readOnly
                />
                <TextInput
                  label={t(locale, "email")}
                  {...form.getInputProps("mailadr")}
                  readOnly
                />
              </Fieldset>
              <Fieldset>
                <h2>{t(locale, "socialMedia")}</h2>
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
                label={`${distributor.name1} ${t(locale, "showInDealerLocator")}.`}
                {...form.getInputProps("dealerloc", { type: "checkbox" })}
                disabled={!edit}
              />

              <Fieldset>
                <h2>{t(locale, "details")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label={t(locale, "websiteUrl")}
                    {...form.getInputProps("www")}
                    readOnly={!edit}
                    rightSection={
                      <div className="flex">
                        <ActionIcon
                          size="sm"
                          variant="transparent"
                          color="dark"
                          component="a"
                          href={parseUrl(distributor.www)}
                          target="_blank"
                        >
                          <IconExternalLink size={16} />
                        </ActionIcon>
                      </div>
                    }
                  />
                  <TextInput
                    label={t(locale, "customerType")}
                    {...form.getInputProps("type")}
                    readOnly
                  />
                  <TextInput
                    label={t(locale, "latitude")}
                    {...form.getInputProps("latitude")}
                    readOnly
                  />
                  <TextInput
                    label={t(locale, "longitude")}
                    {...form.getInputProps("longitude")}
                    readOnly
                  />
                </div>
                <Checkbox
                  size="md"
                  className="mt-4"
                  label={`${distributor.name1} ${t(locale, "isExperienceCenter")}.`}
                  {...form.getInputProps("expCenter", { type: "checkbox" })}
                  disabled={!edit}
                />
              </Fieldset>
              {distributor.latitude !== null &&
                distributor.longitude !== null && <Map company={distributor} />}
              <Fieldset>
                <h2>{t(locale, "campaigns")}</h2>
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t(locale, "idLabel")}</Table.Th>
                      <Table.Th>{t(locale, "nameLabel")}</Table.Th>
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
