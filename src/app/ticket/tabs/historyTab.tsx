import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { HistoryEntry } from "@/app/lib/interfaces";
import {
  ActionIcon,
  SegmentedControl,
  TextInput,
  Timeline,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLock, IconLockOpen, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { LONG_DATE_FORMAT } from "../../lib/constants";
import { parseDb2Date } from "../../lib/utils";

export default function HistoryTab({
  ticketnr,
  createdby,
  onCommentAdded,
  history = [],
}: {
  ticketnr: string;
  createdby: string;
  onCommentAdded?: (comment: HistoryEntry) => void;
  history?: HistoryEntry[];
}) {
  const { locale } = useOffice();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<{
    comment: string;
    public: string;
  }>({
    initialValues: {
      comment: "",
      public: "1",
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
        const newComment = await response.json();
        form.reset();
        if (onCommentAdded) {
          onCommentAdded(newComment);
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
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <TextInput
          placeholder={t(locale, "note")}
          {...form.getInputProps("comment")}
          className="flex-1"
        />
        <SegmentedControl
          data={[
            {
              label: <IconLockOpen size={20} />,
              value: "1",
            },
            {
              label: <IconLock size={20} />,
              value: "0",
            },
          ]}
          {...form.getInputProps("public")}
        />
        <ActionIcon
          size="input-sm"
          type="submit"
          disabled={!form.isValid() || isSubmitting}
          loading={isSubmitting}
        >
          <IconPlus size={16} />
        </ActionIcon>
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
                        {format(parseDb2Date(entry.created), LONG_DATE_FORMAT)}
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
