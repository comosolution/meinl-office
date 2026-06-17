import { getDocsFiles } from "@/app/lib/markdown";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const { doc } = await searchParams;
  const docs = await getDocsFiles();

  const selectedSlug = doc ?? docs[0].slug;
  const selectedDoc = docs.find((d) => d.slug === selectedSlug) ?? docs[0];

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1>Docs</h1>
      <div className="flex gap-8 h-full min-h-0">
        <nav className="flex flex-col gap-1 w-48 shrink-0">
          {docs.map((d) => (
            <Link
              key={d.slug}
              href={`?doc=${d.slug}`}
              className={`px-4 py-2 rounded-(--mantine-radius-default) transition-all ${
                d.slug === selectedSlug
                  ? "bg-(--mantine-color-blue-light) text-(--mantine-color-blue-light-color) font-bold"
                  : "hover:bg-(--background-subtle)"
              }`}
            >
              {d.title}
            </Link>
          ))}
        </nav>
        <article
          className="flex-1 flex flex-col gap-2 prose"
          dangerouslySetInnerHTML={{ __html: selectedDoc.html }}
        />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}
