import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET() {
  const res = await fetch(`${MEINL_WEB_API}/customer`);
  const companies = await res.json();
  return Response.json(companies);
}

export async function POST(request: Request) {
  const res = await fetch(`${MEINL_WEB_API}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  });

  if (!res.ok) {
    return new Response("Failed to update customer", { status: res.status });
  }

  return new Response("Customer updated successfully.", { status: 200 });
}
