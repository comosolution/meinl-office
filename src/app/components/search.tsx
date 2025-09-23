import { Avatar, Kbd, NavLink } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconBuildingWarehouse, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "../lib/hooks";
import { Company, Person } from "../lib/interfaces";
import { navLink } from "../lib/styles";
import { getAvatarColor } from "../lib/utils";

export default function Search({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const getData = async () => {
      if (debouncedQuery.trim() === "") {
        setCompanies([]);
        setPersons([]);
        return;
      }

      const fetchResults = async <T,>(
        type: "companies" | "persons"
      ): Promise<T[]> => {
        const res = await fetch("/api/search", {
          method: "POST",
          body: JSON.stringify({ type, search: debouncedQuery }),
        });
        return res.json();
      };

      const [allCompanies, allPersons] = await Promise.all([
        fetchResults<Company>("companies"),
        fetchResults<Person>("persons"),
      ]);

      setCompanies(allCompanies);
      setPersons(allPersons);
    };

    getData();
  }, [debouncedQuery]);

  const companyActions: SpotlightActionData[] = companies
    .filter((c) => c.name1 !== null)
    .map((c, index) => ({
      id: `company-${index}-${c.kdnr}`,
      label: c.name1,
      description: `${c.kdnr} • ${c.land}–${c.plz} ${c.ort}`,
      onClick: () => router.push(`/company/${c.kdnr}`),
      leftSection: (
        <Avatar size={48} color={getAvatarColor(c.kdnr)} name={c.name1[0]}>
          <IconBuildingWarehouse />
        </Avatar>
      ),
    }))
    .sort((a, b) =>
      a.label!.localeCompare(b.label!, "de", { sensitivity: "base" })
    );

  const personActions: SpotlightActionData[] = persons
    .map((p, index) => ({
      id: `person-${index}-${p.b2bnr}`,
      label: `${p.vorname} ${p.nachname}`,
      description: `${p.b2bnr || p.kdnr} • ${p.jobpos || "Mitarbeiter"} bei ${
        p.name1
      }`,
      onClick: () => router.push(`/person/${p.b2bnr}`),
      leftSection: (
        <Avatar
          size={48}
          color={getAvatarColor(p.kdnr)}
          name={`${p.vorname[0]} ${p.nachname[0]}`}
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
        variant="light"
        active
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
        limit={20}
        actions={actions}
        query={query}
        onQueryChange={setQuery}
        maxHeight="80vh"
        nothingFound="Keine Treffer."
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
