import { RMA_WEB_API } from "@/app/lib/constants";

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
    const body = await request.json();

    const response = await fetch(`${RMA_WEB_API}/tracking`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to add tracking info to MEINL API" },
        { status: response.status },
      );
    }

    const data = await response.text();
    return Response.json(data);
  } catch (error) {
    console.error("Error adding tracking:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
