import { MEINL_WEB_API } from "@/app/lib/config";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ source: string; id: string }> },
) {
  const { source, id } = await params;

  const res = await fetch(`${MEINL_WEB_API}/campaign/${source}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return new Response(await res.text(), { status: res.status });
  }

  return new Response("Success", { status: 200 });
}
