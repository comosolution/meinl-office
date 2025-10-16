import { Avatar, Kbd, NavLink } from "@mantine/core";
import { Spotlight, spotlight, SpotlightActionData } from "@mantine/spotlight";
import {
  IconBuildings,
  IconBuildingWarehouse,
  IconSearch,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "../lib/hooks";
import { Dealer, Person } from "../lib/interfaces";
import { navLink } from "../lib/styles";
import { fetchResults, getAvatarColor } from "../lib/utils";

export default function Search({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Dealer[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const getData = async () => {
      if (debouncedQuery.trim() === "") {
        setCompanies([]);
        setPersons([]);
        return;
      }

      const [allCompanies, allPersons] = await Promise.all([
        fetchResults<Dealer>("dealers", debouncedQuery),
        fetchResults<Person>("persons", debouncedQuery),
      ]);

      setCompanies(allCompanies);
      setPersons(allPersons);
    };

    getData();
  }, [debouncedQuery]);

  const companyActions: SpotlightActionData[] = companies
    .filter((c) => c.name1 !== null)
    .map((c, index) => ({
      id: `company-${index}-${c.id}-${c.kdnr}`,
      label: c.name1,
      description: `${c.plz} ${c.ort} ${c.land} ${
        c.id === 0 ? "" : `– ${c.brand}`
      }`,
      onClick: () =>
        router.push(`/company/${c.kdnr}${c.id === 0 ? "" : `/${c.id}`}`),
      rightSection: <p className="text-xs dimmed">{c.kdnr}</p>,
      leftSection: (
        <Avatar size={32} variant="filled" color={getAvatarColor(c.kdnr)}>
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
      description: `${p.jobpos || "Mitarbeiter"} bei ${p.name1}`,
      onClick: () => router.push(`/person/${p.id}`),
      rightSection: <p className="text-xs dimmed">{p.b2bnr}</p>,
      leftSection: (
        <Avatar
          size={32}
          color={getAvatarColor(p.kdnr)}
          name={`${p.nachname[0]} ${p.vorname[0]}`}
        />
      ),
    }))
    .sort((a, b) =>
      a.label!.localeCompare(b.label!, "de", { sensitivity: "base" })
    );

  const actions: SpotlightActionData[] = [...companyActions, ...personActions];

  return (
    <>
      <NavLink
        label="Suche"
        title="Suche"
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
          root: navLink(collapsed),
        }}
        onClick={() => spotlight.open()}
      />

      <Spotlight
        color="black"
        limit={100}
        actions={actions}
        query={query}
        onQueryChange={setQuery}
        maxHeight="80vh"
        nothingFound=""
        filter={(_, a) => a}
        scrollable
        shortcut={["mod + K", "mod + P", "/"]}
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          rightSection: <p className="text-xs">{actions.length}</p>,
          placeholder: "Firma oder Mitarbeiter suchen ...",
        }}
      />
    </>
  );
}
