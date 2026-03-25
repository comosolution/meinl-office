import { HistoryEntry } from "@/app/lib/interfaces";
import {
  Button,
  Paper,
  SegmentedControl,
  TextInput,
  Timeline,
} from "@mantine/core";
import { useForm } from "@mantine/form";
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
      <Paper p="md">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <TextInput
            placeholder="Kommentar eingeben"
            {...form.getInputProps("comment")}
            className="flex-1"
          />
          <SegmentedControl
            data={[
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconLockOpen size={16} /> Öffentlich
                  </div>
                ),
                value: "1",
              },
              {
                label: (
                  <div className="flex items-center gap-1">
                    <IconLock size={16} /> Privat
                  </div>
                ),
                value: "0",
              },
            ]}
            {...form.getInputProps("public")}
          />
          <Button
            type="submit"
            leftSection={<IconPlus size={16} />}
            disabled={!form.isValid() || isSubmitting}
            loading={isSubmitting}
          >
            Hinzufügen
          </Button>
        </form>
      </Paper>
      <div className="p-4">
        {history && history.length > 0 ? (
          <Timeline active={history.length}>
            {history
              .map((entry, index) => (
                <Timeline.Item key={index} title={entry.createdBy}>
                  <div>
                    <h2>{entry.comment}</h2>
                    <p className="text-xs dimmed">
                      {format(parseDb2Date(entry.created), LONG_DATE_FORMAT)}
                    </p>
                  </div>
                </Timeline.Item>
              ))
              .reverse()}
          </Timeline>
        ) : (
          <p className="text-center text-xs dimmed">Keine Notizen vorhanden</p>
        )}
      </div>
    </div>
  );
}
