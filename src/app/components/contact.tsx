import { Button, Tooltip } from "@mantine/core";
import { IconMail, IconPhone } from "@tabler/icons-react";

export default function Contact({
  email,
  phone,
}: {
  email?: string;
  phone?: string;
}) {
  return (
    <div className="flex gap-2">
      {phone && (
        <Tooltip label={phone} withArrow>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconPhone size={16} />}
          >
            Anrufen
          </Button>
        </Tooltip>
      )}
      {email && (
        <Tooltip label={email} withArrow>
          <Button size="xs" leftSection={<IconMail size={16} />}>
            Mail senden
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
