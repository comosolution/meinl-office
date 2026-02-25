import { RMA_WEB_API } from "@/app/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
    const response = await fetch(`${RMA_WEB_API}/ticket/${id}/de-de`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch ticket details from MEINL API" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
