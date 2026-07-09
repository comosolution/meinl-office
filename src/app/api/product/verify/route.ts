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
  const body = await request.json();

  try {
    const res = await fetch(`${MEINL_WEB_API}/rma/verify/itemnumber`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return new Response(await res.text(), { status: res.status });
    }

    if (res.status === 204) {
      return Response.json({ verified: false }, { status: 200 });
    }

    return Response.json({ verified: true }, { status: 200 });
  } catch (error) {
    console.error("Error verifying:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
