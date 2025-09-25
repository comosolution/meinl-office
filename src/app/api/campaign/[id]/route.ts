import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await fetch(`${MEINL_WEB_API}/campaign/${id}`);
  const data = await res.json();
  return Response.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await fetch(`${MEINL_WEB_API}/campaign/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return new Response("Failed to delete", { status: res.status });
  }

  return new Response("Success", { status: 200 });
}
