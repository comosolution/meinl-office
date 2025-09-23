import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(request: Request) {
  const { type, search } = await request.json();

  if (!type || !search) {
    return new Response("Options missing in body", { status: 400 });
  }

  const res = await fetch(`${MEINL_WEB_API}/search/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search: search }),
  });

  if (!res.ok) {
    return new Response("Failed to search", { status: res.status });
  }

  const data = await res.json();
  return Response.json(data, { status: 200 });
}
