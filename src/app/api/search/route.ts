import { MEINL_WEB_API } from "@/app/lib/config";

export async function POST(request: Request) {
  const { type, search, source, service, user } = await request.json();

  if (!type || !search) {
    return new Response("Options missing in body", { status: 400 });
  }

  const res = await fetch(`${MEINL_WEB_API}/office/search/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search, source, service, user }),
  });

  if (!res.ok) {
    return new Response(await res.text(), { status: res.status });
  }

  if (res.status === 204) {
    return Response.json([]);
  }

  const data = await res.json();
  return Response.json(data, { status: 200 });
}
