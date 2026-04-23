import { notifications } from "@mantine/notifications";

export type ResendAttachment = {
  filename: string;
  type: string;
  data: string;
};

export type MailRequest = {
  receiver: string;
  subject?: string;
  content: string;
  attachment?: ResendAttachment;
};

export async function sendResendMail(options: MailRequest): Promise<void> {
  try {
    const response = await fetch("/api/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const error = payload?.error || `Failed to send mail: ${response.status}`;
      console.error("Failed to send mail via Resend:", error);
      notifications.show({
        title: "Warnung",
        message: "Bestätigungsmail konnte nicht versendet werden.",
        color: "yellow",
      });
      return;
    }
  } catch (err) {
    const error =
      err instanceof Error ? err.message : "Failed to send mail: Unknown error";
    console.error("Error sending mail via Resend:", error);
    notifications.show({
      title: "Warnung",
      message: "Bestätigungsmail konnte nicht versendet werden.",
      color: "yellow",
    });
  }
}
