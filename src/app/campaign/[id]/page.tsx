"use client";
import DealerSelect from "@/app/components/dealerSelect";
import Loader from "@/app/components/loader";
import { useOffice } from "@/app/context/officeContext";
import { MEINL_DEALERS_URL } from "@/app/lib/constants";
import { brands } from "@/app/lib/data";
import { t } from "@/app/lib/i18n";
import { Campaign, Dealer, Product } from "@/app/lib/interfaces";
import {
  fetchResults,
  notEmptyValidation,
  safeLocaleCompare,
} from "@/app/lib/utils";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  CopyButton,
  Fieldset,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarEvent,
  IconCalendarWeek,
  IconCheck,
  IconChevronLeft,
  IconCopy,
  IconDeviceFloppy,
  IconEdit,
  IconExclamationCircle,
  IconExternalLink,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getInitialValues } from "./form";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { source, locale } = useOffice();

  const [campaign, setCampaign] = useState<Campaign>();
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [dealerSearch, setDealerSearch] = useState("");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealers, setSelectedDealers] = useState<Dealer[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<Campaign>({
    initialValues: getInitialValues({} as Campaign),
    validate: {
      title: (value) =>
        notEmptyValidation(value, t(locale, "pleaseEnterTitle")),
    },
    validateInputOnChange: true,
  });

  const dealerLocLink = `${MEINL_DEALERS_URL}?campaign=${
    campaign?.salt
  }&brand=${encodeURIComponent(form.values.brand.replaceAll(" ", "-"))}`;

  useEffect(() => {
    getCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!campaign) return;

    form.setValues(getInitialValues(campaign));
    setSelectedDealers(campaign.dealers || []);
    setSelectedProducts(campaign.products || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  const getCampaign = async () => {
    const response = await fetch("/api/campaign", {
      method: "POST",
      body: JSON.stringify({ source, salt: id }),
    });
    const data = await response.json();
    setCampaign(data[0]);
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/campaign/${source}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/campaign");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await fetchResults<Dealer>(source, "dealers", dealerSearch);
    setDealers(res.sort((a, b) => safeLocaleCompare(a.name1, b.name1)));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dealerSearch]);

  const selectDealer = (dealer: Dealer) => {
    const newSelected = [...selectedDealers, dealer];
    setSelectedDealers(newSelected);
    form.setFieldValue("dealers", newSelected);
    setDealerSearch("");
  };

  const isSameDealer = (a: Dealer, b: Dealer) =>
    a.id === b.id && String(a.kdnr) === String(b.kdnr);

  const removeCompany = (dealer: Dealer) => {
    const newSelected = selectedDealers.filter((s) => !isSameDealer(s, dealer));
    setSelectedDealers(newSelected);
    form.setFieldValue("dealers", newSelected);
  };

  const selectProduct = async () => {
    const response = await fetch("/api/campaign/product", {
      method: "POST",
      body: JSON.stringify({ artnr: productSearch, source }),
    });
    const data = await response.json();

    if (!response.ok) {
      notifications.show({
        id: `error-${productSearch}`,
        title: `${t(locale, "error")} ${response.status}`,
        message: data,
        autoClose: false,
      });
      return;
    }

    const newSelected = [...selectedProducts, data];
    setSelectedProducts(newSelected);
    form.setFieldValue("products", newSelected);
    setProductSearch("");
  };

  const removeProduct = (artnr: string) => {
    const newSelected = selectedProducts.filter((p) => p.artnr !== artnr);
    setSelectedProducts(newSelected);
    form.setFieldValue("products", newSelected);
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
          {t(locale, "allCampaigns")}
        </Button>
      </div>

      <header className="flex items-center gap-4 py-4">
        <Avatar size={72}>
          <Image
            src={
              campaign.brand
                ? `/brands/${campaign.brand
                    .replaceAll(" ", "-")
                    .toUpperCase()}.png`
                : "/logo_w.svg"
            }
            width={48}
            height={48}
            alt={`${campaign.brand} Logo`}
            className="inverted object-contain"
          />
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <h1>{campaign.title}</h1>
        </div>
      </header>

      <form
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            if (e.target.type !== "textarea") {
              e.preventDefault();
            }
          }
        }}
        onSubmit={form.onSubmit(async (values) => {
          const payload = {
            ...values,
            products: values.products?.map((p: Product) => p.artnr) || [],
            source,
          };

          const response = await fetch("/api/campaign/save", {
            method: "POST",
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            getCampaign();
            setEdit(false);
          }
        })}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2 flex justify-end gap-2">
          {edit ? (
            <Button.Group>
              <Button
                type="submit"
                color="dark"
                leftSection={<IconDeviceFloppy size={16} />}
                disabled={!form.isValid()}
              >
                {t(locale, "saveChanges")}
              </Button>
              <Button
                color="dark"
                variant="transparent"
                onClick={async () => {
                  await getCampaign();
                  setEdit(false);
                }}
              >
                {t(locale, "discard")}
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
          {del ? (
            <Button.Group>
              <Button
                onClick={handleDelete}
                leftSection={<IconTrash size={16} />}
              >
                {t(locale, "deleteConfirm")}
              </Button>
              <Button
                variant="transparent"
                onClick={() => {
                  setDel(false);
                }}
              >
                {t(locale, "cancel")}
              </Button>
            </Button.Group>
          ) : (
            <Button
              variant="transparent"
              leftSection={<IconTrash size={16} />}
              onClick={() => {
                setDel(true);
              }}
            >
              {t(locale, "delete")}
            </Button>
          )}
        </div>

        <div className="col-span-2 flex gap-2">
          <TextInput
            className="w-full"
            value={dealerLocLink}
            readOnly
            rightSection={
              <ActionIcon
                variant="transparent"
                color="dark"
                component="a"
                href={dealerLocLink}
                target="_blank"
                aria-label={t(locale, "openLink")}
              >
                <IconExternalLink size={16} />
              </ActionIcon>
            }
          />
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
                  {copied ? t(locale, "linkCopied") : t(locale, "copyLink")}
                </Button>
              )}
            </CopyButton>
          </Button.Group>
        </div>
        <Fieldset radius="md" className="col-span-2">
          <h2>{t(locale, "details")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t(locale, "brand")}
              data={brands}
              allowDeselect={false}
              checkIconPosition="right"
              withAsterisk
              {...form.getInputProps("brand")}
              readOnly={!edit}
              aria-readonly={!edit}
            />
            <TextInput
              label={t(locale, "title")}
              withAsterisk
              {...form.getInputProps("title")}
              readOnly={!edit}
            />
          </div>
          <Textarea
            label={t(locale, "description")}
            {...form.getInputProps("description")}
            readOnly={!edit}
            rows={3}
            resize="vertical"
          />
          <div className="grid grid-cols-2 gap-4">
            <DateTimePicker
              label={t(locale, "start")}
              valueFormat="DD.MM.YYYY HH:mm"
              rightSection={<IconCalendarEvent size={20} />}
              rightSectionPointerEvents="none"
              {...form.getInputProps("start")}
              readOnly={!edit}
              aria-readonly={!edit}
            />
            <DateTimePicker
              label={t(locale, "end")}
              valueFormat="DD.MM.YYYY HH:mm"
              rightSection={<IconCalendarWeek size={20} />}
              rightSectionPointerEvents="none"
              {...form.getInputProps("end")}
              readOnly={!edit}
              aria-readonly={!edit}
            />
          </div>
        </Fieldset>
        <Fieldset radius="md" mih={400}>
          <h2>{t(locale, "participatingDealers")}</h2>
          <div className="flex flex-col gap-2">
            <DealerSelect
              value={selectedDealers}
              onChange={(dealers) => {
                setSelectedDealers(dealers);
                form.setFieldValue("dealers", dealers);
              }}
              disabled={!edit}
            />

            {selectedDealers.length > 0 &&
              selectedDealers
                .sort((a, b) =>
                  String(a.kdnr).localeCompare(String(b.kdnr), "de", {
                    sensitivity: "base",
                  }),
                )
                .map((d, i) => {
                  const dealer = dealers.find(
                    (c) => c.id === d.id && String(c.kdnr) === String(d.kdnr),
                  );
                  if (!dealer) return;
                  return (
                    <Card
                      key={i}
                      component={Link}
                      href={`/company/${d.kdnr}${d.id === 0 ? "" : `/${d.id}`}`}
                      shadow="sm"
                      p="md"
                      bg="var(--background)"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3>{dealer.name1}</h3>
                          <p className="text-xs dimmed">
                            <b>{dealer.kdnr}</b>
                            {dealer.id !== 0 &&
                              ` – ${dealer.id} – ${dealer.brand}`}{" "}
                            – {dealer.plz} {dealer.ort} {dealer.land}
                          </p>
                        </div>
                        <ActionIcon.Group>
                          {!dealer.dealerloc && (
                            <Tooltip
                              label={`${dealer.name1} ${t(locale, "notActivatedForDealerLocator")}`}
                              position="left"
                              withArrow
                            >
                              <ActionIcon variant="transparent">
                                <IconExclamationCircle size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          <ActionIcon
                            color="red"
                            onClick={(e) => {
                              e.preventDefault();
                              removeCompany(dealer);
                            }}
                            disabled={!edit}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </ActionIcon.Group>
                      </div>
                    </Card>
                  );
                })}
          </div>
        </Fieldset>
        <Fieldset radius="md">
          <h2>{t(locale, "offeredProducts")}</h2>
          <div className="flex flex-col gap-2">
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  selectProduct();
                }
              }}
              className="flex gap-2"
            >
              <TextInput
                placeholder={t(locale, "searchByArticleNumber")}
                value={productSearch}
                onChange={(e) => setProductSearch(e.currentTarget.value)}
                readOnly={!edit}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="light"
                color="dark"
                leftSection={<IconSearch size={16} />}
                disabled={productSearch.length < 1 || !edit}
                onClick={selectProduct}
              >
                {t(locale, "search")}
              </Button>
            </div>
            {selectedProducts.length > 0 &&
              selectedProducts.map((product) => {
                return (
                  <Card
                    key={product.artnr}
                    shadow="sm"
                    p="md"
                    bg="var(--background)"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3>{product.artbez}</h3>
                        <p className="text-xs dimmed">{product.artnr}</p>
                      </div>
                      <ActionIcon
                        color="red"
                        onClick={(e) => {
                          e.preventDefault();
                          removeProduct(product.artnr);
                        }}
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
