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
    <Button.Group>
      {phone && (
        <Tooltip label={phone} withArrow>
          <Button variant="light" leftSection={<IconPhone size={16} />}>
            Festnetz anrufen
          </Button>
        </Tooltip>
      )}
      {mobile && (
        <Tooltip label={mobile} withArrow>
          <Button variant="light" leftSection={<IconDeviceMobile size={16} />}>
            Mobil anrufen
          </Button>
        </Tooltip>
      )}
      {email && (
        <Tooltip label={email} withArrow>
          <Button leftSection={<IconMail size={16} />}>Mail senden</Button>
        </Tooltip>
      )}
    </Button.Group>
  );
}
