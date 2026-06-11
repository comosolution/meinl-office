"use client";
import Loader from "@/app/components/loader";
import { ProductSelect } from "@/app/components/productSelect";
import { useOffice } from "@/app/context/officeContext";
import { DATE_FORMAT } from "@/app/lib/config";
import {
  countryCodes,
  getReceiverIdForCountry,
  normalizeAlpha2CountryCode,
  normalizeAlpha3CountryCode,
} from "@/app/lib/countryCodes";
import { useFetchPerson } from "@/app/lib/hooks";
import { t } from "@/app/lib/i18n";
import { Person, Ticket } from "@/app/lib/interfaces";
import { trackTicket } from "@/app/lib/recentTickets";
import { sendResendMail } from "@/app/lib/resend";
import { states } from "@/app/lib/rma";
import { isPreview, parseDb2Date } from "@/app/lib/utils";
import FilesTab from "@/app/ticket/tabs/filesTab";
import HistoryTab from "@/app/ticket/tabs/historyTab";
import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Fieldset,
  Menu,
  Modal,
  NumberInput,
  Paper,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarCheck,
  IconCheck,
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
import dayjs from "dayjs";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSession } from "next-auth/react";
import Link from "next/link";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";
import TrackingTab from "../tabs/trackingTab";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const { locale, source } = useOffice();
  const fetchPerson = useFetchPerson();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [owner, setOwner] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newState, setNewState] = useState<string | null>(null);
  const [isMeiArtnr, setIsMeiArtnr] = useState(false);
  const [newArtnr, setNewArtnr] = useState("");
  const [pickupDateGls, setPickupDateGls] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

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
        console.error("Failed to fetch ticket");
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
    setPhone(person?.phone ?? "");
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
      console.error("Failed to update ticket status:", await res.text());
    }
  };

  const handleCreateDhlReturn = async () => {
    if (!ticket) return;

    const address = getReturnAddress();
    const { name, street, zip, city, country } = address;

    if (!street || !zip || !city || !country || !name) {
      notifications.show({
        title: "Fehlende Versandadresse",
        message: "Die Versandadresse des Tickets ist unvollständig.",
      });
      return;
    }

    const addressParts = street.trim().split(/\s+(?=\S*$)/);
    const addressStreet = addressParts[0] || street;
    const addressHouse = addressParts[1] || "1";

    const body = {
      receiverId: isPreview
        ? normalizeAlpha3CountryCode(country)?.toLowerCase() || "deu"
        : getReceiverIdForCountry(country) || "RetourenLager01",
      shipper: {
        name1: name,
        addressStreet: addressStreet,
        addressHouse: addressHouse,
        postalCode: zip,
        city: city,
      },
      customerReference: id,
    };

    const shipmentNumbers: string[] = [];

    for (let i = 0; i < quantity; i++) {
      try {
        const response = await fetch("/api/return/dhl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          console.error("Failed to create DHL return label");
          continue;
        }

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
          shipmentNumbers.push(shipmentNo);

          await sendResendMail({
            receiver: email,
            subject: `Meinl RMA ${id} - DHL Rücksendung`,
            content: `Ihre DHL Rücksendung wurde erfolgreich erstellt.\n\nSendungsnummer: ${shipmentNo}\n\nBitte beachten Sie das angehängte Rückgabeetikett.`,
            attachment: {
              filename: `DHL-Retoure-${shipmentNo}.pdf`,
              type: "application/pdf",
              data: pdfData,
            },
          });
        } else {
          console.error(
            "Failed to upload return label:",
            await uploadRes.text(),
          );
        }
      } catch (error) {
        console.error("Error creating DHL return label:", error);
      }
    }

    if (shipmentNumbers.length > 0) {
      notifications.show({
        title: "Retoure erstellt",
        message:
          shipmentNumbers.length === 1
            ? `Die DHL Retoure mit Sendungsnummer ${shipmentNumbers[0]} wurde erfolgreich erstellt.`
            : `${shipmentNumbers.length} DHL Retouren erstellt: ${shipmentNumbers.join(", ")}`,
        autoClose: 3000,
        color: "dark",
      });

      updateTicketStatus("110", "810");
    }
  };

  const handleCreateGlsReturn = async () => {
    if (!ticket) return;

    const address = getReturnAddress();
    const { name, street, zip, city, country } = address;

    if (!street || !zip || !city || !name) {
      notifications.show({
        title: "Fehlende Versandadresse",
        message: "Die Versandadresse des Tickets ist unvollständig.",
      });
      return;
    }

    const body = {
      ShipmentReference: [`${id}`],
      PickupDate: dayjs(pickupDateGls).format("YYYY-MM-DD"),
      Address: {
        Name1: name,
        CountryCode: normalizeAlpha2CountryCode(country) || "DE",
        ZIPCode: zip,
        City: city,
        Street: street,
        ContactPerson: ticket.kdnr_name,
        eMail: email,
        FixedLinePhonenumber: phone,
      },
      Quantity: quantity,
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
          const pickupDateFormatted = dayjs(pickupDateGls).format("DD.MM.YYYY");

          notifications.show({
            title: "Retoure erstellt",
            message: `GLS Pickup ${shipmentNo} am ${pickupDateFormatted} wurde erfolgreich beantragt.`,
            autoClose: 3000,
            color: "dark",
          });

          const payload = {
            ticketnr: id,
            createdby: session?.user?.name || ticket.createdby,
            comment: `Der GLS-Pickup-Termin für Ihre Rücksendung ist am ${pickupDateFormatted} (${shipmentNo})`,
            source: "OF",
            tracknr: shipmentNo,
            public: 1,
          };

          await fetch("/api/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          await sendResendMail({
            receiver: email,
            subject: `Meinl RMA ${id} - GLS Pickup`,
            content: `Ihre GLS Abholung wurde erfolgreich angemeldet.\n\nSendungsnummer: ${shipmentNo}\nAbholdatum: ${pickupDateFormatted}\n\nBitte halten Sie das Paket zum vereinbarten Datum bereit.`,
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

  const getReturnAddress = () => {
    const ticketAddress = {
      name: ticket?.versandadresse?.vaname ?? "",
      street: ticket?.versandadresse?.vastrasse ?? "",
      zip: ticket?.versandadresse?.vaplz ?? "",
      city: ticket?.versandadresse?.vaort ?? "",
      country: ticket?.versandadresse?.valand ?? "",
    };

    if (!owner) return ticketAddress;

    const ownerAddress = {
      name: owner.name1 ?? `${owner.vorname ?? ""} ${owner.nachname ?? ""}`,
      street: owner.strasse ?? owner.street ?? "",
      zip: owner.plz ?? owner.zip ?? owner.postalCode ?? "",
      city: owner.ort ?? owner.city ?? "",
      country: owner.land ?? owner.country ?? "",
    };

    const hasTicketAddress =
      !!ticketAddress.name ||
      !!ticketAddress.street ||
      !!ticketAddress.zip ||
      !!ticketAddress.city;
    return hasTicketAddress ? ticketAddress : ownerAddress;
  };

  const ReturnAddress = () => {
    const address = getReturnAddress();

    return (
      <>
        {address.name ? (
          <>
            {address.name}
            <br />
          </>
        ) : null}
        {address.street ? (
          <>
            {address.street}
            <br />
          </>
        ) : null}
        {address.zip || address.city || address.country ? (
          <>
            {address.zip} {address.city}
            {address.country
              ? `, ${normalizeAlpha2CountryCode(address.country)}`
              : ""}
          </>
        ) : null}
      </>
    );
  };

  const handleGenerateLaufzettel = async () => {
    if (!ticket) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Laufzettel", 16, 20);

    autoTable(doc, {
      body: [
        ["Ticket ID", id],
        ["Erstellt am", format(ticket.created, DATE_FORMAT)],
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

    doc.save(`Laufzettel_${id}.pdf`);
  };

  const handleCloseTicket = async () => {
    const selectedState = states.find((s) => s.int === "790");
    if (!selectedState) return;

    const payload = {
      ticketnr: id,
      createdby: session?.user?.name || ticket?.createdby,
      comment: `Manuell beendet: ${reason}`,
      source: "OF",
      public: 1,
      prio: 1,
    };

    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await updateTicketStatus(
      selectedState.int,
      selectedState.ext,
      selectedState.art,
    );
    setReason("");
    closeReason();
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
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col md:flex-row gap-2">
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
              color="dark"
              leftSection={<IconNews size={16} />}
              onClick={handleGenerateLaufzettel}
            >
              {t(locale, "downloadLaufzettel")}
            </Button>
          </div>
        </div>
        <header className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1>{id}</h1>
            <Badge size="lg" variant="light">
              {ticket.status_int.text} ({ticket.status_int.nr})
            </Badge>
          </div>
          <p>
            RMA {t(locale, "by")}{" "}
            <Link href={`/person/${ticket.kdnr_full}`} className="link">
              <b>{ticket.kdnr_name}</b>{" "}
              <span className="dimmed">({ticket.kdnr_full})</span>
            </Link>{" "}
            – {t(locale, "createdAt")} {format(ticket.created, DATE_FORMAT)}{" "}
            {t(locale, "by")} <b>{ticket.createdby}</b>
          </p>
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
                variant="transparent"
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
            <HistoryTab
              ticket={ticket}
              email={email}
              onCommentAdded={async () => {
                await getTicket();
              }}
            />
          </Paper>
          <div className="flex flex-col gap-4">
            <Paper p="md">
              <FilesTab
                ticketnr={id}
                createdby={session?.user?.name || ""}
                files={ticket.files || []}
                onFileUploaded={async () => {
                  await getTicket();
                }}
              />
            </Paper>
            <Paper p="md">
              <TrackingTab ticket={ticket} />
            </Paper>
          </div>
        </div>
      </main>
      <Drawer
        size="xs"
        position="right"
        opened={openedDhl}
        onClose={() => {
          closeDhl();
          setQuantity(1);
        }}
        withCloseButton={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="flex flex-col gap-2">
          <h2>{t(locale, "createReturn")}</h2>
          <Paper p="md" shadow="xl" bg="var(--background)">
            <ReturnAddress />
          </Paper>
          <TextInput
            label={t(locale, "email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <NumberInput
            label={t(locale, "quantity")}
            value={quantity}
            onChange={(v) => setQuantity(Number(v) || 1)}
            min={1}
            max={10}
          />
          <div className="flex justify-between gap-2">
            <Button
              color="dark"
              variant="transparent"
              onClick={() => {
                closeDhl();
                setQuantity(1);
              }}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={() => {
                closeDhl();
                handleCreateDhlReturn();
              }}
              leftSection={<IconCheck size={16} />}
              disabled={!email || quantity < 1 || quantity > 10}
            >
              {t(locale, "createReturn")}
            </Button>
          </div>
        </div>
      </Drawer>
      <Drawer
        size="xs"
        position="right"
        opened={openedGls}
        onClose={closeGls}
        withCloseButton={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="flex flex-col gap-2">
          <h2>{t(locale, "selectPickupDate")}</h2>
          <DatePicker
            locale={locale}
            value={pickupDateGls}
            onChange={setPickupDateGls}
            minDate={dayjs().add(1, "day").toDate()}
            excludeDate={(date) =>
              new Date(date).getDay() === 6 || new Date(date).getDay() === 0
            }
            className="place-self-center"
          />
          <Paper p="md" shadow="xl" bg="var(--background)">
            <ReturnAddress />
          </Paper>
          <TextInput
            label={t(locale, "email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label={t(locale, "phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <NumberInput
            label={t(locale, "quantity")}
            value={quantity}
            onChange={(v) => setQuantity(Number(v) || 1)}
            min={1}
            max={10}
          />
          <div className="flex justify-between gap-2">
            <Button
              color="dark"
              variant="transparent"
              onClick={() => {
                closeGls();
                setQuantity(1);
              }}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={() => {
                if (pickupDateGls) {
                  closeGls();
                  handleCreateGlsReturn();
                }
              }}
              leftSection={<IconCalendarCheck size={16} />}
              disabled={
                !pickupDateGls ||
                !email ||
                !phone ||
                quantity < 1 ||
                quantity > 10
              }
            >
              {t(locale, "confirmPickup")}
            </Button>
          </div>
        </div>
      </Drawer>
      <Modal
        opened={openedArtnr}
        onClose={() => {
          setNewArtnr("");
          closeArtnr();
        }}
        withCloseButton={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="flex flex-col gap-4">
          <h2>{t(locale, "setArticleNumber")}</h2>
          <ProductSelect
            label={t(locale, "articleNumberMei")}
            value={newArtnr}
            onChange={(value) => setNewArtnr(value || "")}
          />
          <div className="flex justify-between gap-2">
            <Button
              color="dark"
              variant="transparent"
              onClick={() => {
                setNewArtnr("");
                closeArtnr();
              }}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={() => {
                form.setFieldValue("artnr_mei", newArtnr);
                closeArtnr();
              }}
              leftSection={<IconCheck size={16} />}
              disabled={!newArtnr.trim()}
            >
              {t(locale, "setArticleNumber")}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={openedReason}
        onClose={() => {
          setNewState(null);
          setReason("");
          closeReason();
        }}
        withCloseButton={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="flex flex-col gap-4">
          <h2>{t(locale, "closeTicket")}</h2>
          <TextInput
            label={t(locale, "reason")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
          <div className="flex justify-between gap-2">
            <Button
              color="dark"
              variant="transparent"
              onClick={() => {
                setNewState(null);
                setReason("");
                closeReason();
              }}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={handleCloseTicket}
              leftSection={<IconCheck size={16} />}
              disabled={!reason.trim()}
            >
              {t(locale, "closeTicket")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
