"use client";
import Loader from "@/app/components/loader";
import { useOffice } from "@/app/context/officeContext";
import { LONG_DATE_FORMAT } from "@/app/lib/constants";
import { t } from "@/app/lib/i18n";
import { Person, Ticket } from "@/app/lib/interfaces";
import { states } from "@/app/lib/rma";
import { fetchResults, parseDb2Date } from "@/app/lib/utils";
import FilesTab from "@/app/ticket/tabs/filesTab";
import HistoryTab from "@/app/ticket/tabs/historyTab";
import {
  ActionIcon,
  Badge,
  Button,
  Menu,
  Modal,
  NumberInput,
  Paper,
  Select,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconEdit,
  IconError404,
  IconFiles,
  IconHistory,
  IconNews,
  IconTicket,
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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const { locale, source } = useOffice();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("info");
  const [newState, setNewState] = useState<string | null>(null);
  const [glsPickupDate, setGlsPickupDate] = useState<string | null>(
    new Date().toDateString(),
  );

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Partial<Ticket>>({
    initialValues: {
      artnr_mei: "",
      artnr_ku: "",
      sernr_mei: "",
      sernr_ku: "",
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
        };

        setTicket(transformed);
        form.setValues({
          kdnr: transformed.kdnr || "",
          kdnr_name: transformed.kdnr_name || "",
          artnr_mei: transformed.artnr_mei || "",
          artnr_ku: transformed.artnr_ku || "",
          sernr_mei: transformed.sernr_mei || "",
          sernr_ku: transformed.sernr_ku || "",
          descr: transformed.descr || "",
          menge: transformed.menge || 1,
          auftr_art: transformed.auftr_art || "",
          versandadresse: transformed.versandadresse || {
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
        console.error("Failed to fetch ticket");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
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
        descr: values.descr || ticket!.descr,
        menge: values.menge || ticket!.menge,
        auftr_art: values.auftr_art || ticket!.auftr_art,
        source: "OF",
        versandadresse: values.versandadresse || ticket!.versandadresse,
        files: null,
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
        console.error("Failed to update ticket:", await res.text());
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

  const updateTicketStatus = async (int: string, ext: string) => {
    const payload = {
      ...ticket,
      status_int: {
        nr: int,
      },
      status_ext: {
        nr: ext,
      },
    };

    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      getTicket();
    } else {
      console.error("Failed to update ticket status:", await res.text());
    }
  };

  const handleCreateDhlReturn = async () => {
    if (!ticket || !ticket.versandadresse) return;

    const { vastrasse, vaplz, vaort, vaname } = ticket.versandadresse;

    if (!vastrasse || !vaplz || !vaort || !vaname) {
      notifications.show({
        title: "Fehlende Versandadresse",
        message: "Die Versandadresse des Tickets ist unvollständig.",
      });
      return;
    }

    const addressParts = vastrasse.trim().split(/\s+(?=\S*$)/);
    const addressStreet = addressParts[0] || vastrasse;
    const addressHouse = addressParts[1] || "1";

    const body = {
      receiverId: "deu",
      shipper: {
        name1: vaname,
        addressStreet: addressStreet,
        addressHouse: addressHouse,
        postalCode: vaplz,
        city: vaort,
      },
      customerReference: id,
    };

    try {
      const response = await fetch("/api/return/dhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const pdfData = data.pdf;
        const shipmentNo = data.shipmentNo;

        const uploadBody = {
          ticketNr: id,
          status: ticket.status_int.nr,
          versender: "DHL",
          kdnr: ticket.kdnr,
          source: "OF",
          createdBy: session?.user?.name || ticket.createdby,
          sendungsNr: shipmentNo,
          labelBase64: pdfData,
        };

        const uploadRes = await fetch("/api/return", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadBody),
        });

        if (uploadRes.ok) {
          notifications.show({
            title: "Retoure erstellt",
            message: `Die DHL Retoure mit Sendungsnummer ${shipmentNo} wurde erfolgreich erstellt.`,
            autoClose: 3000,
            color: "dark",
          });

          updateTicketStatus("110", "810");
        } else {
          console.error(
            "Failed to upload return label:",
            await uploadRes.text(),
          );
        }
      } else {
        console.error("Failed to create DHL return label");
      }
    } catch (error) {
      console.error("Error creating DHL return label:", error);
    }
  };

  const handleCreateGlsReturn = async () => {
    if (!ticket || !ticket.versandadresse) return;

    const { valand, vastrasse, vaplz, vaort, vaname } = ticket.versandadresse;

    if (!vastrasse || !vaplz || !vaort || !vaname) {
      notifications.show({
        title: "Fehlende Versandadresse",
        message: "Die Versandadresse des Tickets ist unvollständig.",
      });
      return;
    }

    const persons = await fetchResults<Person>(
      source,
      "persons",
      ticket.kdnr_full,
    );
    const contact = persons.find((p) => p.b2bnr === ticket.kdnr_full);

    if (!contact) {
      notifications.show({
        title: "Kontakt nicht gefunden",
        message: `Der Kontakt mit der B2B-Nr ${ticket.kdnr_full} wurde nicht gefunden.`,
      });
      return;
    }

    if (!contact.email || !contact.phone) {
      notifications.show({
        title: "Fehlende Kontaktdaten",
        message: `Der Kontakt mit der B2B-Nr ${ticket.kdnr_full} ist unvollständig.`,
      });
      return;
    }

    const body = {
      ShipmentReference: [`${id}`],
      PickupDate: glsPickupDate!.split("T")[0],
      Address: {
        Name1: vaname,
        CountryCode: valand || "D",
        ZIPCode: vaplz,
        City: vaort,
        Street: vastrasse,
        ContactPerson: ticket.kdnr_name,
        eMail: contact.email,
        FixedLinePhonenumber: contact.phone,
      },
    };

    try {
      const response = await fetch("/api/return/gls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const shipmentNo = data.CreatedShipment.ParcelData[0].ParcelNumber;

        const uploadBody = {
          ticketNr: id,
          status: ticket.status_int.nr,
          versender: "GLS",
          kdnr: ticket.kdnr,
          source: "OF",
          createdBy: session?.user?.name || ticket.createdby,
          sendungsNr: shipmentNo,
          labelBase64: null,
        };

        const uploadRes = await fetch("/api/return", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadBody),
        });

        if (uploadRes.ok) {
          notifications.show({
            title: "Retoure erstellt",
            message: `Die GLS Retoure mit Sendungsnummer ${shipmentNo} wurde erfolgreich erstellt.`,
            autoClose: 3000,
            color: "dark",
          });

          updateTicketStatus("110", "810");
        } else {
          console.error(
            "Failed to upload return label:",
            await uploadRes.text(),
          );
        }
      } else {
        console.error("Failed to create GLS return:", await response.text());
      }
    } catch (error) {
      console.error("Error creating GLS return:", error);
    }
  };

  const handleDownload = () => {
    if (!ticket || !ticket.tracking) return;

    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${ticket.tracking.label}`;
    link.download = `Rücksendeetikett_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateLaufzettel = async () => {
    if (!ticket) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Laufzettel", 16, 20);

    autoTable(doc, {
      body: [
        ["Ticket ID", id],
        ["Erstellt am", format(ticket.created, LONG_DATE_FORMAT)],
        ["Kunde", `${ticket.kdnr_full} – ${ticket.kdnr_name}` || ""],
        ["Artikelnummer", ticket.artnr_mei || ticket.artnr_ku || ""],
        ["Seriennummer", ticket.sernr_mei || ticket.sernr_ku || ""],
        ["Fehlerbeschreibung", ticket.descr || ""],
        ["Menge", ticket.menge?.toString() || ""],
        ["Status", ticket.status_int?.text || ""],
      ],
      startY: 30,
      styles: { fontSize: 10 },
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

    doc.save(`laufzettel_${id}.pdf`);
  };

  useEffect(() => {
    if (!newState) return;

    const selectedState = states.find((s) => s.int === newState);

    if (selectedState) {
      updateTicketStatus(selectedState.int, selectedState.ext);
    } else {
      notifications.show({
        title: "Ungültiger Status",
        message: "Der ausgewählte Status ist ungültig.",
      });
    }
  }, [newState]);

  useEffect(() => {
    getTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <Loader />;
  }

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
          href="/ticket"
          leftSection={<IconChevronLeft size={16} />}
        >
          {t(locale, "showAllTickets")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-col gap-8 p-4">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Button
              variant="light"
              color="gray"
              component={Link}
              href="/ticket"
              leftSection={<IconChevronLeft size={16} />}
            >
              {t(locale, "allTickets")}
            </Button>
            <Button
              variant="transparent"
              color="gray"
              component={Link}
              href={`/company/${ticket.kdnr}`}
              leftSection={<IconChevronLeft size={16} />}
            >
              {t(locale, "customerX").replace("{kdnr}", ticket.kdnr)}
            </Button>
          </div>
          <div className="flex gap-1">
            {ticket.tracking ? (
              <Button
                leftSection={<IconTruckReturn size={16} />}
                onClick={handleDownload}
              >
                {t(locale, "downloadReturnLabel")}
              </Button>
            ) : (
              <Menu shadow="md" width={160} trigger="click-hover">
                <Menu.Target>
                  <Button
                    variant="light"
                    leftSection={<IconTruckReturn size={16} />}
                  >
                    {t(locale, "createReturn")}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={handleCreateDhlReturn}>DHL</Menu.Item>
                  <Menu.Item onClick={open}>GLS</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
            <Button
              variant="light"
              leftSection={<IconNews size={16} />}
              onClick={handleGenerateLaufzettel}
            >
              {t(locale, "downloadLaufzettel")}
            </Button>
          </div>
        </div>
        <header className="flex flex-col gap-1">
          <h1>{id}</h1>
          <div className="flex items-center gap-2">
            <p>
              {t(locale, "rmaFrom")}{" "}
              <Link href={`/company/${ticket.kdnr}`} className="link">
                <b>{ticket.kdnr_name}</b>{" "}
                <span className="dimmed">({ticket.kdnr_full})</span>
              </Link>{" "}
              {t(locale, "createdOn")}{" "}
              {format(ticket.created, LONG_DATE_FORMAT)}
            </p>
            <Badge variant="light">{ticket.status_int.text}</Badge>
          </div>
        </header>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="info" leftSection={<IconTicket size={16} />}>
              {t(locale, "tabDetails")}
            </Tabs.Tab>
            <Tabs.Tab
              value="files"
              leftSection={<IconFiles size={16} />}
              rightSection={
                <Badge size="xs" color="gray">
                  {ticket.files?.length || 0}
                </Badge>
              }
            >
              {t(locale, "tabFiles")}
            </Tabs.Tab>
            <Tabs.Tab
              value="history"
              leftSection={<IconHistory size={16} />}
              rightSection={
                <Badge size="xs" color="gray">
                  {ticket.history?.length || 0}
                </Badge>
              }
            >
              {t(locale, "tabHistory")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info" className="py-4">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Paper p="lg" radius="md" bg="transparent" withBorder>
                <div className="flex flex-col gap-2">
                  <h2>Status</h2>
                  <Select
                    placeholder={t(locale, "newStatus")}
                    value={newState}
                    onChange={setNewState}
                    data={[
                      ...states.map((s) => {
                        return { label: `${s.label} (${s.int})`, value: s.int };
                      }),
                    ]}
                    searchable
                    checkIconPosition="right"
                  />
                </div>
              </Paper>
              <div className="flex justify-end items-end">
                {!editing ? (
                  <Button
                    color="dark"
                    variant="transparent"
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setEditing(true)}
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
              <Paper p="lg" radius="md">
                <div className="flex flex-col gap-2">
                  <h2>{t(locale, "articleNumber")}</h2>
                  <div className="flex items-end">
                    <TextInput
                      label={t(locale, "articleNumberKu")}
                      {...form.getInputProps("artnr_ku")}
                      readOnly={!editing}
                      className="flex-1"
                    />
                    <ActionIcon
                      size="input-sm"
                      variant="subtle"
                      aria-label="Copy KU to MEI"
                      disabled={!editing}
                      onClick={() =>
                        form.setFieldValue("artnr_mei", form.values.artnr_ku)
                      }
                    >
                      <IconChevronRight size={18} />
                    </ActionIcon>
                    <TextInput
                      label={t(locale, "articleNumberMei")}
                      {...form.getInputProps("artnr_mei")}
                      readOnly={!editing}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <TextInput
                      label={t(locale, "serialNumberKu")}
                      {...form.getInputProps("sernr_ku")}
                      readOnly={!editing}
                      className="flex-1"
                    />
                    <ActionIcon
                      size="input-sm"
                      variant="subtle"
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
                  <Textarea
                    label={t(locale, "description")}
                    rows={4}
                    resize="vertical"
                    {...form.getInputProps("descr")}
                    readOnly={!editing}
                  />

                  <div className="flex items-end gap-2">
                    <NumberInput
                      label={t(locale, "quantity")}
                      min={1}
                      {...form.getInputProps("menge")}
                      readOnly={!editing}
                      className="flex-1"
                    />
                    <TextInput
                      label={t(locale, "orderType")}
                      {...form.getInputProps("auftr_art")}
                      readOnly={!editing}
                      className="flex-1"
                    />
                  </div>
                </div>
              </Paper>
              <Paper p="lg" radius="md">
                <div className="flex flex-col gap-2">
                  <h2>{t(locale, "shippingAddress")}</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput
                      label={t(locale, "name1")}
                      className="col-span-2"
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
                      className="col-span-2"
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
                    <TextInput
                      label={t(locale, "country")}
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
              </Paper>
            </form>
          </Tabs.Panel>
          <Tabs.Panel value="files" className="py-4">
            <FilesTab
              ticketnr={id}
              createdby={session?.user?.name || ""}
              files={ticket.files || []}
              onFileUploaded={async () => {
                await getTicket();
                setActiveTab("files");
              }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="history" className="py-4">
            {session?.user?.name && (
              <HistoryTab
                ticketnr={id}
                createdby={session.user.name}
                history={ticket.history}
                onCommentAdded={async () => {
                  await getTicket();
                  setActiveTab("history");
                }}
              />
            )}
          </Tabs.Panel>
        </Tabs>
      </main>
      <Modal
        size="xs"
        opened={opened}
        onClose={close}
        title={t(locale, "selectPickupDate")}
        radius="md"
      >
        <div className="flex flex-col justify-center items-center gap-4 pt-4">
          <DatePicker
            locale="de"
            value={glsPickupDate}
            onChange={setGlsPickupDate}
            minDate={new Date()}
            excludeDate={(date) =>
              new Date(date).getDay() === 6 || new Date(date).getDay() === 0
            }
          />
          <Button
            onClick={() => {
              if (glsPickupDate) {
                close();
                handleCreateGlsReturn();
              }
            }}
            leftSection={<IconCalendarCheck size={16} />}
            fullWidth
          >
            Abholtermin buchen
          </Button>
        </div>
      </Modal>
    </>
  );
}
