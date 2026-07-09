import { AdUser } from "@/app/lib/interfaces";

let cache: AdUser[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

export async function GET() {
  const clientId = process.env.AZURE_AD_CLIENT_ID;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
  const tenantId = process.env.AZURE_AD_TENANT_ID;

  if (!clientId || !clientSecret || !tenantId) {
    return Response.json(
      { error: "Azure AD credentials not configured" },
      { status: 500 },
    );
  }

  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    return Response.json(cache);
  }

  try {
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: "https://graph.microsoft.com/.default",
        }),
      },
    );

    if (!tokenRes.ok) {
      return new Response(await tokenRes.text(), { status: tokenRes.status });
    }

    const { access_token } = await tokenRes.json();

    const usersRes = await fetch(
      "https://graph.microsoft.com/v1.0/users?$select=displayName,mail&$top=999&$orderby=displayName",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    if (!usersRes.ok) {
      return new Response(await usersRes.text(), { status: usersRes.status });
    }

    const data = await usersRes.json();
    const users: AdUser[] = (
      data.value as { displayName: string; mail: string | null }[]
    )
      .filter((u) => u.mail)
      .map((u) => ({ displayName: u.displayName, mail: u.mail as string }));

    cache = users;
    cacheTime = Date.now();

    return Response.json(users);
  } catch (error) {
    console.error("Error fetching AD users:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
