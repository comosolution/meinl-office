"use client";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconChevronLeft,
  IconDeviceFloppy,
  IconTableExport,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../../components/loader";
import { MailingPersonsPanel } from "../../../components/mailing/personsPanel";
import { SaveFilterModal } from "../../../components/mailing/saveFilterModal";
import { useOffice } from "../../../context/officeContext";
import {
  useCleverReachExport,
  useDebounce,
  useFetchResults,
} from "../../../lib/hooks";
import { t } from "../../../lib/i18n";
import { Person } from "../../../lib/interfaces";
import { getErrorMessage } from "../../../lib/utils";

export default function Page() {
  const { locale, source, sourcePrefix, service } = useOffice();
  const { data: session } = useSession();
  const fetchResults = useFetchResults();
  const { exporting, exportToCleverReach } = useCleverReachExport();
  const router = useRouter();

  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    competences: [] as string[],
    land: [] as string[],
    kundenart: [] as string[],
    kdnr: "",
  });

  const [saveModalOpened, { open: openSaveModal, close: closeSaveModal }] =
    useDisclosure(false);

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedKdnr = useDebounce(filters.kdnr, 500);

  const fetchData = async () => {
    const res = await fetchResults<Person>("persons", debouncedSearch, {
      zustaendig: filters.competences.join("#"),
      land: filters.land.join("#"),
      kundenart: filters.kundenart.join("#"),
      kdnr: debouncedKdnr,
    });
    setPersons(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    source,
    service,
    filters.competences,
    filters.land,
    filters.kundenart,
    debouncedKdnr,
    debouncedSearch,
  ]);

  const handleExportToCleverReach = async () => {
    const success = await exportToCleverReach(
      `Meinl Office Mailing ${new Date().toLocaleString("de-DE")}`,
      persons,
    );

    notifications.show(
      success
        ? {
            title: t(locale, "exportSuccessful"),
            message: t(locale, "exportSuccessMessage"),
            color: "dark",
          }
        : {
            title: t(locale, "error"),
            message: t(locale, "exportFailedMessage"),
            color: "red",
          },
    );
  };

  const handleSaveFilter = async (name: string) => {
    setSaving(true);
    try {
      const response = await fetch("/api/mailing/filter/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unid: null,
          name,
          user: session?.user?.name,
          search: filters.search,
          source,
          zustaendig: filters.competences.join("#"),
          land: filters.land.join("#"),
          kundenart: filters.kundenart.join("#"),
        }),
      });

      if (!response.ok) {
        notifications.show({
          title: t(locale, "error"),
          message: getErrorMessage(await response.text()),
          color: "red",
        });
        return;
      }

      closeSaveModal();
      router.push(`/${sourcePrefix}/mailing`);
    } catch (error) {
      console.error("Error saving mailing filter:", error);
      notifications.show({
        title: t(locale, "error"),
        message: t(locale, "filterSaveFailedMessage"),
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-4 px-4 md:px-8 py-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 py-4">
        <Button
          component={Link}
          href={`/${sourcePrefix}/mailing`}
          variant="light"
          color="gray"
          leftSection={<IconChevronLeft size={16} />}
        >
          {t(locale, "allFilters")}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="transparent"
            onClick={handleExportToCleverReach}
            loading={exporting}
            disabled={persons.length === 0}
            leftSection={<IconTableExport size={16} />}
          >
            {t(locale, "exportToCleverReach")}
          </Button>
          <Button
            onClick={openSaveModal}
            disabled={persons.length === 0}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            {t(locale, "saveFilter")}
          </Button>
        </div>
      </header>

      <h1>{t(locale, "createFilter")}</h1>

      <MailingPersonsPanel
        filters={filters}
        setFilters={setFilters}
        persons={persons}
      />

      <SaveFilterModal
        opened={saveModalOpened}
        onClose={closeSaveModal}
        saving={saving}
        onConfirm={handleSaveFilter}
      />
    </main>
  );
}
