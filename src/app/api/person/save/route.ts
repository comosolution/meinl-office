import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(request: Request) {
  const res = await fetch(`${MEINL_WEB_API}/office/person/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  });

  if (!res.ok) {
    return new Response("Failed to update person", { status: res.status });
  }

  const resText = await res.text();
  return new Response(resText, { status: 200 });
}
