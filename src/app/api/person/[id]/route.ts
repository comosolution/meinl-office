import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await fetch(`${MEINL_WEB_API}/office/person/${id}`);

  if (!res.ok) {
    return Response.json("Es ist ein Fehler aufgetreten.", {
      status: res.status,
    });
  }

  if (res.status === 204) {
    return Response.json(`Person mit ID ${id} nicht gefunden.`, {
      status: 404,
    });
  }

  const data = await res.json();
  return Response.json(data);
}
