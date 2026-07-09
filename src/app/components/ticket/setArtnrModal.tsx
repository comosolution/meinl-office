"use client";
import { ProductSelect } from "@/app/components/ticket/productSelect";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Button, Modal } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

interface SetArtnrModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (artnr: string) => void;
}

export function SetArtnrModal({
  opened,
  onClose,
  onConfirm,
}: SetArtnrModalProps) {
  const { locale } = useOffice();
  const [artnr, setArtnr] = useState("");

  const handleClose = () => {
    setArtnr("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton={false}
      overlayProps={{ blur: 4 }}
    >
      <div className="flex flex-col gap-4">
        <h2>{t(locale, "setArticleNumber")}</h2>
        <ProductSelect
          label={t(locale, "articleNumberMei")}
          value={artnr}
          onChange={(value) => setArtnr(value || "")}
        />
        <div className="flex justify-between gap-2">
          <Button color="dark" variant="transparent" onClick={handleClose}>
            {t(locale, "cancel")}
          </Button>
          <Button
            onClick={() => {
              onConfirm(artnr);
              handleClose();
            }}
            leftSection={<IconCheck size={16} />}
            disabled={!artnr.trim()}
          >
            {t(locale, "setArticleNumber")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
