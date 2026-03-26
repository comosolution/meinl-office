import { MEINL_WEB_API } from "@/app/lib/constants";

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

  const res = await fetch(`${MEINL_WEB_API}/rma/product/typeahead`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return Response.json("Es ist ein Fehler aufgetreten.", {
      status: res.status,
    });
  }

  if (res.status === 204) {
    return Response.json("Kein Produkt gefunden.", {
      status: 404,
    });
  }

  const data = await res.json();
  return Response.json(data);
}
