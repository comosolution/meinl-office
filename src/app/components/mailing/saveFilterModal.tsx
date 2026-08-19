"use client";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Button, Modal, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function SaveFilterModal({
  opened,
  onClose,
  initialName,
  saving,
  onConfirm,
}: {
  opened: boolean;
  onClose: () => void;
  initialName?: string;
  saving?: boolean;
  onConfirm: (name: string) => void;
}) {
  const { locale } = useOffice();
  const [name, setName] = useState(initialName ?? "");

  useEffect(() => {
    if (opened) setName(initialName ?? "");
  }, [opened, initialName]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      overlayProps={{ blur: 4 }}
    >
      <div className="flex flex-col gap-4">
        <h2>{t(locale, "saveFilter")}</h2>
        <TextInput
          label={t(locale, "filterName")}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          autoFocus
        />
        <div className="flex justify-between gap-2">
          <Button color="dark" variant="transparent" onClick={onClose}>
            {t(locale, "cancel")}
          </Button>
          <Button
            onClick={() => onConfirm(name)}
            leftSection={<IconDeviceFloppy size={16} />}
            disabled={!name.trim()}
            loading={saving}
          >
            {t(locale, "save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
