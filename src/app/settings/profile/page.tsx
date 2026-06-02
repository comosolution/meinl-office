"use client";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { isPreview } from "@/app/lib/utils";
import {
  Avatar,
  Badge,
  Button,
  Paper,
  Popover,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconCircleCheckFilled,
  IconLogout,
  IconMoon,
  IconSun,
  IconTrash,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

export default function Page() {
  const { data: session } = useSession();
  const { locale, setLocale, source, setSource, service, setService } =
    useOffice();
  const { setColorScheme } = useMantineColorScheme();

  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");

  const [popoverOpened, { open: openPopover, close: closePopover }] =
    useDisclosure(false);

  function handleClearData() {
    localStorage.clear();
    closePopover();
    window.location.reload();
  }

  return (
    <main className="flex flex-col gap-2 p-4">
      <div className="flex flex-col md:flex-row justify-end gap-2">
        <Button
          color="dark"
          leftSection={<IconLogout size={14} />}
          onClick={() => signOut()}
        >
          {t(locale, "logout")}
        </Button>
      </div>

      <header className="flex items-center gap-4 py-4">
        <Avatar variant="filled" size={72} name={session?.user?.name ?? ""} />
        <div className="flex flex-col gap-1 w-full">
          <h1>{session?.user?.name}</h1>
          <p>{session?.user?.email}</p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <Paper p="md">
          <div className="flex flex-col gap-2">
            <h2>{t(locale, "settings")}</h2>
            <div className="flex justify-between items-baseline gap-2">
              <p>{t(locale, "language")}</p>
              <SegmentedControl
                value={locale}
                onChange={(value) => setLocale(value as "de" | "en")}
                data={[
                  {
                    label: (
                      <div className="flex items-center justify-center gap-2">
                        <ReactCountryFlag countryCode="DE" />
                        <span>Deutsch</span>
                      </div>
                    ),
                    value: "de",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-center gap-2">
                        <ReactCountryFlag countryCode="US" />
                        <span>English</span>
                      </div>
                    ),
                    value: "en",
                  },
                ]}
              />
            </div>
            <hr />
            {isPreview && (
              <>
                <div className="flex justify-between items-baseline gap-2">
                  <p>{t(locale, "location")}</p>
                  <SegmentedControl
                    value={source}
                    onChange={(value) =>
                      setSource(value as "OFFGUT" | "OFFUSA")
                    }
                    data={[
                      {
                        label: (
                          <div className="flex items-center justify-center gap-2">
                            <ReactCountryFlag countryCode="DE" svg />
                            <span>Deutschland</span>
                          </div>
                        ),
                        value: "OFFGUT",
                      },
                      {
                        label: (
                          <div className="flex items-center justify-center gap-2">
                            <ReactCountryFlag countryCode="US" svg />
                            <span>USA</span>
                          </div>
                        ),
                        value: "OFFUSA",
                      },
                    ]}
                  />
                </div>
                <hr />
              </>
            )}
            <div className="flex justify-between items-baseline gap-2">
              <p>Theme</p>
              <SegmentedControl
                value={selectedTheme}
                onChange={(value) => {
                  const theme = value as "light" | "dark";
                  setSelectedTheme(theme);
                  setColorScheme(theme);
                }}
                data={[
                  {
                    label: (
                      <div className="flex items-center justify-center gap-2">
                        <IconSun size={16} />
                        <span>{t(locale, "light")}</span>
                      </div>
                    ),
                    value: "light",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-center gap-2">
                        <IconMoon size={16} />
                        <span>{t(locale, "dark")}</span>
                      </div>
                    ),
                    value: "dark",
                  },
                ]}
              />
            </div>
            {source === "OFFGUT" && (
              <>
                <hr />
                <div className="flex justify-between items-baseline gap-2">
                  <p>{t(locale, "companies")}</p>
                  <SegmentedControl
                    data={["B2B", "B2C"]}
                    value={service}
                    onChange={(value) => setService(value as "B2B" | "B2C")}
                  />
                </div>
              </>
            )}
            <div>
              <Popover
                opened={popoverOpened}
                onClose={closePopover}
                shadow="md"
                withArrow
              >
                <Popover.Target>
                  <Button
                    variant="light"
                    leftSection={<IconTrash size={16} />}
                    onClick={openPopover}
                    fullWidth
                    className="mt-4"
                  >
                    {t(locale, "clearData")}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <div className="flex flex-col gap-3">
                    <p>{t(locale, "clearDataConfirm")}</p>
                    <div className="flex justify-between gap-2">
                      <Button variant="transparent" onClick={closePopover}>
                        {t(locale, "cancel")}
                      </Button>
                      <Button
                        onClick={handleClearData}
                        leftSection={<IconCheck size={16} />}
                      >
                        {t(locale, "clearData")}
                      </Button>
                    </div>
                  </div>
                </Popover.Dropdown>
              </Popover>
            </div>
          </div>
        </Paper>
        <Paper p="md">
          <div className="flex flex-col gap-2">
            <h2>{t(locale, "roles")}</h2>
            {session?.user?.roles && session?.user?.roles?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {session.user.roles.map((r, i) => (
                  <Badge
                    key={i}
                    size="lg"
                    variant="outline"
                    leftSection={<IconCircleCheckFilled size={16} />}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="dimmed text-center p-4">{t(locale, "noRoles")}</p>
            )}
          </div>
        </Paper>
      </div>
    </main>
  );
}
