import { ChangelogTableOfContents } from "@/app/components/changelog/changelogTableOfContents";
import { getMarkdownContent } from "@/app/lib/markdown";
import { defaultBorder } from "@/app/lib/styles";
import { Badge, Tooltip } from "@mantine/core";
import { formatDistance } from "date-fns";

export default async function ChangelogPage() {
  const { title, sections } = await getMarkdownContent();

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1>{title}</h1>
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-8 h-full min-h-0">
        <div className="flex flex-col gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={index === 0 ? "" : "pt-8"}
              style={{ borderTop: index === 0 ? "none" : defaultBorder }}
            >
              <div className="flex flex-col lg:flex-row lg:items-baseline gap-8">
                <div className="flex items-baseline gap-2 lg:w-1/4">
                  <Badge
                    id={`version-${section.version}`}
                    data-changelog-version
                    size="xl"
                    variant={
                      section.version?.endsWith(".0.0") ? "filled" : "light"
                    }
                  >
                    {section.version}
                  </Badge>
                  <Tooltip
                    label={new Date(section.date).toLocaleDateString()}
                    position="right"
                    withArrow
                  >
                    <p className="dimmed text-xs">
                      {formatDistance(new Date(section.date), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </Tooltip>
                </div>
                <article
                  className="flex-1 flex flex-col gap-2 prose"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </div>
            </div>
          ))}
        </div>
        <aside className="w-full md:w-24 shrink-0 md:sticky top-4 self-start flex flex-col gap-2">
          <ChangelogTableOfContents sections={sections} />
        </aside>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}
