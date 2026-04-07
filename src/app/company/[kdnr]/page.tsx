"use client";
import Contact from "@/app/components/contact";
import Loader from "@/app/components/loader";
import Map from "@/app/components/map";
import LogoPreview from "@/app/components/preview";
import FileUploader from "@/app/components/upload";
import { useOffice } from "@/app/context/officeContext";
import {
  MEINL_AE_URL,
  MEINL_AE_USA_URL,
  MEINL_OFFICE_COMPANY_HISTORY_KEY,
} from "@/app/lib/constants";
import { customerTypes } from "@/app/lib/data";
import { t } from "@/app/lib/i18n";
import { Company, CompanyInStorage } from "@/app/lib/interfaces";
import { getAvatarColor, parseUrl } from "@/app/lib/utils";
import {
  ActionIcon,
  Avatar,
  Badge,
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
  IconBasketPlus,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBuildingEstate,
  IconBuildings,
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
  IconUsersGroup,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DistributorTab from "../tabs/distributorTab";
import EmployeesTab from "../tabs/employeesTab";
import { getInitialValues, validateForm } from "./form";

export default function Page({
  params,
}: {
  params: Promise<{ kdnr: string }>;
}) {
  const { kdnr } = React.use(params);
  const { data: session } = useSession();
  const { source, locale } = useOffice();

  const [company, setCompany] = useState<Company>();
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
    if (!company) return;
    updateHistory();
    form.setValues(getInitialValues(company));
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

    const companies = await response.json();
    setCompany(companies[0]);
  };

  const updateHistory = () => {
    if (!company) return;

    const newEntry: CompanyInStorage = {
      kdnr: company.kdnr,
      kundenart: company.kundenart,
      name: company.name1,
      source,
    };

    const history: CompanyInStorage[] = JSON.parse(
      localStorage.getItem(MEINL_OFFICE_COMPANY_HISTORY_KEY) || "[]",
    );

    const filteredHistory = history.filter(
      (item) => item.kdnr !== newEntry.kdnr,
    );

    const updatedHistory = [newEntry, ...filteredHistory];
    localStorage.setItem(
      MEINL_OFFICE_COMPANY_HISTORY_KEY,
      JSON.stringify(updatedHistory),
    );
  };

  if (!company) return <Loader />;

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
        <Button
          variant="light"
          color="gray"
          leftSection={<IconChevronLeft size={16} />}
          component={Link}
          href="/company"
        >
          {t(locale, "allCompanies")}
        </Button>
        <Button.Group>
          <Contact email={company.mailadr} phone={company.telefon} />
          <Button
            component="a"
            href={`${source === "OFFGUT" ? MEINL_AE_URL : MEINL_AE_USA_URL}?kdnr=${company.kdnr}`}
            target="_blank"
            leftSection={<IconBasketPlus size={16} />}
          >
            {t(locale, "newOrder")}
          </Button>
        </Button.Group>
      </div>

      <header className="flex items-center gap-4 py-4">
        <Avatar
          size={72}
          variant="filled"
          color={getAvatarColor(company.kundenart)}
        >
          <IconBuildings size={40} stroke={2} />
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <h1>
            {company.name1}{" "}
            <span className="font-normal">
              {company.name2} {company.name3}
            </span>
          </h1>
          <p>
            <b>{company.kdnr}</b> – {company.kundenartText} ({company.kundenart}
            ) –{" "}
            {company.distributor ? "Distributor" : customerTypes[company.type]}
          </p>
        </div>
        {company.logo && company.logo !== "" && (
          <Image
            src={company.logo}
            width={72}
            height={72}
            alt={`${company.name1} Logo`}
            className="object-contain"
          />
        )}
      </header>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="info" leftSection={<IconBuildingEstate size={16} />}>
            {t(locale, "companyDetails")}
          </Tabs.Tab>
          <Tabs.Tab value="logo" leftSection={<IconPhoto size={16} />}>
            {t(locale, "companyLogo")}
          </Tabs.Tab>
          <Tabs.Tab
            value="storelocator"
            leftSection={<IconShoppingCartPin size={16} />}
            rightSection={
              company.dealerloc ? (
                <IconCircleCheck size={16} color="gray" />
              ) : (
                <IconCircleX size={16} color="gray" />
              )
            }
          >
            {t(locale, "dealerLocator")}
          </Tabs.Tab>
          {company.distributor && (
            <Tabs.Tab
              value="distributor"
              leftSection={<IconBuildingWarehouse size={16} />}
              rightSection={
                <Badge size="xs" color="gray">
                  {company.haendler.length}
                </Badge>
              }
            >
              {t(locale, "dealer")}
            </Tabs.Tab>
          )}
          <Tabs.Tab
            value="employees"
            leftSection={<IconUsersGroup size={16} />}
            rightSection={
              <Badge size="xs" color="gray">
                {company.personen.length}
              </Badge>
            }
          >
            {t(locale, "employees")}
          </Tabs.Tab>
          {/* <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Historie
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Einstellungen
          </Tabs.Tab> */}
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
                  label={t(locale, "fax")}
                  {...form.getInputProps("fax")}
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
                label={`${company.name1} ${t(locale, "showInDealerLocator")}.`}
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
                          href={parseUrl(company.www)}
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
                  label={`${company.name1} ${t(locale, "isExperienceCenter")}.`}
                  {...form.getInputProps("expCenter", { type: "checkbox" })}
                  disabled={!edit}
                />
              </Fieldset>
              {company.latitude !== null && company.longitude !== null && (
                <Map company={company} />
              )}
              <Fieldset>
                <h2>{t(locale, "brands")}</h2>
                <div className="flex flex-col gap-4">
                  {form.values.brands
                    .sort((a, b) => a.sort - b.sort)
                    .map((brand, index) => (
                      <TextInput
                        label={
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/brands/${brand.title
                                .replaceAll(" ", "-")
                                .toUpperCase()}.png`}
                              width={20}
                              height={20}
                              alt={`${brand.title} Logo`}
                              className="inverted opacity-70 object-contain"
                            />
                            <p>{brand.title}</p>
                          </div>
                        }
                        placeholder="Enter brand URL"
                        rightSection={
                          <div className="flex">
                            <ActionIcon
                              size="sm"
                              variant="transparent"
                              color="dark"
                              component="a"
                              href={parseUrl(brand.url || company.www)}
                              target="_blank"
                            >
                              <IconExternalLink size={16} />
                            </ActionIcon>
                          </div>
                        }
                        key={brand.title}
                        {...form.getInputProps(`brands.${index}.url`)}
                        readOnly={!edit}
                      />
                    ))}
                </div>
              </Fieldset>
              {source === "OFFGUT" && (
                <Fieldset>
                  <h2>Kampagnen</h2>
                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>{t(locale, "idLabel")}</Table.Th>
                        <Table.Th>{t(locale, "nameLabel")}</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {company.campagnen
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
              )}
            </div>
          </Tabs.Panel>
        </form>

        <Tabs.Panel value="logo" className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <LogoPreview company={company} onDelete={() => getCompany()} />
            <FileUploader company={company} onSuccess={() => getCompany()} />
          </div>
        </Tabs.Panel>

        <DistributorTab company={company} />
        <EmployeesTab company={company} />
      </Tabs>
    </main>
  );
}
