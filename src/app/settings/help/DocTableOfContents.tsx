"use client";
import { DocHeading } from "@/app/lib/markdown";
import { TableOfContents } from "@mantine/core";

export function DocTableOfContents({ headings }: { headings: DocHeading[] }) {
  const initialData = headings.map((h) => ({
    depth: h.depth,
    value: h.value,
    id: h.id,
    getNode: () => document.getElementById(h.id),
  }));

  return (
    <TableOfContents
      color="yellow"
      size="sm"
      variant="light"
      scrollSpyOptions={{ selector: "article h2, article h3" }}
      initialData={initialData}
      minDepthToOffset={2}
      getControlProps={({ data }) => ({
        children: data.value,
        style:
          data.depth === 3
            ? {
                fontSize: "var(--mantine-font-size-xs)",
                paddingLeft: "32px",
              }
            : undefined,
        onClick: () =>
          document.getElementById(data.id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      })}
    />
  );
}
