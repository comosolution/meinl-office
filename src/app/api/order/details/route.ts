import { MEINL_WEB_API } from "@/app/lib/config";

export async function POST(request: Request) {
  const user = process.env.API_USER;
  const pass = process.env.API_PASSWORD;

  if (!user || !pass) {
    return Response.json(
      { error: "API credentials not configured" },
      { status: 500 },
    );
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    const response = await fetch(`${MEINL_WEB_API}/order/details`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
    });

    if (response.status === 204) {
      return Response.json([]);
    }

    if (!response.ok) {
      return Response.json(
        { error: await response.text() },
        { status: response.status },
      );
    }
    const data = await response.json();

    return Response.json(data || []);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
