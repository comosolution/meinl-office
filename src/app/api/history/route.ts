import { RMA_WEB_API } from "@/app/lib/constants";

export async function POST(request: Request) {
  const user = process.env.API_USER;
  const pass = process.env.API_PASSWORD;
  const b2bno = process.env.B2BNO;
  const locale = process.env.LOCALE || "de-de";

  if (!user || !pass) {
    return Response.json(
      { error: "API credentials not configured" },
      { status: 500 },
    );
  }

  if (!b2bno) {
    return Response.json({ error: "B2BNO not configured" }, { status: 500 });
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    const body = await request.json();

    const response = await fetch(
      `${RMA_WEB_API}/history/add/${b2bno}/${locale}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to add history entry to MEINL API" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error adding history entry:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
