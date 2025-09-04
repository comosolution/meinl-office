import { Avatar, Kbd, NavLink } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import {
  IconBuildingWarehouse,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOffice } from "../context/officeContext";
import { navLink } from "../lib/styles";
import { getAvatarColor } from "../lib/utils";

export default function Search({ collapsed }: { collapsed: boolean }) {
  const { companies, employees } = useOffice();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const companyActions: SpotlightActionData[] = companies
    .filter((c) => {
      const keywords = query.trim().toLowerCase().split(" ");
      return keywords.every((keyword) =>
        [c.kdnr.toString(), c.name1, c.name2, c.plz, c.ort, c.matchcode]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword))
      );
    })
    .map((c, index) => ({
      id: `company-${index}-${c.kdnr}-${c.matchcode}`,
      label: c.name1,
      description: `${c.kdnr} • ${c.land}–${c.plz} ${c.ort}`,
      onClick: () => router.push(`/company/${c.kdnr}`),
      leftSection: (
        <Avatar size={48} color={getAvatarColor(c.kdnr)} name={c.name1[0]} />
      ),
      rightSection: <IconBuildingWarehouse size={24} color="black" />,
    }));

  const employeeActions: SpotlightActionData[] = employees
    .filter((p) => {
      const keywords = query.trim().toLowerCase().split(" ");
      return keywords.every((keyword) =>
        [
          p.vorname,
          p.nachname,
          p.email,
          p.telefon,
          p.mobil,
          p.jobpos,
          p.abteilung,
          p.b2bnr,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword))
      );
    })
    .map((p, index) => ({
      id: `person-${index}-${p.kdnr}-${p.b2bnr}`,
      label: `${p.vorname} ${p.nachname}`,
      description: `${p.b2bnr || p.kdnr} • ${p.jobpos || "Mitarbeiter"} bei ${
        companies.find((c) => c.kdnr === p.kdnr)?.name1
      } • ${p.email}`,
      onClick: () => router.push(`/person/${p.b2bnr}`),
      leftSection: (
        <Avatar
          size={48}
          color={getAvatarColor(p.kdnr)}
          name={`${p.vorname[0]} ${p.nachname[0]}`}
        />
      ),
      rightSection: <IconUserCircle size={24} color="black" />,
    }));

  const actions: SpotlightActionData[] = [
    ...companyActions,
    ...employeeActions,
  ].sort((a, b) =>
    a.label!.localeCompare(b.label!, "de", { sensitivity: "base" })
  );

  return (
    <>
      <NavLink
        label="Suche"
        title="Suche"
        variant="light"
        active
        leftSection={<IconSearch size={20} />}
        rightSection={
          !collapsed && (
            <div>
              <Kbd size="xs">Ctrl</Kbd>
              <Kbd size="xs">K</Kbd>
            </div>
          )
        }
        className={navLink(collapsed)}
        onClick={() => spotlight.open()}
      />

      <Spotlight
        color="black"
        limit={16}
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
