import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(request: Request) {
  try {
    const res = await fetch(`${MEINL_WEB_API}/office/person`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
    });

    if (res.status === 204) {
      return Response.json([]);
    }

    if (!res.ok) {
      return new Response("Failed to fetch person", { status: res.status });
    }

    const data = await res.json();

    return Response.json(data || []);
  } catch (err) {
    console.error("Error fetching person:", err);
    return Response.json({ error: "Failed to fetch person" }, { status: 500 });
  }
}
