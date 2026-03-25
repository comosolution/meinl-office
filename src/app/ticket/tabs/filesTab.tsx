"use client";
import { Avatar, Button, FileInput, Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconDownload,
  IconFile,
  IconPaperclip,
  IconUpload,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { LONG_DATE_FORMAT } from "../../lib/constants";
import { Attachment } from "../../lib/interfaces";
import { fileToBase64, parseDb2Date } from "../../lib/utils";

export default function FilesTab({
  ticketnr,
  createdby,
  files = [],
  onFileUploaded,
}: {
  ticketnr: string;
  createdby: string;
  files?: Attachment[];
  onFileUploaded?: (uploaded: File[]) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const form = useForm<{ files: File[] | null }>({
    initialValues: { files: null },
    validate: {
      files: (value) =>
        !value || value.length === 0 ? "Mindestens eine Datei anhängen" : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    if (!values.files || values.files.length === 0) return;
    setIsSubmitting(true);
    try {
      for (const file of [...values.files]) {
        const dataUrl = await fileToBase64(file);
        const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
        const body = {
          ticketNr: ticketnr,
          filename: file.name,
          createdBy: createdby,
          status: 2,
          data: base64,
        } as const;

        const res = await fetch("/api/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const json = await res.json();
          if (onFileUploaded) onFileUploaded(json);
        } else {
          console.error("Failed to upload file:", await res.text());
        }
      }

      form.reset();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <FileInput
          placeholder="Bilder oder PDFs auswählen"
          multiple
          leftSection={<IconPaperclip size={16} />}
          leftSectionPointerEvents="none"
          className="flex-1"
          value={form.values.files as File[]}
          onChange={(v: File | File[] | null) =>
            form.setFieldValue("files", (v as File[]) || null)
          }
        />
        <Button
          type="submit"
          leftSection={<IconUpload size={16} />}
          disabled={!form.isValid() || isSubmitting}
          loading={isSubmitting}
        >
          Hochladen
        </Button>
      </form>
      {files && files.length > 0 ? (
        <div className="flex flex-col gap-2">
          {files
            .map((entry, index) => (
              <Paper key={index} p="md" bg="transparent" withBorder>
                <div className="flex justify-between items-center gap-4">
                  <Avatar size={48} variant="light" color="dark">
                    <IconFile size={24} />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{entry.createdBy}</p>
                    <h2>{entry.filename}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm dimmed">
                      {entry.created
                        ? format(parseDb2Date(entry.created), LONG_DATE_FORMAT)
                        : ""}
                    </p>
                    <Button
                      color="dark"
                      leftSection={<IconDownload size={16} />}
                      loading={downloading === entry.lfdn}
                      onClick={async () => {
                        try {
                          setDownloading(entry.lfdn);
                          const res = await fetch(
                            `/api/file/${ticketnr}/${entry.lfdn}`,
                          );
                          if (!res.ok) {
                            console.error(
                              "Failed to download file",
                              await res.text(),
                            );
                            return;
                          }

                          const buffer = await res.arrayBuffer();
                          const blob = new Blob([buffer], {
                            type: "application/octet-stream",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = entry.filename || "download";
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Error downloading file:", err);
                        } finally {
                          setDownloading(null);
                        }
                      }}
                    >
                      Herunterladen
                    </Button>
                  </div>
                </div>
              </Paper>
            ))
            .reverse()}
        </div>
      ) : (
        <p className="text-center text-xs dimmed">Keine Dateien vorhanden</p>
      )}
    </div>
  );
}
