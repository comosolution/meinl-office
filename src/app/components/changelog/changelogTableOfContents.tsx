"use client";
import { ChangelogSection } from "@/app/lib/markdown";
import { TableOfContents } from "@mantine/core";

export function ChangelogTableOfContents({
  sections,
}: {
  sections: ChangelogSection[];
}) {
  const initialData = sections.map((s) => ({
    depth: 1,
    value: s.version,
    id: `version-${s.version}`,
    getNode: () => document.getElementById(`version-${s.version}`),
  }));

  return (
    <TableOfContents
      color="yellow"
      size="sm"
      variant="light"
      scrollSpyOptions={{
        selector: "[data-changelog-version]",
        getDepth: () => 1,
        getValue: (element) => element.textContent || "",
      }}
      initialData={initialData}
      getControlProps={({ data }) => ({
        children: data.value,
        onClick: () =>
          document.getElementById(data.id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      })}
    />
  );
}
