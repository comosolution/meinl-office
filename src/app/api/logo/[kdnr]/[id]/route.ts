import { MEINL_WEB_API } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ kdnr: string; id: string }> }
) {
  const { kdnr, id } = await params;

  try {
    const contentLength = request.headers.get("content-length");
    const hasBody = contentLength && parseInt(contentLength) > 0;

    if (!hasBody) {
      const response = await fetch(
        `${MEINL_WEB_API}/office/upload/logo/${kdnr}/${id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: "Löschen fehlgeschlagen." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Logo erfolgreich gelöscht.",
      });
    }

    const formData = await request.formData();

    const response = await fetch(
      `${MEINL_WEB_API}/office/upload/logo/${kdnr}/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Upload fehlgeschlagen." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Datei erfolgreich weitergeleitet.",
    });
  } catch (error) {
    console.error("Upload proxy error:", error);
    return NextResponse.json(
      { error: "Ein unbekannter Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
