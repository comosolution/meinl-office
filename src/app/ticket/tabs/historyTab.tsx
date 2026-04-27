import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { HistoryEntry } from "@/app/lib/interfaces";
import { sendResendMail } from "@/app/lib/resend";
import {
  ActionIcon,
  Checkbox,
  SegmentedControl,
  TextInput,
  Timeline,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLock, IconLockOpen, IconPlus } from "@tabler/icons-react";
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

  const form = useForm<{
    comment: string;
    public: string;
    withMail: boolean;
  }>({
    initialValues: {
      comment: "",
      public: "1",
      withMail: false,
    },
    validate: {
      comment: (value) =>
        value.trim().length === 0 ? "Kommentar darf nicht leer sein" : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ticketnr,
        createdby,
        comment: values.comment,
        source: "OF",
        tracknr: "",
        public: parseInt(values.public),
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
            receiver: email,
            subject: `Meinl RMA ${ticketnr} - Neuer Kommentar`,
            content: `Neuer Kommentar hinzugefügt:\n\n${values.comment}\n\nUm auf den Kommentar zu antworten gehen Sie bitte in das Serviceportal.`,
          });
        }

        form.reset();
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
    <div className="flex flex-col gap-4">
      <h2>{t(locale, "history")}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <TextInput
            placeholder={t(locale, "comment")}
            {...form.getInputProps("comment")}
            className="flex-1"
          />
          <ActionIcon
            size="input-sm"
            type="submit"
            disabled={!form.isValid() || isSubmitting}
            loading={isSubmitting}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Checkbox
            size="sm"
            label={t(locale, "sendMail")}
            {...form.getInputProps("withMail", { type: "checkbox" })}
          />
          <SegmentedControl
            data={[
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconLockOpen size={20} />
                    <p>{t(locale, "public")}</p>
                  </div>
                ),
                value: "1",
              },
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconLock size={20} />
                    <p>{t(locale, "private")}</p>
                  </div>
                ),
                value: "0",
              },
            ]}
            {...form.getInputProps("public")}
          />
        </div>
      </form>
      <div className="p-4">
        {history && history.length > 0 ? (
          <Timeline active={history.length}>
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
                >
                  <div>
                    <h2>{entry.comment}</h2>
                  </div>
                </Timeline.Item>
              ))
              .reverse()}
          </Timeline>
        ) : (
          <p className="text-center text-xs dimmed">{t(locale, "noNotes")}</p>
        )}
      </div>
    </div>
  );
}
