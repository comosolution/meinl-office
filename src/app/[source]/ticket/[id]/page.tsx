"use client";
import Loader from "@/app/components/loader";
import SourceRequired from "@/app/components/sourceRequired";
import FilesUpload from "@/app/components/ticket/filesUpload";
import TicketHistory from "@/app/components/ticket/ticketHistory";
import { useOffice } from "@/app/context/officeContext";
import { DATE_FORMAT } from "@/app/lib/config";
import {
  countryCodes,
  normalizeAlpha2CountryCode,
} from "@/app/lib/countryCodes";
import { useFetchPerson } from "@/app/lib/hooks";
import { t } from "@/app/lib/i18n";
import { Person, Ticket } from "@/app/lib/interfaces";
import { trackTicket } from "@/app/lib/recentTickets";
import { states } from "@/app/lib/rma";
import { getErrorMessage, parseDb2Date } from "@/app/lib/utils";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Fieldset,
  Menu,
  NumberInput,
  Paper,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconEdit,
  IconError404,
  IconExclamationCircle,
  IconNews,
  IconSearch,
  IconTruckReturn,
} from "@tabler/icons-react";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSession } from "next-auth/react";
import Link from "next/link";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";
import { CloseTicketModal } from "../../../components/ticket/closeTicketModal";
import { DhlReturnDrawer } from "../../../components/ticket/dhlReturnDrawer";
import { GlsReturnDrawer } from "../../../components/ticket/glsReturnDrawer";
import { SetArtnrModal } from "../../../components/ticket/setArtnrModal";
import Tracking from "../../../components/ticket/tracking";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const { locale, source, sourcePrefix } = useOffice();
  const fetchPerson = useFetchPerson();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [owner, setOwner] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newState, setNewState] = useState<string | null>(null);
  const [isMeiArtnr, setIsMeiArtnr] = useState(false);
  const [email, setEmail] = useState("");

  const [openedDhl, { open: openDhl, close: closeDhl }] = useDisclosure(false);
  const [openedGls, { open: openGls, close: closeGls }] = useDisclosure(false);
  const [openedArtnr, { open: openArtnr, close: closeArtnr }] =
    useDisclosure(false);
  const [openedReason, { open: openReason, close: closeReason }] =
    useDisclosure(false);

  const form = useForm<Partial<Ticket>>({
    initialValues: {
      artnr_mei: "",
      artnr_ku: "",
      sernr_mei: "",
      sernr_ku: "",
      nr_kunde: "",
      descr: "",
      menge: 1,
      auftr_art: "",
      versandadresse: {
        vanr: "",
        vaname: "",
        vaname2: "",
        vaname3: "",
        vastrasse: "",
        vaplz: "",
        vaort: "",
        valand: "",
        zusatz: "",
      },
    },
  });

  const getTicket = async () => {
    try {
      const response = await fetch(`/api/ticket/${id}`);
      if (response.ok) {
        const data: Ticket = await response.json();
        const transformed = {
          ...data,
          created: parseDb2Date(data.created),
          modified: parseDb2Date(data.modified),
          versandadresse: {
            vanr: data.versandadresse?.vanr ?? "",
            vaname: data.versandadresse?.vaname ?? "",
            vaname2: data.versandadresse?.vaname2 ?? "",
            vaname3: data.versandadresse?.vaname3 ?? "",
            vastrasse: data.versandadresse?.vastrasse ?? "",
            vaplz: data.versandadresse?.vaplz ?? "",
            vaort: data.versandadresse?.vaort ?? "",
            valand:
              normalizeAlpha2CountryCode(data.versandadresse?.valand) ??
              data.versandadresse?.valand ??
              "",
            zusatz: data.versandadresse?.zusatz ?? "",
          },
        };

        setTicket(transformed);
        form.setValues({
          kdnr: transformed.kdnr || "",
          kdnr_name: transformed.kdnr_name || "",
          artnr_mei: transformed.artnr_mei || "",
          artnr_ku: transformed.artnr_ku || "",
          sernr_mei: transformed.sernr_mei || "",
          sernr_ku: transformed.sernr_ku || "",
          nr_kunde: transformed.nr_kunde || "",
          descr: transformed.descr || "",
          menge: transformed.menge || 1,
          auftr_art: transformed.auftr_art || "",
          versandadresse: transformed.versandadresse
            ? {
                vanr: transformed.versandadresse.vanr || "",
                vaname: transformed.versandadresse.vaname || "",
                vaname2: transformed.versandadresse.vaname2 || "",
                vaname3: transformed.versandadresse.vaname3 || "",
                vastrasse: transformed.versandadresse.vastrasse || "",
                vaplz: transformed.versandadresse.vaplz || "",
                vaort: transformed.versandadresse.vaort || "",
                valand: transformed.versandadresse.valand || "",
                zusatz: transformed.versandadresse.zusatz || "",
              }
            : {
                vanr: "",
                vaname: "",
                vaname2: "",
                vaname3: "",
                vastrasse: "",
                vaplz: "",
                vaort: "",
                valand: "",
                zusatz: "",
              },
        });
      } else {
        notifications.show({
          title: `Error ${response.status}`,
          message: getErrorMessage(await response.text()),
        });
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOwner = async () => {
    if (!ticket) return;

    const person = await fetchPerson(ticket.kdnr_full);

    setOwner(person ?? null);
    setEmail(person?.email ?? "");
  };

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        ...ticket,
        nr: id,
        kdnr: ticket!.kdnr,
        kdnr_full: ticket!.kdnr_full,
        updatedby: session?.user?.name || ticket!.updatedby,
        createdby: ticket!.createdby,
        artnr_ku: values.artnr_ku || ticket!.artnr_ku,
        artnr_mei: values.artnr_mei || ticket!.artnr_mei,
        sernr_ku: values.sernr_ku || ticket!.sernr_ku,
        sernr_mei: values.sernr_mei || ticket!.sernr_mei,
        nr_kunde: values.nr_kunde || ticket!.nr_kunde,
        descr: values.descr || ticket!.descr,
        menge: values.menge || ticket!.menge,
        auftr_art: values.auftr_art || ticket!.auftr_art,
        source: "OF",
        versandadresse: values.versandadresse || ticket!.versandadresse,
        files: null,
        user: session?.user?.name,
      };

      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("Ticket updated successfully");
        getTicket();
        setEditing(false);
      } else {
        notifications.show({
          title: `Error ${res.status}`,
          message: getErrorMessage(await res.text()),
        });
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  });

  const handleCancel = () => {
    if (ticket) {
      form.setValues({
        artnr_mei: ticket.artnr_mei || "",
        artnr_ku: ticket.artnr_ku || "",
        sernr_mei: ticket.sernr_mei || "",
        sernr_ku: ticket.sernr_ku || "",
        nr_kunde: ticket.nr_kunde || "",
        descr: ticket.descr || "",
        menge: ticket.menge || 1,
        auftr_art: ticket.auftr_art || "",
        versandadresse: ticket.versandadresse || {
          vanr: "",
          vaname: "",
          vaname2: "",
          vaname3: "",
          vastrasse: "",
          vaplz: "",
          vaort: "",
          valand: "",
          zusatz: "",
        },
      });
    }
    setEditing(false);
  };

  const updateTicketStatus = async (int: string, ext: string, art?: string) => {
    if (!ticket) return;

    const payload = {
      ...ticket,
      status_int: {
        nr: int,
      },
      status_ext: {
        nr: ext,
      },
      auftr_art: art ?? ticket?.auftr_art ?? "",
      files: null,
      user: session?.user?.name,
    };

    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      if (Number(int) > 110 && Number(int) < 790) {
        const statusLabel = states.find((s) => s.int === int)?.label;

        const payload = {
          ticketnr: id,
          createdby: session?.user?.name || ticket.createdby,
          comment: `Status geändert auf ${statusLabel} (${int})`,
          source: "OF",
          tracknr: "",
          public: 1,
        };

        await fetch("/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      getTicket();
    } else {
      notifications.show({
        title: `Error ${res.status}`,
        message: getErrorMessage(await res.text()),
      });
    }
  };

  const handleGenerateLaufzettel = async () => {
    if (!ticket) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Laufzettel", 16, 20);

    const artnr = ticket.artnr_mei || ticket.artnr_ku || "";
    const sernr = ticket.sernr_mei || ticket.sernr_ku || "";

    let artnrBarcodeData = "";
    let sernrBarcodeData = "";

    if (artnr) {
      const c = document.createElement("canvas");
      JsBarcode(c, artnr, {
        format: "CODE128",
        width: 1.5,
        height: 30,
        displayValue: true,
      });
      artnrBarcodeData = c.toDataURL("image/png");
    }

    if (sernr) {
      const c = document.createElement("canvas");
      JsBarcode(c, sernr, {
        format: "CODE128",
        width: 1.5,
        height: 30,
        displayValue: true,
      });
      sernrBarcodeData = c.toDataURL("image/png");
    }

    autoTable(doc, {
      body: [
        ["Ticket ID", id, ""],
        ["Erstellt am", format(ticket.created, DATE_FORMAT), ""],
        [
          "Kunde",
          `${ticket.kdnr_full} – ${ticket.firma} (${ticket.kdnr_name})` || "",
          "",
        ],
        [
          "Artikelnummer",
          artnr,
          { content: "", styles: { minCellHeight: 22 } },
        ],
        ["Seriennummer", sernr, { content: "", styles: { minCellHeight: 22 } }],
        ["Fehlerbeschreibung", ticket.descr || "", ""],
        ["Menge", ticket.menge?.toString() || "", ""],
        ["Status", ticket.status_int?.text || "", ""],
      ],
      startY: 30,
      styles: { fontSize: 10 },
      columnStyles: { 2: { cellWidth: 60 } },
      didDrawCell: (data) => {
        if (data.column.index !== 2) return;
        if (data.row.index === 3 && artnrBarcodeData) {
          doc.addImage(
            artnrBarcodeData,
            "PNG",
            data.cell.x + 2,
            data.cell.y + 2,
            56,
            18,
          );
        } else if (data.row.index === 4 && sernrBarcodeData) {
          doc.addImage(
            sernrBarcodeData,
            "PNG",
            data.cell.x + 2,
            data.cell.y + 2,
            56,
            18,
          );
        }
      },
    });

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, id, {
      format: "CODE128",
      width: 2,
      height: 40,
      displayValue: true,
    });

    const imgData = canvas.toDataURL("image/png");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.addImage(imgData, "PNG", 20, finalY + 20, 100, 40);

    const url = `${window.location.origin}/ticket/${id}`;
    const qrDataURL = await QRCode.toDataURL(url);
    doc.addImage(qrDataURL, "PNG", 130, finalY + 20, 50, 50);

    doc.save(`Laufzettel_${id}.pdf`);
  };

  useEffect(() => {
    if (!newState) return;

    if (newState === "790") {
      openReason();
      return;
    }

    const selectedState = states.find((s) => s.int === newState);

    if (selectedState) {
      updateTicketStatus(
        selectedState.int,
        selectedState.ext,
        selectedState.art,
      );
    } else {
      notifications.show({
        title: "Ungültiger Status",
        message: "Der ausgewählte Status ist ungültig.",
      });
    }
  }, [newState]);

  const verifyArtnr = async () => {
    const res = await fetch("/api/product/verify", {
      method: "POST",
      body: JSON.stringify({
        artnr: ticket?.artnr_ku,
        source,
        user: session?.user?.name,
      }),
    });

    if (!res.ok) {
      console.error("Failed to verify article number:", await res.text());
      return;
    }

    const result = await res.json();
    setIsMeiArtnr(result.verified);
  };

  useEffect(() => {
    trackTicket(id);
    if (!ticket) {
      getTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!owner) {
      getOwner();
    }
    if (ticket) {
      verifyArtnr();
    }
  }, [ticket]);

  if (loading) return <Loader />;

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <IconError404 size={64} />
        <p className="dimmed pb-2">
          {t(locale, "ticketNotFound").replace("{id}", id)}
        </p>
        <Button
          variant="light"
          component={Link}
          href={`/${sourcePrefix}/ticket`}
          leftSection={<IconChevronLeft size={16} />}
        >
          {t(locale, "showAllTickets")}
        </Button>
      </div>
    );
  }

  if (source === "OFFUSA") return <SourceRequired requiredSource="OFFGUT" />;

  return (
    <>
      <main className="flex flex-col gap-8 p-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="light"
              color="gray"
              component={Link}
              href={`/${sourcePrefix}/ticket`}
              leftSection={<IconChevronLeft size={16} />}
            >
              {t(locale, "allTickets")}
            </Button>
            <Button
              variant="transparent"
              color="gray"
              component={Link}
              href={`/${sourcePrefix}/company/${ticket.kdnr}`}
              leftSection={<IconChevronLeft size={16} />}
            >
              {ticket.firma}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Menu shadow="md" width={160} trigger="click-hover">
              <Menu.Target>
                <Button
                  color="yellow"
                  variant="light"
                  leftSection={<IconTruckReturn size={16} />}
                >
                  {t(locale, "createReturn")}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {[
                  { id: "DHL", action: openDhl },
                  { id: "GLS", action: openGls },
                ].map((option) => (
                  <Menu.Item
                    key={option.id}
                    onClick={option.action}
                    rightSection={
                      <p className="text-xs dimmed">
                        {ticket.trackingHistory?.find(
                          (h) => h.versender?.trim() === option.id,
                        )?.anzahl || 0}
                      </p>
                    }
                  >
                    {option.id}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Button
              color="gray"
              variant="light"
              leftSection={<IconNews size={16} />}
              onClick={handleGenerateLaufzettel}
            >
              {t(locale, "downloadLaufzettel")}
            </Button>
          </div>
        </div>
        <header className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1>{id}</h1>
              <Badge size="lg" variant="light" color="blue">
                {ticket.status_int.text} ({ticket.status_int.nr})
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1 text-sm">
              <p className="text-sm">
                {t(locale, "createdOn")} {format(ticket.created, DATE_FORMAT)}{" "}
                {t(locale, "by")}
              </p>{" "}
              <Avatar size="sm" color="yellow" name={ticket.createdby ?? ""} />
              <p>
                <b>{ticket.createdby}</b>
              </p>
            </div>
          </div>
          <Link
            href={`/${sourcePrefix}/person/${ticket.kdnr_full}`}
            className="flex flex-row-reverse lg:flex-row justify-end items-center gap-2 hover:text-(--main) transition-all"
          >
            <div className="flex flex-col lg:items-end">
              <h2>
                {ticket.kdnr_name}{" "}
                <span className="font-medium">({ticket.kdnr_full})</span>
              </h2>
              <div className="flex gap-1 text-sm">
                <p>
                  {ticket.firma} / {owner?.email}
                </p>
              </div>
            </div>
            <Avatar
              color="red"
              variant="filled"
              size={48}
              name={ticket.kdnr_name ?? ""}
            />
          </Link>
        </header>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Select
            placeholder={t(locale, "newStatus")}
            value={newState}
            onChange={setNewState}
            data={[
              ...states.map((s) => {
                return {
                  label: `${s.label} (${s.int})`,
                  value: s.int,
                  disabled:
                    (!ticket.artnr_mei &&
                      Number(s.int) > 500 &&
                      Number(s.int) < 790) ||
                    (Number(ticket.status_int.nr) > 500 && s.int !== "790"),
                };
              }),
            ]}
            disabled={Number(ticket.status_int.nr) === 790 || editing}
            searchable
            checkIconPosition="right"
          />
          <div className="flex justify-end items-end">
            {!editing ? (
              <Button
                color="dark"
                leftSection={<IconEdit size={16} />}
                onClick={() => setEditing(true)}
                disabled={Number(ticket.status_int.nr) > 500}
              >
                {t(locale, "editTicket")}
              </Button>
            ) : (
              <>
                <Button
                  color="dark"
                  variant="transparent"
                  onClick={handleCancel}
                >
                  {t(locale, "cancel")}
                </Button>
                <Button
                  type="submit"
                  color="dark"
                  leftSection={<IconDeviceFloppy size={16} />}
                >
                  {t(locale, "save")}
                </Button>
              </>
            )}
          </div>
          <Fieldset>
            <div className="flex flex-col gap-2">
              <h2>{t(locale, "details")}</h2>
              <div className="flex items-end gap-1">
                <TextInput
                  label={t(locale, "articleNumberKu")}
                  {...form.getInputProps("artnr_ku")}
                  readOnly
                  className="flex-1"
                />
                <ActionIcon
                  size="input-sm"
                  variant="light"
                  aria-label="Copy KU to MEI"
                  disabled={!editing}
                  onClick={() =>
                    isMeiArtnr
                      ? form.setFieldValue("artnr_mei", form.values.artnr_ku)
                      : openArtnr()
                  }
                >
                  {isMeiArtnr ? (
                    <IconChevronRight size={18} />
                  ) : (
                    <IconExclamationCircle size={16} />
                  )}
                </ActionIcon>
                <TextInput
                  label={t(locale, "articleNumberMei")}
                  {...form.getInputProps("artnr_mei")}
                  readOnly
                  className="flex-1"
                  rightSection={
                    <ActionIcon
                      color="dark"
                      variant="transparent"
                      disabled={!editing}
                      onClick={openArtnr}
                    >
                      <IconSearch size={16} />
                    </ActionIcon>
                  }
                />
              </div>
              <div className="flex items-end gap-1">
                <TextInput
                  label={t(locale, "serialNumberKu")}
                  {...form.getInputProps("sernr_ku")}
                  readOnly
                  className="flex-1"
                />
                <ActionIcon
                  size="input-sm"
                  variant="light"
                  aria-label="Copy KU to MEI"
                  disabled={!editing}
                  onClick={() =>
                    form.setFieldValue("sernr_mei", form.values.sernr_ku)
                  }
                >
                  <IconChevronRight size={18} />
                </ActionIcon>
                <TextInput
                  label={t(locale, "serialNumberMei")}
                  {...form.getInputProps("sernr_mei")}
                  readOnly={!editing}
                  className="flex-1"
                />
              </div>
              <TextInput
                label={t(locale, "customerReferenceNumber")}
                {...form.getInputProps("nr_kunde")}
                readOnly={!editing}
              />
              <Textarea
                label={t(locale, "description")}
                rows={4}
                resize="vertical"
                {...form.getInputProps("descr")}
                readOnly={!editing}
              />
              <NumberInput
                label={t(locale, "quantity")}
                min={1}
                {...form.getInputProps("menge")}
                readOnly={!editing}
                className="flex-1"
              />
            </div>
          </Fieldset>
          <Fieldset>
            <div className="flex flex-col gap-2">
              <h2>{t(locale, "shippingAddress")}</h2>
              <div className="grid md:grid-cols-2 gap-2">
                <TextInput
                  label={t(locale, "name1")}
                  className="md:col-span-2"
                  {...form.getInputProps("versandadresse.vaname")}
                  readOnly={!editing}
                />
                <TextInput
                  label={t(locale, "name2")}
                  {...form.getInputProps("versandadresse.vaname2")}
                  readOnly={!editing}
                />
                <TextInput
                  label={t(locale, "name3")}
                  {...form.getInputProps("versandadresse.vaname3")}
                  readOnly={!editing}
                />
                <TextInput
                  label={t(locale, "streetAndNumber")}
                  className="md:col-span-2"
                  {...form.getInputProps("versandadresse.vastrasse")}
                  readOnly={!editing}
                />
                <TextInput
                  label={t(locale, "zip")}
                  {...form.getInputProps("versandadresse.vaplz")}
                  readOnly={!editing}
                />
                <TextInput
                  label={t(locale, "city")}
                  {...form.getInputProps("versandadresse.vaort")}
                  readOnly={!editing}
                />
                <Select
                  label={t(locale, "country")}
                  data={countryCodes(locale)}
                  searchable
                  checkIconPosition="right"
                  {...form.getInputProps("versandadresse.valand")}
                  readOnly={!editing}
                />
                <TextInput
                  label={t(locale, "additionalShipping")}
                  {...form.getInputProps("versandadresse.zusatz")}
                  readOnly={!editing}
                />
              </div>
            </div>
          </Fieldset>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-4">
          <Paper p="md">
            <TicketHistory
              ticket={ticket}
              email={email}
              onCommentAdded={async () => {
                await getTicket();
              }}
            />
          </Paper>
          <div className="flex flex-col gap-4">
            <Paper p="md">
              <FilesUpload
                ticketnr={id}
                createdby={session?.user?.name || ""}
                files={ticket.files || []}
                onFileUploaded={async () => {
                  await getTicket();
                }}
              />
            </Paper>
            <Paper p="md">
              <Tracking ticket={ticket} />
            </Paper>
          </div>
        </div>
      </main>
      <DhlReturnDrawer
        opened={openedDhl}
        onClose={closeDhl}
        ticket={ticket}
        id={id}
        owner={owner}
        onSuccess={() => updateTicketStatus("110", "810")}
      />
      <GlsReturnDrawer
        opened={openedGls}
        onClose={closeGls}
        ticket={ticket}
        id={id}
        owner={owner}
        onSuccess={() => updateTicketStatus("110", "810")}
      />
      <SetArtnrModal
        opened={openedArtnr}
        onClose={closeArtnr}
        onConfirm={(artnr) => form.setFieldValue("artnr_mei", artnr)}
      />
      <CloseTicketModal
        opened={openedReason}
        onClose={() => {
          setNewState(null);
          closeReason();
        }}
        ticket={ticket}
        id={id}
        onSuccess={updateTicketStatus}
      />
    </>
  );
}
