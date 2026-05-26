import { isPreview } from "@/app/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kdnr: string }>;
}): Promise<Metadata> {
  const { kdnr } = await params;

  return { title: `${kdnr} - Meinl Office ${isPreview ? "(Dev)" : ""}` };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
