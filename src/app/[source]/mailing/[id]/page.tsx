"use client";
import { Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconChevronLeft,
  IconDeviceFloppy,
  IconEdit,
  IconTableExport,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/loader";
import { MailingPersonsPanel } from "../../../components/mailing/personsPanel";
import { useOffice } from "../../../context/officeContext";
import {
  useCleverReachExport,
  useDebounce,
  useFetchResults,
} from "../../../lib/hooks";
import { t } from "../../../lib/i18n";
import { MailingFilter, Person } from "../../../lib/interfaces";
import { filterPersons } from "../../../lib/mailingFilters";
import { getErrorMessage } from "../../../lib/utils";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { locale, source, sourcePrefix, service } = useOffice();
  const { data: session } = useSession();
  const fetchResults = useFetchResults();
  const { exporting, exportToCleverReach } = useCleverReachExport();
  const router = useRouter();

  const [name, setName] = useState("");
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    competences: [] as string[],
    land: [] as string[],
    kundenart: [] as string[],
    kdnr: "",
  });
  const [savedState, setSavedState] = useState({
    name: "",
    filters: {
      search: "",
      competences: [] as string[],
      land: [] as string[],
      kundenart: [] as string[],
      kdnr: "",
    },
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchFilter = async () => {
    try {
      const response = await fetch("/api/mailing/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unid: id,
          source,
          user: session?.user?.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const record = Array.isArray(data) ? data[0] : data;
        const filter: MailingFilter | undefined = record?.json ?? record;

        const loadedName = filter?.name ?? "";
        const loadedFilters = {
          search: filter?.search ?? "",
          competences: filter?.zustaendig
            ? filter.zustaendig.split("#").filter(Boolean)
            : [],
          land: filter?.land ? filter.land.split("#").filter(Boolean) : [],
          kundenart: filter?.kundenart
            ? filter.kundenart.split("#").filter(Boolean)
            : [],
          kdnr: filter?.kdnr ?? "",
        };

        setName(loadedName);
        setFilters(loadedFilters);
        setSavedState({ name: loadedName, filters: loadedFilters });
      } else {
        notifications.show({
          title: `Error ${response.status}`,
          message: getErrorMessage(await response.text()),
        });
      }
    } catch (error) {
      console.error("Error fetching mailing filter:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const res = await fetchResults<Person>("persons", debouncedSearch, {
      zustaendig: filters.competences.join("#"),
    });
    setPersons(res);
  };

  useEffect(() => {
    fetchFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (loading) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, service, filters.competences, debouncedSearch]);

  const filteredPersons = useMemo(
    () => filterPersons(persons, filters),
    [persons, filters],
  );

  const handleSaveFilter = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/mailing/filter/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unid: id,
          name,
          user: session?.user?.name,
          search: filters.search,
          source,
          zustaendig: filters.competences.join("#"),
          land: filters.land.join("#"),
          kundenart: filters.kundenart.join("#"),
          kdnr: filters.kdnr,
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

      setSavedState({ name, filters });
      setEditing(false);

      notifications.show({
        title: t(locale, "filterSaved"),
        message: t(locale, "filterSavedMessage"),
        color: "dark",
      });
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

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/mailing/filter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unid: id, user: session?.user?.name, source }),
      });

      if (!response.ok) {
        notifications.show({
          title: t(locale, "error"),
          message: getErrorMessage(await response.text()),
          color: "red",
        });
        setConfirmDelete(false);
        return;
      }

      router.push(`/${sourcePrefix}/mailing`);
    } catch (error) {
      console.error("Error deleting mailing filter:", error);
      notifications.show({
        title: t(locale, "error"),
        message: t(locale, "filterDeleteFailedMessage"),
        color: "red",
      });
      setConfirmDelete(false);
    }
  };

  const handleDiscard = () => {
    setName(savedState.name);
    setFilters(savedState.filters);
    setEditing(false);
  };

  const handleExportToCleverReach = async () => {
    const success = await exportToCleverReach(
      name || `Meinl Office Mailing ${new Date().toLocaleString("de-DE")}`,
      filteredPersons,
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
          {editing ? (
            <>
              <Button
                color="dark"
                variant="transparent"
                onClick={handleDiscard}
                leftSection={<IconX size={16} />}
              >
                {t(locale, "discard")}
              </Button>
              <Button
                color="dark"
                onClick={handleSaveFilter}
                loading={saving}
                disabled={!name.trim()}
                leftSection={<IconDeviceFloppy size={16} />}
              >
                {t(locale, "save")}
              </Button>
            </>
          ) : confirmDelete ? (
            <>
              <Button
                variant="transparent"
                onClick={() => setConfirmDelete(false)}
              >
                {t(locale, "cancel")}
              </Button>
              <Button
                onClick={handleDelete}
                leftSection={<IconTrash size={16} />}
              >
                {t(locale, "confirmDelete")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="transparent"
                leftSection={<IconTrash size={16} />}
                onClick={() => setConfirmDelete(true)}
              >
                {t(locale, "delete")}
              </Button>
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={() => setEditing(true)}
              >
                {t(locale, "edit")}
              </Button>
              <Button
                onClick={handleExportToCleverReach}
                loading={exporting}
                disabled={filteredPersons.length === 0}
                leftSection={<IconTableExport size={16} />}
              >
                {t(locale, "exportToCleverReach")}
              </Button>
            </>
          )}
        </div>
      </header>

      {editing ? (
        <TextInput
          size="xl"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="text-center md:text-left"
        />
      ) : (
        <h1>{name}</h1>
      )}

      <MailingPersonsPanel
        filters={filters}
        setFilters={setFilters}
        readOnly={!editing}
        persons={persons}
      />
    </main>
  );
}
