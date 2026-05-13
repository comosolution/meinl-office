import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { HistoryEntry } from "@/app/lib/interfaces";
import { sendResendMail } from "@/app/lib/resend";
import {
  Alert,
  Button,
  Checkbox,
  Modal,
  Paper,
  SegmentedControl,
  Textarea,
  TextInput,
  Timeline,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconExclamationMark,
  IconLock,
  IconLockOpen,
  IconPlus,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { DATE_FORMAT } from "../../lib/constants";
import { parseDb2Date } from "../../lib/utils";

export default function HistoryTab({
  ticketnr,
  createdby,
  email,
  onCommentAdded,
  history = [],
}: {
  ticketnr: string;
  createdby: string;
  email: string;
  onCommentAdded?: () => void;
  history?: HistoryEntry[];
}) {
  const { locale } = useOffice();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<{
    comment: string;
    public: string;
    prio: boolean;
    withMail: boolean;
    email: string;
  }>({
    initialValues: {
      comment: "",
      public: "1",
      prio: false,
      withMail: false,
      email: "",
    },
    validate: {
      comment: (value) =>
        value.trim().length === 0 ? "Kommentar darf nicht leer sein" : null,
      email: (value, values) =>
        values.public === "0" && values.withMail
          ? /^\S+@\S+$/.test(value)
            ? null
            : "Invalid email"
          : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ticketnr,
        createdby,
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
        if (values.withMail && email) {
          await sendResendMail({
            receiver: values.public === "1" ? email : values.email,
            subject: `Meinl RMA ${ticketnr} - Neuer Kommentar`,
            content: `Neuer Kommentar hinzugefügt:\n\n${values.comment}\n\nUm auf den Kommentar zu antworten gehen Sie bitte in das Serviceportal.`,
          });
        }

        form.reset();
        close();
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        notifications.show({
          title: t(locale, "error"),
          message: t(locale, "noteError"),
        });
        console.error("Failed to add comment");
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
        <div className="p-4">
          {history && history.length > 0 ? (
            <Timeline active={history.length} bulletSize={20}>
              {history
                .map((entry, index) => (
                  <Timeline.Item
                    key={index}
                    title={
                      <div className="flex justify-between">
                        <p className="text-sm">{entry.createdBy}</p>
                        <p className="text-sm dimmed">
                          {format(parseDb2Date(entry.created), DATE_FORMAT)}
                        </p>
                      </div>
                    }
                    bullet={
                      entry.prio > 0 ? <IconExclamationMark /> : undefined
                    }
                  >
                    <h2
                      style={{
                        color:
                          entry.prio > 0 ? "var(--main)" : "var(--foreground)",
                      }}
                    >
                      {entry.comment}
                    </h2>
                  </Timeline.Item>
                ))
                .reverse()}
            </Timeline>
          ) : (
            <p className="text-center text-xs dimmed">{t(locale, "noNotes")}</p>
          )}
        </div>
      </div>
      <Modal
        size="md"
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-center">{t(locale, "newEntry")}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
              label={t(locale, "comment")}
              {...form.getInputProps("comment")}
              rows={3}
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
            <Paper p="md" shadow="xl" bg="var(--background)">
              <div className="flex flex-col gap-2">
                <Checkbox
                  color="red"
                  label={`${t(locale, "important").toUpperCase()}!`}
                  {...form.getInputProps("prio", { type: "checkbox" })}
                />
                <Checkbox
                  label={t(locale, "sendMail")}
                  {...form.getInputProps("withMail", { type: "checkbox" })}
                />
                {form.values.public === "0" && form.values.withMail && (
                  <TextInput
                    label={t(locale, "email")}
                    {...form.getInputProps("email")}
                  />
                )}
                {form.values.withMail && (
                  <Alert>
                    {form.values.public === "0"
                      ? "Der angegebene Empfänger"
                      : `Der Ticketersteller (${email})`}{" "}
                    bekommt diesen Kommentar zusätzlich per Mail geschickt.
                  </Alert>
                )}
              </div>
            </Paper>
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
      </Modal>
    </>
  );
}
