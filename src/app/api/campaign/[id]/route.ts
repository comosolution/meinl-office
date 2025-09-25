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
