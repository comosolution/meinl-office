import { Button } from "@mantine/core";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Company } from "../lib/interfaces";

export default function LogoPreview({
  company,
  onDelete,
}: {
  company: Company;
  onDelete: () => void;
}) {
  const { source, locale } = useOffice();
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasLogo = company.logo && company.logo !== "";

  async function handleDelete() {
    try {
      const res = await fetch(
        `/api/logo/${source}/${company.kdnr}/${company.id}`,
        {
          method: "POST",
        },
      );

      if (!res.ok) throw new Error(t(locale, "deleteLogoError"));

      onDelete();
      setConfirmDelete(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        height: "auto",
        border: "1px dashed var(--border-color)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={hasLogo ? company.logo : "/logo_l.svg"}
        fill
        style={{ objectFit: "contain" }}
        alt={`Logo ${company.name1}`}
        className="p-4"
      />
      {hasLogo && (
        <div
          className={`absolute inset-0 flex items-center justify-center backdrop-blur-xs transition-opacity ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {confirmDelete ? (
            <Button.Group>
              <Button
                color="red"
                onClick={handleDelete}
                leftSection={<IconCheck size={16} />}
              >
                {t(locale, "confirmDelete")}
              </Button>
              <Button
                color="dark"
                onClick={() => setConfirmDelete(false)}
                leftSection={<IconX size={16} />}
              >
                {t(locale, "cancel")}
              </Button>
            </Button.Group>
          ) : (
            <Button
              color="red"
              onClick={() => setConfirmDelete(true)}
              leftSection={<IconTrash size={16} />}
            >
              {t(locale, "deleteImage")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
