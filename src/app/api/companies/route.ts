import { MEINL_WEB_API } from "@/app/lib/constants";

export async function GET() {
  const res = await fetch(`${MEINL_WEB_API}/companies`);
  const companies = await res.json();
  return Response.json(companies);
}
