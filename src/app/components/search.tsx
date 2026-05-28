import { ActionIcon, Avatar, Kbd, NavLink } from "@mantine/core";
import {
  Spotlight,
  spotlight,
  SpotlightActionData,
  SpotlightActionGroupData,
} from "@mantine/spotlight";
import {
  IconBuildings,
  IconBuildingWarehouse,
  IconSearch,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOffice } from "../context/officeContext";
import { useDebounce } from "../lib/hooks";
import { t } from "../lib/i18n";
import { Dealer, Person } from "../lib/interfaces";
import { navLink } from "../lib/styles";
import { fetchResults, getAvatarColor } from "../lib/utils";

export default function Search({
  inSidebar,
  collapsed,
}: {
  inSidebar?: boolean;
  collapsed?: boolean;
}) {
  const router = useRouter();
  const { source, locale, service } = useOffice();
  const { data: session } = useSession();

  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Dealer[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const getData = async () => {
      if (debouncedQuery.trim() === "" || debouncedQuery.trim().length < 2) {
        setCompanies([]);
        setPersons([]);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const [allCompanies, allPersons] = await Promise.all([
          fetchResults<Dealer>(
            source,
            service,
            source === "OFFGUT" ? "dealers" : "companies",
            session?.user?.name ?? "",
            debouncedQuery,
            signal,
          ),
          service === "B2C"
            ? []
            : fetchResults<Person>(
                source,
                service,
                "persons",
                session?.user?.name ?? "",
                debouncedQuery,
                signal,
              ),
        ]);

        setCompanies(allCompanies);
        setPersons(allPersons);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Search error:", error);
      }
    };

    getData();
  }, [debouncedQuery, source, service]);

  const companyActions: SpotlightActionData[] = companies
    .filter((c) => c.name1 !== null)
    .map((c, index) => ({
      id: `company-${index}-${c.id}-${c.kdnr}`,
      label: c.name1,
      description: `${c.plz} ${c.ort} ${c.land} ${
        c.id === 0 ? "" : `– ${c.brand}`
      }`,
      onClick: () => {
        router.push(
          `/company/${c.kdnr}${c.id === 0 || source === "OFFUSA" ? "" : `/${c.id}`}`,
        );
      },
      rightSection: (
        <p className="text-xs dimmed">
          {c.id === 0 || source === "OFFUSA" ? c.kdnr : `${c.kdnr}-${c.id}`}
        </p>
      ),
      leftSection: (
        <Avatar size={32} variant="filled" color={getAvatarColor(c.kundenart)}>
          {c.id === 0 ? (
            <IconBuildings size={16} />
          ) : (
            <IconBuildingWarehouse size={16} />
          )}
        </Avatar>
      ),
    }))
    .sort((a, b) => {
      const aIsMain = a.id.includes("-0-");
      const bIsMain = b.id.includes("-0-");

      if (aIsMain && !bIsMain) return -1;
      if (!aIsMain && bIsMain) return 1;

      return a.label!.localeCompare(b.label!, "de", { sensitivity: "base" });
    });

  const personActions: SpotlightActionData[] = persons
    .map((p, index) => ({
      id: `person-${index}-${p.b2bnr}`,
      label: `${p.nachname}, ${p.vorname}`,
      description: `${p.jobpos || t(locale, "employee")} – ${p.name1}`,
      onClick: () => {
        router.push(`/person/${p.b2bnr}`);
      },
      rightSection: <p className="text-xs dimmed">{p.b2bnr}</p>,
      leftSection: (
        <Avatar
          size={32}
          color={getAvatarColor(p.kundenart)}
          name={`${p.nachname} ${p.vorname}`}
        />
      ),
    }))
    .sort((a, b) =>
      a.label!.localeCompare(b.label!, "de", { sensitivity: "base" }),
    );

  const actions: SpotlightActionGroupData[] = [
    {
      group: t(locale, "companies"),
      actions: companyActions,
    },
    {
      group: t(locale, "people"),
      actions: personActions,
    },
  ];

  return (
    <>
      {inSidebar ? (
        <NavLink
          label={t(locale, "search")}
          title={t(locale, "search")}
          active
          color="dark"
          leftSection={<IconSearch size={20} />}
          rightSection={
            collapsed ? undefined : (
              <div>
                <Kbd size="xs">Ctrl</Kbd>
                <Kbd size="xs">K</Kbd>
              </div>
            )
          }
          styles={{
            root: navLink(collapsed ?? false),
          }}
          onClick={() => spotlight.open()}
        />
      ) : (
        <ActionIcon variant="transparent" onClick={() => spotlight.open()}>
          <IconSearch />
        </ActionIcon>
      )}

      <Spotlight
        color="black"
        actions={actions}
        query={query}
        onQueryChange={setQuery}
        maxHeight="80vh"
        nothingFound={t(locale, "noResults")}
        filter={(_, a) => a}
        scrollable
        shortcut={["mod + K", "mod + P", "/"]}
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          rightSection: (
            <p className="text-xs">
              {companyActions.length + personActions.length}
            </p>
          ),
          placeholder: t(locale, "searchCompaniesOrPeople"),
        }}
      />
    </>
  );
}
