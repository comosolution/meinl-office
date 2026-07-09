import { getDocsFiles } from "@/app/lib/markdown";
import { Suspense } from "react";
import { DocContent } from "../../components/help/docContent";

export default async function Page() {
  const docs = await getDocsFiles();

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1>Docs</h1>
      <Suspense>
        <DocContent docs={docs} />
      </Suspense>
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}
