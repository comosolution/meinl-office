import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET() {
  const res = await fetch(`${MEINL_WEB_API}/campaign`);
  const data = await res.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const res = await fetch(`${MEINL_WEB_API}/campaign/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  });

  if (!res.ok) {
    return new Response("Failed to update campaign", { status: res.status });
  }

  return new Response("Customer updated successfully.", { status: 200 });
}
