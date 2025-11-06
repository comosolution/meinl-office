import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET() {
  try {
    const res = await fetch(`${MEINL_WEB_API}/campaign`);

    if (res.status === 204) {
      return Response.json([]);
    }

    if (!res.ok) {
      return Response.json(
        { error: `Failed to fetch campaigns (${res.status})` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return Response.json(data || []);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return Response.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
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
