"use client";
import { ActionIcon, Paper } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconFileTypePdf, IconPaperclip, IconX } from "@tabler/icons-react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export function FileDropzone({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const { locale } = useOffice();

  return (
    <div>
      <Dropzone
        onDrop={(dropped) => onChange([...files, ...dropped])}
        accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
        multiple
      >
        <div
          className="flex justify-center items-center gap-2 p-1"
          style={{ pointerEvents: "none" }}
        >
          <IconPaperclip
            size={24}
            stroke={1.5}
            color="var(--mantine-color-dimmed)"
          />
          <p className="text-sm dimmed">{t(locale, "uploadFiles")}</p>
        </div>
      </Dropzone>
      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {files.map((f, i) => {
            const isImage = f.type.startsWith("image/");

            return (
              <Paper key={i} p="xs" bg="var(--background)" shadow="xl">
                <div className="flex items-center gap-4">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-8 h-8 block object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8">
                      <IconFileTypePdf
                        size={24}
                        stroke={1.5}
                        color="var(--mantine-color-dimmed)"
                      />
                    </div>
                  )}
                  <h3 className="flex-1">{f.name}</h3>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => onChange(files.filter((_, j) => j !== i))}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </div>
              </Paper>
            );
          })}
        </div>
      )}
    </div>
  );
}
