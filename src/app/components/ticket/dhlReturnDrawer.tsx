"use client";
import { useOffice } from "@/app/context/officeContext";
import {
  getReceiverIdForCountry,
  normalizeAlpha3CountryCode,
} from "@/app/lib/countryCodes";
import { t } from "@/app/lib/i18n";
import { Person, Ticket } from "@/app/lib/interfaces";
import { sendResendMail } from "@/app/lib/resend";
import { isPreview } from "@/app/lib/utils";
import { ActionIcon, Button, Drawer, NumberInput, Paper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EmailAutocomplete } from "./emailAutocomplete";
import { getReturnAddress, ReturnAddress } from "./returnAddress";

export function DhlReturnDrawer({
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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setEmails(getInitialEmails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, ticket.optemail]);

  const handleClose = () => {
    onClose();
    setQuantity(1);
  };

  const handleCreateDhlReturn = async () => {
    const address = getReturnAddress(ticket, owner);
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
        addressStreet,
        addressHouse,
        postalCode: zip,
        city,
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
            receiver: emails.filter(Boolean).join(","),
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

      onSuccess();
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
        <h2>{t(locale, "createReturn")}</h2>
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
              handleClose();
              handleCreateDhlReturn();
            }}
            leftSection={<IconCheck size={16} />}
            disabled={!emails.some(Boolean) || quantity < 1 || quantity > 10}
          >
            {t(locale, "createReturn")}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
