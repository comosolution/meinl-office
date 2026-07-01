import { MEINL_WEB_API } from "@/app/lib/config";

export async function GET() {
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
    const response = await fetch(`${MEINL_WEB_API}/office/test/error`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        b2bnr: "73003-001",
        user: "Schneider, Martin",
        kdnr: null,
        type: "M", // M = Eine Meldung, S = Stacktrace
      }),
    });

    if (!response.ok) {
      return new Response(await response.text(), { status: response.status });
    }
    const data = await response.json();

    return Response.json(data || []);
  } catch (err) {
    console.error("Error fetching error:", err);
    return Response.json({ error: "Failed to fetch error" }, { status: 500 });
  }
}
