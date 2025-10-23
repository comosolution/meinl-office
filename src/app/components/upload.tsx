import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconPhoto } from "@tabler/icons-react";
import { Company } from "../lib/interfaces";

export default function FileUploader({
  company,
  onSuccess,
}: {
  company: Company;
  onSuccess?: () => void;
}) {
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/logo/${company.kdnr}/${company.id}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Fehler beim Hochladen!");

      notifications.show({
        title: "Erfolg",
        message: "Logo erfolgreich hochgeladen!",
        color: "black",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      notifications.show({
        title: "Fehler",
        message: "Fehler beim Hochladen!",
        color: "red",
      });
    }
  };

  return (
    <Dropzone
      onDrop={async (files) => uploadFile(files[0])}
      onReject={() =>
        notifications.show({
          title: "Fehler",
          message: "Die Datei wurde nicht akzeptiert.",
          color: "red",
        })
      }
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      multiple={false}
    >
      <div
        className="min-h-48 flex justify-center items-center gap-2"
        style={{ pointerEvents: "none" }}
      >
        <IconPhoto size={96} color="var(--mantine-color-dimmed)" stroke={2} />
        <div>
          <p>Logo per Drag&Drop oder Klick hinzufügen</p>
          <p className="text-xs dimmed">
            Eine Bilddatei – maximal 5 MB <br /> Bevorzugt auf weißem /
            transparentem Hintergrund
          </p>
        </div>
      </div>
    </Dropzone>
  );
}
