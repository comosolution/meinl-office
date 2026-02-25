import { RMA_WEB_API } from "@/app/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticket: string; lfdn: string }> },
) {
  const { ticket, lfdn } = await params;

  const user = process.env.API_USER;
  const pass = process.env.API_PASSWORD;
  const b2bno = process.env.B2BNO;

  if (!user || !pass) {
    return Response.json(
      { error: "API credentials not configured" },
      { status: 500 },
    );
  }

  if (!b2bno) {
    return Response.json({ error: "B2BNO not configured" }, { status: 500 });
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    const response = await fetch(
      `${RMA_WEB_API}/download/file/${b2bno}/${ticket}/${lfdn}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch file from MEINL API" },
        { status: response.status },
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("content-disposition") ||
      `attachment; filename="${lfdn}"`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
