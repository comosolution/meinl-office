import { DHL_API_RETURN_LABEL, DHL_API_TOKEN } from "@/app/lib/config";
import { isPreview } from "@/app/lib/utils";

export async function POST(request: Request) {
  const user = isPreview
    ? process.env.DHL_API_USER
    : process.env.DHL_API_USER_PROD;
  const pass = isPreview
    ? process.env.DHL_API_PASSWORD
    : process.env.DHL_API_PASSWORD_PROD;
  const clientId = process.env.DHL_API_ID;
  const clientSecret = process.env.DHL_API_SECRET;

  if (!user || !pass || !clientId || !clientSecret) {
    return Response.json(
      { error: "API credentials not configured" },
      { status: 500 },
    );
  }

  try {
    const tokenOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        username: user,
        password: pass,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    };
    const tokenResponse = await fetch(DHL_API_TOKEN, tokenOptions);
    const tokenData = await tokenResponse.json();
    const body = await request.json();

    const options = {
      method: "POST",
      headers: {
        authorization: "Bearer " + tokenData.access_token,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(DHL_API_RETURN_LABEL, options);

    if (!response.ok) {
      return new Response(await response.text(), { status: response.status });
    }

    const data = await response.json();

    return Response.json({
      pdf: data.label.b64,
      shipmentNo: data.shipmentNo,
    });
  } catch (error) {
    console.error(error);
  }
}
