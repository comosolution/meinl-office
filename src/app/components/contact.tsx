import { Button, Tooltip } from "@mantine/core";
import { IconDeviceMobile, IconMail, IconPhone } from "@tabler/icons-react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function Contact({
  email,
  phone,
  mobile,
}: {
  email?: string;
  phone?: string;
  mobile?: string;
}) {
  const { locale } = useOffice();

  const buttons = [];

  if (phone) {
    buttons.push({
      label: t(locale, "contactPhone"),
      value: phone,
      href: `tel:${phone}`,
      icon: IconPhone,
    });
  }
  if (mobile) {
    buttons.push({
      label: t(locale, "contactMobile"),
      value: mobile,
      href: `tel:${mobile}`,
      icon: IconDeviceMobile,
    });
  }
  if (email) {
    buttons.push({
      label: t(locale, "contactEmail"),
      value: email,
      href: `mailto:${email}`,
      icon: IconMail,
    });
  }

  return (
    <>
      {buttons.map((b, i) => (
        <Tooltip key={i} label={b.value} withArrow>
          <Button
            component="a"
            href={b.href}
            variant="transparent"
            leftSection={<b.icon size={16} />}
          >
            {b.label}
          </Button>
        </Tooltip>
      ))}
    </>
  );
}
