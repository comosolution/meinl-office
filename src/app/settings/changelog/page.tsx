import { getMarkdownContent } from "@/app/lib/markdown";
import { defaultBorder } from "@/app/lib/styles";
import { Badge } from "@mantine/core";
import { formatDistance } from "date-fns";

export default async function ChangelogPage() {
  const { title, sections } = await getMarkdownContent();

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1> {title}</h1>
      {sections.map((section, index) => (
        <div key={index} className="pt-8" style={{ borderTop: defaultBorder }}>
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-8">
            <div className="flex items-baseline gap-2 lg:w-1/4">
              <Badge size="xl" variant="light">
                {section.version}
              </Badge>
              <p className="dimmed text-xs">
                {formatDistance(new Date(section.date), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </div>

            <article
              className="lg:w-3/4 prose"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          </div>
        </div>
      ))}
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}
