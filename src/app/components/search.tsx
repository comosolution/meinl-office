import { Button, Kbd, rem } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOffice } from "../context/officeContext";

export default function Search() {
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
      };
    });

  return (
    <>
      <Button
        variant="light"
        justify="left"
        leftSection={<IconSearch size={16} />}
        rightSection={
          <div className="text-black font-light">
            <Kbd size="xs">Ctrl</Kbd> + <Kbd size="xs">K</Kbd>
          </div>
        }
        onClick={() => {
          spotlight.open();
        }}
      >
        Suchen
      </Button>
      <Spotlight
        actions={data}
        query={query}
        onQueryChange={setQuery}
        nothingFound="Keine Treffer."
        filter={(_, actions) => actions}
        scrollable
        radius="md"
        shortcut={["mod + K", "mod + P", "/"]}
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Firma suchen ...",
        }}
      />
    </>
  );
}
