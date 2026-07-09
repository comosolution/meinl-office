"use client";
import { useOffice } from "@/app/context/officeContext";
import { DocFile } from "@/app/lib/markdown";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DocTableOfContents } from "./docTableOfContents";

export function DocContent({ docs }: { docs: DocFile[] }) {
  const { source } = useOffice();

  const searchParams = useSearchParams();

  const visibleDocs = docs.filter((d) => !d.hidden.includes(source));
  const requestedSlug = searchParams.get("doc");
  const selectedDoc =
    visibleDocs.find((d) => d.slug === requestedSlug) ?? visibleDocs[0];

  if (!selectedDoc) {
    return <p>Keine Dokumentation verfügbar.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full min-h-0">
      <aside className="w-full md:w-48 shrink-0 md:sticky top-4 self-start flex flex-col gap-2">
        <nav className="flex flex-col">
          {visibleDocs.map((d) => (
            <Link
              key={d.slug}
              href={`?doc=${d.slug}`}
              className={`px-4 py-2 rounded-(--mantine-radius-default) transition-all ${
                d.slug === selectedDoc.slug
                  ? "bg-(--mantine-color-blue-light) text-(--mantine-color-blue-light-color) font-bold"
                  : "hover:bg-(--background-subtle)"
              }`}
            >
              {d.title}
            </Link>
          ))}
        </nav>
        <DocTableOfContents
          key={selectedDoc.slug}
          headings={selectedDoc.headings}
        />
      </aside>
      <article
        className="flex-1 flex flex-col gap-4 prose"
        dangerouslySetInnerHTML={{ __html: selectedDoc.html }}
      />
    </div>
  );
}
