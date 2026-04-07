import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconPhoto } from "@tabler/icons-react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";
import { Company } from "../lib/interfaces";

export default function FileUploader({
  company,
  onSuccess,
}: {
  company: Company;
  onSuccess?: () => void;
}) {
  const { source, locale } = useOffice();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `/api/logo/${source}/${company.kdnr}/${company.id}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Fehler beim Hochladen!");

      notifications.show({
        title: t(locale, "uploadSuccess"),
        message: t(locale, "uploadSuccess"),
        color: "black",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      notifications.show({
        title: t(locale, "error"),
        message: t(locale, "uploadError"),
        color: "red",
      });
    }
  };

  return (
    <Dropzone
      onDrop={async (files) => uploadFile(files[0])}
      onReject={() =>
        notifications.show({
          title: t(locale, "error"),
          message: t(locale, "uploadReject"),
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
          <p>{t(locale, "uploadLogoText")}</p>
          <p className="text-xs dimmed">{t(locale, "uploadLogoDescription")}</p>
        </div>
      </div>
    </Dropzone>
  );
}
