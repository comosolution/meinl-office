import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${MEINL_WEB_API}/campaign/product`, {
    method: "POST",
    headers: {
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
    return Response.json([], { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
