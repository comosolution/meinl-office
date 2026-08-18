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
    const body = await request.json();

    const response = await fetch(`${MEINL_WEB_API}/office/filter`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(await response.text(), { status: response.status });
    }

    if (response.status === 204) {
      return Response.json([]);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching mailing filters:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const response = await fetch(`${MEINL_WEB_API}/office/filter`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(await response.text(), { status: response.status });
    }

    if (response.status === 204) {
      return Response.json({});
    }

    const data = await response.text();
    return Response.json(data);
  } catch (error) {
    console.error("Error deleting mailing filter:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
