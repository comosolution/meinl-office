import { notFound } from "next/navigation";
import App from "../components/app";
import { OfficeProvider } from "../context/officeContext";

export default async function SourceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ source: string }>;
}>) {
  const { source } = await params;

  if (source !== "de" && source !== "us") {
    notFound();
  }

  return (
    <OfficeProvider>
      <App>{children}</App>
    </OfficeProvider>
  );
}
