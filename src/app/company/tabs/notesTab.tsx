import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Company } from "@/app/lib/interfaces";
import {
  Accordion,
  Button,
  Modal,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";

export default function NotesTab({ company }: { company: Company }) {
  const { locale } = useOffice();

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Tabs.Panel value="notes" className="py-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              color="dark"
              variant="transparent"
              leftSection={<IconPlus size={16} />}
              onClick={open}
            >
              {t(locale, "newNote")}
            </Button>
          </div>
          {company.notes && company.notes.length > 0 ? (
            <Accordion variant="filled" defaultValue={"0"}>
              {company.notes
                .sort((a, b) => dayjs(b.datum).diff(dayjs(a.datum)))
                .map((note, index) => (
                  <Accordion.Item value={`${index}`} key={index}>
                    <Accordion.Control>
                      <div className="flex flex-col">
                        <p className="text-sm dimmed">
                          {dayjs(note.datum).format("DD.MM.YYYY")} –{" "}
                          {note.creator}
                        </p>
                        <h2>{note.subject}</h2>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <div className="flex flex-col border-t border-t-black/20 pt-4">
                        <p>{note.body}</p>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
            </Accordion>
          ) : (
            <p className="text-center text-xs dimmed">{t(locale, "noNotes")}</p>
          )}
        </div>
      </Tabs.Panel>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <div className="flex flex-col gap-2">
          <h2 className="text-center">{t(locale, "newNote")}</h2>
          <TextInput label={t(locale, "subject")} />
          <Textarea label={t(locale, "body")} rows={5} />
          <div className="flex justify-between">
            <Button color="dark" variant="transparent" onClick={close}>
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={close}
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
