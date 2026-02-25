import { MEINL_WEB_API } from "@/app/lib/constants";

export async function POST(request: Request) {
  const res = await fetch(`${MEINL_WEB_API}/office/company/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(await request.json()),
  });

  if (!res.ok) {
    return new Response("Failed to update company", { status: res.status });
  }

  return new Response("Company updated successfully.", { status: 200 });
}
