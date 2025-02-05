import { Button, Tooltip } from "@mantine/core";
import { IconDeviceMobile, IconMail, IconPhone } from "@tabler/icons-react";

export default function Contact({
  email,
  phone,
  mobile,
}: {
  email?: string;
  phone?: string;
  mobile?: string;
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
            Festnetz anrufen
          </Button>
        </Tooltip>
      )}
      {mobile && (
        <Tooltip label={mobile} withArrow>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconDeviceMobile size={16} />}
          >
            Mobil anrufen
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
