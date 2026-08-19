import { CLEVERREACH_API, CLEVERREACH_TOKEN_URL } from "@/app/lib/config";

interface CleverReachPerson {
  email: string;
  anrede?: string;
  vorname?: string;
  nachname?: string;
  name1?: string;
}

export async function POST(request: Request) {
  const clientId = process.env.CLEVERREACH_CLIENT_ID;
  const clientSecret = process.env.CLEVERREACH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json(
      {
        error:
          "CLEVERREACH_CLIENT_ID / CLEVERREACH_CLIENT_SECRET not configured",
      },
      { status: 500 },
    );
  }

  const { name, persons } = (await request.json()) as {
    name?: string;
    persons?: CleverReachPerson[];
  };

  if (!name || !Array.isArray(persons) || persons.length === 0) {
    return Response.json(
      { error: "name and persons are required" },
      { status: 400 },
    );
  }

  const tokenResponse = await fetch(CLEVERREACH_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    return Response.json(
      { error: "Failed to authenticate with CleverReach", details: tokenData },
      { status: 502 },
    );
  }

  const headers = {
    Authorization: `Bearer ${tokenData.access_token}`,
    "Content-Type": "application/json",
  };

  const groupResponse = await fetch(`${CLEVERREACH_API}/groups.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!groupResponse.ok) {
    return new Response(await groupResponse.text(), {
      status: groupResponse.status,
    });
  }

  const group = await groupResponse.json();
  const groupId = group.id;

  const now = Math.floor(Date.now() / 1000);

  const receivers = persons
    .filter((p) => p.email)
    .map((p) => ({
      email: p.email,
      registered: now,
      activated: now,
      source: "Meinl Office Mailing",
      global_attributes: {
        anrede: p.anrede || "",
        vorname: p.vorname || "",
        nachname: p.nachname || "",
        firma: p.name1 || "",
      },
    }));

  const receiversResponse = await fetch(
    `${CLEVERREACH_API}/groups/${groupId}/receivers/upsert.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(receivers),
    },
  );

  if (!receiversResponse.ok) {
    return new Response(await receiversResponse.text(), {
      status: receiversResponse.status,
    });
  }

  const result = await receiversResponse.json();

  return Response.json({ groupId, groupName: name, ...result });
}
