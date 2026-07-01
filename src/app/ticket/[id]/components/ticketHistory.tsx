import { FileDropzone } from "@/app/components/fileDropzone";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Ticket } from "@/app/lib/interfaces";
import { sendResendMail } from "@/app/lib/resend";
import { fileToBase64 } from "@/app/lib/utils";
import {
  ActionIcon,
  Button,
  CopyButton,
  Divider,
  Drawer,
  Paper,
  SegmentedControl,
  Switch,
  Textarea,
  TextInput,
  Timeline,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconExclamationMark,
  IconExternalLink,
  IconLock,
  IconLockOpen,
  IconPlus,
  IconTruckReturn,
  IconUserMinus,
  IconUserPlus,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { DATE_FORMAT, DHL_TRACKING_URL } from "../../../lib/config";
import { handleDownload, parseDb2Date } from "../../../lib/utils";

export default function TicketHistory({
  ticket,
  email,
  onCommentAdded,
}: {
  ticket: Ticket;
  email: string;
  onCommentAdded?: () => void;
}) {
  const { data: session } = useSession();
  const { locale } = useOffice();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<{
    comment: string;
    public: string;
    prio: boolean;
    withMail: boolean;
    emails: string[];
    files: File[];
  }>({
    initialValues: {
      comment: "",
      public: "0",
      prio: false,
      withMail: false,
      emails: [""],
      files: [],
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (values.comment.trim().length === 0) {
        errors.comment = "Kommentar darf nicht leer sein";
      }
      if (values.public === "0" && values.withMail) {
        values.emails.forEach((email, index) => {
          if (!/^\S+@\S+$/.test(email)) {
            errors[`emails.${index}`] = "Ungültige E-Mail-Adresse";
          }
        });
      }
      return errors;
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ticketnr: ticket.nr,
        createdby: session?.user?.name || ticket.createdby,
        comment: values.comment,
        public: parseInt(values.public),
        prio: values.prio ? 1 : 0,
        source: "OF",
        tracknr: "",
      };

      const response = await fetch(`/api/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        for (const file of values.files) {
          const dataUrl = await fileToBase64(file);
          const base64 = dataUrl.includes(",")
            ? dataUrl.split(",")[1]
            : dataUrl;

          await fetch("/api/file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ticketNr: ticket.nr,
              filename: file.name,
              createdBy: session?.user?.name || ticket.createdby,
              status: 2,
              data: base64,
            }),
          });
        }

        if (values.withMail) {
          const mailAttachments = await Promise.all(
            values.files.map(async (file) => {
              const dataUrl = await fileToBase64(file);
              const base64 = dataUrl.includes(",")
                ? dataUrl.split(",")[1]
                : dataUrl;
              return { filename: file.name, type: file.type, data: base64 };
            }),
          );

          const receivers =
            values.public === "1" ? [email] : values.emails.filter(Boolean);
          await Promise.all(
            receivers.map((receiver) =>
              sendResendMail({
                receiver,
                subject: `Meinl RMA ${ticket.nr} - Neuer Kommentar`,
                content: `Neuer Kommentar hinzugefügt:\n\n${values.comment}\n\nUm auf den Kommentar zu antworten gehen Sie bitte in das Serviceportal.`,
                ...(mailAttachments.length > 0 && {
                  attachments: mailAttachments,
                }),
              }),
            ),
          );
        }

        form.reset();
        close();
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        notifications.show({
          title: `Error ${response.status}`,
          message: (await response.text()) || "",
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-2">
          <h2>{t(locale, "history")}</h2>
          <Button
            variant="light"
            onClick={open}
            leftSection={<IconPlus size={16} />}
          >
            {t(locale, "addEntry")}
          </Button>
        </div>
        <div>
          {ticket.history && ticket.history.length > 0 ? (
            <Timeline
              radius="md"
              active={ticket.history.length}
              bulletSize={28}
              lineWidth={4}
            >
              {[...ticket.history]
                .sort(
                  (a, b) =>
                    new Date(parseDb2Date(b.created)).getTime() -
                    new Date(parseDb2Date(a.created)).getTime(),
                )
                .map((entry, index) => (
                  <Timeline.Item
                    key={index}
                    bullet={
                      entry.prio > 0 ? (
                        <IconExclamationMark />
                      ) : entry.tracknr ? (
                        <IconTruckReturn />
                      ) : undefined
                    }
                  >
                    <Paper p="sm" shadow="sm" bg="var(--background)">
                      <div
                        className="flex flex-col gap-1"
                        style={{
                          color:
                            entry.prio > 0
                              ? "var(--main)"
                              : "var(--foreground)",
                        }}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-sm">{entry.createdBy}</p>
                          <p className="text-sm dimmed">
                            {format(parseDb2Date(entry.created), DATE_FORMAT)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <h3>{entry.comment} </h3>
                          {entry.tracknr && entry.comment.includes("DHL") && (
                            <div className="flex gap-1">
                              <ActionIcon
                                color="yellow"
                                variant="light"
                                component="a"
                                target="_blank"
                                href={`${DHL_TRACKING_URL}${entry.tracknr}`}
                              >
                                <IconExternalLink size={16} />
                              </ActionIcon>{" "}
                              <ActionIcon
                                color="yellow"
                                aria-label={t(locale, "download")}
                                onClick={() =>
                                  handleDownload(
                                    entry.tracknr,
                                    ticket.tracking?.find(
                                      (e) => e.sendungnr === entry.tracknr,
                                    )?.label || "",
                                  )
                                }
                              >
                                <IconDownload size={16} />
                              </ActionIcon>
                            </div>
                          )}
                          {entry.tracknr && entry.comment.includes("GLS") && (
                            <CopyButton value={entry.tracknr}>
                              {({ copied, copy }) => (
                                <ActionIcon color="blue" onClick={copy}>
                                  {copied ? (
                                    <IconCheck size={16} />
                                  ) : (
                                    <IconCopy size={16} />
                                  )}
                                </ActionIcon>
                              )}
                            </CopyButton>
                          )}
                        </div>
                      </div>
                    </Paper>
                  </Timeline.Item>
                ))}
            </Timeline>
          ) : (
            <p className="text-center text-xs dimmed py-4">
              {t(locale, "noNotes")}
            </p>
          )}
        </div>
      </div>
      <Drawer
        size="md"
        position="right"
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="flex flex-col gap-2">
          <h2>{t(locale, "newEntry")}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
              label={t(locale, "comment")}
              {...form.getInputProps("comment")}
              rows={3}
              resize="vertical"
              withAsterisk
            />
            <SegmentedControl
              data={[
                {
                  label: (
                    <div className="flex justify-center items-center gap-1">
                      <IconLockOpen size={20} />
                      <p>{t(locale, "public")}</p>
                    </div>
                  ),
                  value: "1",
                },
                {
                  label: (
                    <div className="flex justify-center items-center gap-1">
                      <IconLock size={20} />
                      <p>{t(locale, "private")}</p>
                    </div>
                  ),
                  value: "0",
                },
              ]}
              {...form.getInputProps("public")}
            />
            <FileDropzone
              files={form.values.files}
              onChange={(files) => form.setFieldValue("files", files)}
            />
            <div className="flex flex-col gap-2 py-4">
              <Switch
                label={`${t(locale, "important").toUpperCase()}!`}
                {...form.getInputProps("prio", { type: "checkbox" })}
              />
              <Divider />
              <Switch
                label={t(locale, "sendMail")}
                {...form.getInputProps("withMail", { type: "checkbox" })}
              />
              {form.values.public === "0" && form.values.withMail && (
                <div className="flex flex-col gap-2">
                  {(form.values.emails ?? [""]).map((_, index) => (
                    <TextInput
                      key={index}
                      {...form.getInputProps(`emails.${index}`)}
                      rightSection={
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() =>
                            form.setFieldValue(
                              "emails",
                              form.values.emails.filter((_, i) => i !== index),
                            )
                          }
                          disabled={(form.values.emails ?? []).length === 1}
                        >
                          <IconUserMinus size={16} />
                        </ActionIcon>
                      }
                    />
                  ))}
                  <Button
                    variant="transparent"
                    leftSection={<IconUserPlus size={16} />}
                    onClick={() =>
                      form.setFieldValue("emails", [
                        ...(form.values.emails ?? []),
                        "",
                      ])
                    }
                  >
                    {t(locale, "addReceiver")}
                  </Button>
                </div>
              )}
              {form.values.withMail && (
                <Paper p="md" shadow="xl" bg="var(--background)">
                  <p className="text-xs">
                    {form.values.public === "0"
                      ? form.values.emails.length > 1
                        ? t(locale, "mailAlertPrivateMultiple")
                        : t(locale, "mailAlertPrivateSingle")
                      : `${t(locale, "mailAlertPublicPrefix")} (${email}) ${t(locale, "mailAlertPublicSuffix")}`}
                  </p>
                </Paper>
              )}
            </div>
            <div className="flex justify-between gap-2">
              <Button color="dark" variant="transparent" onClick={close}>
                {t(locale, "cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!form.isValid() || isSubmitting}
                loading={isSubmitting}
                leftSection={<IconPlus size={16} />}
              >
                {t(locale, "addEntry")}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  );
}
