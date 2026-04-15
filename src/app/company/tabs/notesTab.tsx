import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Company, Note } from "@/app/lib/interfaces";
import {
  Accordion,
  ActionIcon,
  Button,
  Modal,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconEdit, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function NotesTab({
  company,
  onCompanySave,
}: {
  company: Company;
  onCompanySave: () => Promise<void>;
}) {
  const { data: session } = useSession();
  const { locale, source } = useOffice();

  const [value, setValue] = useState<string | null>("0");
  const [opened, { open, close }] = useDisclosure(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  function handleOpen(note?: Note) {
    setEditingNote(note || null);
    setSubject(note?.subject || "");
    setBody(note?.body || "");
    open();
  }

  function handleClose() {
    setEditingNote(null);
    setSubject("");
    setBody("");
    close();
  }

  async function handleSubmit() {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingNote
          ? {
              ...editingNote,
              kdnr: company.kdnr,
              subject,
              body,
              user: session?.user?.name || editingNote.user,
              source,
            }
          : {
              unid: null,
              kdnr: company.kdnr,
              subject,
              body,
              user: session?.user?.name,
              source,
            },
      ),
    });

    if (!res.ok) {
      notifications.show({
        title: t(locale, "error"),
        message: "Failed to save note.",
      });
      return;
    }

    handleClose();
    onCompanySave();
  }

  return (
    <>
      <Tabs.Panel value="notes" className="py-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Button
              color="dark"
              variant="transparent"
              leftSection={<IconPlus size={16} />}
              onClick={() => handleOpen()}
            >
              {t(locale, "newNote")}
            </Button>
          </div>
          {company.notes && company.notes.length > 0 ? (
            <Accordion
              variant="filled"
              value={value}
              onChange={setValue}
              chevronPosition="left"
            >
              {company.notes
                .sort((a, b) => dayjs(b.created).diff(dayjs(a.created)))
                .map((note, index) => (
                  <Accordion.Item value={`${index}`} key={index}>
                    <div className="flex items-center justify-between pr-2">
                      <Accordion.Control>
                        <div className="flex flex-col">
                          <p className="text-sm dimmed">
                            {dayjs(note.created).format("DD.MM.YYYY")} –{" "}
                            {note.user}
                          </p>
                          <h2
                            className={`${value === `${index}` ? "" : "line-clamp-1"}`}
                          >
                            {note.subject}
                          </h2>
                        </div>
                      </Accordion.Control>
                      <ActionIcon
                        variant="transparent"
                        color="dark"
                        aria-label={t(locale, "edit")}
                        onClick={() => handleOpen(note)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </div>
                    <Accordion.Panel>
                      <p>{note.body}</p>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
            </Accordion>
          ) : (
            <p className="text-center text-xs dimmed">{t(locale, "noNotes")}</p>
          )}
        </div>
      </Tabs.Panel>
      <Modal opened={opened} onClose={handleClose} withCloseButton={false}>
        <div className="flex flex-col gap-2">
          <h2 className="text-center">
            {t(locale, editingNote ? "editNote" : "newNote")}
          </h2>
          <TextInput
            label={t(locale, "subject")}
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
          />
          <Textarea
            label={t(locale, "body")}
            rows={5}
            value={body}
            onChange={(e) => setBody(e.currentTarget.value)}
          />
          <div className="flex justify-between">
            <Button color="dark" variant="transparent" onClick={handleClose}>
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {t(locale, "save")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
