import { Avatar, Kbd, NavLink } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOffice } from "../context/officeContext";
import { navLink } from "../lib/styles";
import { getAvatarColor } from "../lib/utils";

export default function Search({ collapsed }: { collapsed: boolean }) {
  const { companies } = useOffice();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const data: SpotlightActionData[] = companies
    .filter((c) => {
      const keywords = query.trim().toLowerCase().split(" ");
      return keywords.every((keyword) =>
        [c.kdnr.toString(), c.name1, c.name2, c.plz, c.ort, c.matchcode].some(
          (value) => value.toLowerCase().includes(keyword)
        )
      );
    })
    .map((s, index) => {
      return {
        id: `${index}-${s.kdnr}-${s.matchcode}`,
        label: s.name1,
        description: `${s.kdnr} • ${s.matchcode} • ${s.land}–${s.plz} ${s.ort}`,
        onClick: () => {
          router.push(`/company/${s.kdnr}`);
        },
        leftSection: (
          <Avatar size={48} radius="md" color={getAvatarColor(s.kdnr)}>
            {s.name1[0].toUpperCase()}
          </Avatar>
        ),
      };
    });

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
        onClick={() => {
          spotlight.open();
        }}
      />
      <Spotlight
        color="black"
        limit={16}
        actions={data}
        query={query}
        onQueryChange={setQuery}
        maxHeight="80vh"
        nothingFound="Keine Treffer."
        filter={(_, actions) => actions}
        scrollable
        radius="md"
        shortcut={["mod + K", "mod + P", "/"]}
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          rightSection: data.length,
          placeholder: "Firma suchen ...",
        }}
      />
    </>
  );
}
