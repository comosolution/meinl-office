import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface ChangelogSection {
  version: string;
  date: string;
  html: string;
}

export interface ChangelogData {
  title: string;
  sections: ChangelogSection[];
}

export async function getMarkdownContent(): Promise<ChangelogData> {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");

  if (!fs.existsSync(changelogPath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(changelogPath, "utf-8");
  const tree = unified().use(remarkParse).parse(fileContent);

  let title = "";
  const sections: ChangelogSection[] = [];

  // Extract h1 title
  visit(tree, "heading", (node, index, parent) => {
    if (node.depth === 1 && title === "") {
      const firstTextNode = node.children.find(
        (child) => child.type === "text",
      );
      if (firstTextNode) {
        title = firstTextNode.value;
        if (parent && typeof index === "number") {
          parent.children.splice(index, 1);
        }
      }
    }
  });

  const children = tree.children as Array<{
    type: string;
    depth?: number;
    children?: Array<{ type: string; value?: string }>;
  }>;

  let currentVersion = "";
  let currentDate = "";
  let currentContent: typeof tree | null = null;

  for (const child of children) {
    if (child.type === "heading" && child.depth === 2) {
      if (currentVersion && currentContent) {
        const file = await unified()
          .use(remarkParse, { breaks: true })
          .use(remarkRehype)
          .use(rehypeStringify)
          .run(currentContent);
        const html = unified().use(rehypeStringify).stringify(file);
        sections.push({ version: currentVersion, date: currentDate, html });
      }

      const textNode = child.children?.find((c) => c.type === "text");
      if (textNode?.value) {
        const match = textNode.value.match(
          /\[(\d+\.\d+\.\d+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/,
        );
        if (match) {
          currentVersion = match[1];
          currentDate = match[2];
          currentContent = { ...tree, children: [] };
        }
      }
    } else if (currentContent) {
      if (
        child.type !== "heading" ||
        (child.type === "heading" && child.depth !== 2)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        currentContent.children.push(child as any);
      }
    }
  }

  if (currentVersion && currentContent) {
    const file = await unified()
      .use(remarkParse, { breaks: true })
      .use(remarkRehype)
      .use(rehypeStringify)
      .run(currentContent);
    const html = unified().use(rehypeStringify).stringify(file);
    sections.push({ version: currentVersion, date: currentDate, html });
  }

  return { title, sections };
}
