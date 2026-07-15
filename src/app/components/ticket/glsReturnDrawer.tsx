"use client";
import { useOffice } from "@/app/context/officeContext";
import { normalizeAlpha2CountryCode } from "@/app/lib/countryCodes";
import { t } from "@/app/lib/i18n";
import { Person, Ticket } from "@/app/lib/interfaces";
import { sendResendMail } from "@/app/lib/resend";
import {
  ActionIcon,
  Button,
  Drawer,
  NumberInput,
  Paper,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarCheck,
  IconUserMinus,
  IconUserPlus,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EmailAutocomplete } from "./emailAutocomplete";
import { getReturnAddress, ReturnAddress } from "./returnAddress";

export function GlsReturnDrawer({
  opened,
  onClose,
  ticket,
  id,
  owner,
  onSuccess,
}: {
  opened: boolean;
  onClose: () => void;
  ticket: Ticket;
  id: string;
  owner: Person | null;
  onSuccess: () => void;
}) {
  const { locale } = useOffice();
  const { data: session } = useSession();

  const getInitialEmails = () => {
    const result = [owner?.email ?? ""];
    if (ticket.optemail && !result.includes(ticket.optemail)) {
      result.push(ticket.optemail);
    }
    return result;
  };

  const [emails, setEmails] = useState<string[]>(getInitialEmails());
  const [phone, setPhone] = useState(owner?.phone ?? "");
  const [quantity, setQuantity] = useState(1);
  const [pickupDateGls, setPickupDateGls] = useState<string | null>(null);

  useEffect(() => {
    setEmails(getInitialEmails());
    setPhone(owner?.phone ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, ticket.optemail]);

  const handleClose = () => {
    onClose();
    setQuantity(1);
  };

  const handleCreateGlsReturn = async () => {
    const address = getReturnAddress(ticket, owner);
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
        eMail: emails.find(Boolean) ?? "",
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
            email: emails.filter(Boolean).join(", "),
          };

          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          await sendResendMail({
            receiver: emails.filter(Boolean).join(","),
            subject: `Meinl RMA ${id} - GLS Pickup`,
            content: `Ihre GLS Abholung wurde erfolgreich angemeldet.\n\nSendungsnummer: ${shipmentNo}\nAbholdatum: ${pickupDateFormatted}\n\nBitte halten Sie das Paket zum vereinbarten Datum bereit.`,
          });

          onSuccess();
        } else {
          notifications.show({
            title: `Error ${uploadRes.status}`,
            message: await uploadRes.text(),
          });
        }
      } else {
        console.error("Failed to create GLS return:", await response.text());
      }
    } catch (error) {
      console.error("Error creating GLS return:", error);
    }
  };

  return (
    <Drawer
      size="xs"
      position="right"
      opened={opened}
      onClose={handleClose}
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
          <ReturnAddress ticket={ticket} owner={owner} />
        </Paper>
        <div className="flex flex-col gap-2">
          {emails.map((value, index) => (
            <EmailAutocomplete
              key={index}
              label={index === 0 ? t(locale, "email") : undefined}
              value={value}
              onChange={(v) =>
                setEmails(emails.map((e, i) => (i === index ? v : e)))
              }
              rightSection={
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() =>
                    setEmails(emails.filter((_, i) => i !== index))
                  }
                  disabled={emails.length === 1}
                >
                  <IconUserMinus size={16} />
                </ActionIcon>
              }
            />
          ))}
          <Button
            variant="transparent"
            leftSection={<IconUserPlus size={16} />}
            onClick={() => setEmails([...emails, ""])}
          >
            {t(locale, "addReceiver")}
          </Button>
        </div>
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
          <Button color="dark" variant="transparent" onClick={handleClose}>
            {t(locale, "cancel")}
          </Button>
          <Button
            onClick={() => {
              if (pickupDateGls) {
                handleClose();
                handleCreateGlsReturn();
              }
            }}
            leftSection={<IconCalendarCheck size={16} />}
            disabled={
              !pickupDateGls ||
              !emails.some(Boolean) ||
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
  );
}
