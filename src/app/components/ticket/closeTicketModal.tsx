"use client";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Ticket } from "@/app/lib/interfaces";
import { states } from "@/app/lib/rma";
import { Button, Modal, TextInput } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function CloseTicketModal({
  opened,
  onClose,
  ticket,
  id,
  onSuccess,
}: {
  opened: boolean;
  onClose: () => void;
  ticket: Ticket;
  id: string;
  onSuccess: (int: string, ext: string, art?: string) => void;
}) {
  const { locale } = useOffice();
  const { data: session } = useSession();
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleCloseTicket = async () => {
    const selectedState = states.find((s) => s.int === "790");
    if (!selectedState) return;

    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketnr: id,
        createdby: session?.user?.name || ticket.createdby,
        comment: `Manuell beendet: ${reason}`,
        source: "OF",
        public: 1,
        prio: 1,
      }),
    });

    onSuccess(selectedState.int, selectedState.ext, selectedState.art);
    handleClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
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
          <Button color="dark" variant="transparent" onClick={handleClose}>
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
  );
}
