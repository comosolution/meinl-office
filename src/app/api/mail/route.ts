import { MailRequest } from "@/app/lib/resend";
import { Resend } from "resend";

type ResendPayload = Parameters<
  NonNullable<typeof resend>["emails"]["send"]
>[0];

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = "no-reply@service.como-solution.de";

const resend = new Resend(RESEND_API_KEY);

export async function POST(request: Request) {
  if (!resend) {
    return Response.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 },
    );
  }

  let body: MailRequest;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { receiver, subject, content, attachment, attachments } = body;

  if (!receiver || !content) {
    return Response.json(
      { error: "receiver and content are required" },
      { status: 400 },
    );
  }

  const payload: ResendPayload = {
    from: RESEND_FROM_EMAIL,
    to: receiver,
    subject: subject || "Sendungsbestätigung",
    text: content,
  };

  const allAttachments = [
    ...(attachment ? [attachment] : []),
    ...(attachments ?? []),
  ];

  if (allAttachments.length > 0) {
    for (const a of allAttachments) {
      if (!a.filename || !a.type || !a.data) {
        return Response.json(
          { error: "attachment must include filename, type and data" },
          { status: 400 },
        );
      }
    }
    payload.attachments = allAttachments.map((a) => ({
      filename: a.filename,
      contentType: a.type,
      content: a.data,
    }));
  }

  try {
    const response = await resend.emails.send(payload);
    return Response.json(response);
  } catch (err) {
    console.error("Error sending mail via Resend:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
