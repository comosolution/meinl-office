import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { Company } from "../lib/interfaces";

export default function LogoPreview({
  company,
  onDelete,
}: {
  company: Company;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasLogo = company.logo && company.logo !== "";

  async function handleDelete() {
    try {
      const res = await fetch(`/api/logo/${company.kdnr}/${company.id}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Fehler beim Löschen");

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
              <Button color="red" onClick={handleDelete}>
                Löschen bestätigen
              </Button>
              <Button color="dark" onClick={() => setConfirmDelete(false)}>
                Abbrechen
              </Button>
            </Button.Group>
          ) : (
            <Button
              color="red"
              onClick={() => setConfirmDelete(true)}
              leftSection={<IconTrash size={16} />}
            >
              Bild löschen
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
