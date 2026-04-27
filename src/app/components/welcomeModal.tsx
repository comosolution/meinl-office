"use client";

import {
  Button,
  Paper,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";
import { IconHome, IconMoon, IconSun } from "@tabler/icons-react";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_WELCOME_KEY } from "../lib/constants";
import { t } from "../lib/i18n";
import Logo from "./logo";
import Title from "./title";

export default function WelcomeModal({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const { locale, setLocale, source, setSource } = useOffice();

  const [selectedSource, setSelectedSource] = useState<"OFFGUT" | "OFFUSA">(
    source,
  );
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");

  const { setColorScheme } = useMantineColorScheme();

  const handleSave = () => {
    setSource(selectedSource);
    setColorScheme(selectedTheme);
    localStorage.setItem(MEINL_OFFICE_WELCOME_KEY, "true");
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <Paper w={540} p="xl" shadow="xl" bg="var(--background)" withBorder>
        <div className="flex flex-col text-center gap-4">
          <header className="flex flex-col gap-1">
            <Logo />
            <Title />
            <p className="dimmed">{t(locale, "welcomeSub")}</p>
          </header>
          <SegmentedControl
            size="lg"
            fullWidth
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
          <SegmentedControl
            size="lg"
            fullWidth
            value={selectedSource}
            onChange={(value) =>
              setSelectedSource(value as "OFFGUT" | "OFFUSA")
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
          <SegmentedControl
            size="lg"
            fullWidth
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
                    <IconSun size={20} />
                    <span>{t(locale, "light")}</span>
                  </div>
                ),
                value: "light",
              },
              {
                label: (
                  <div className="flex items-center justify-center gap-2">
                    <IconMoon size={20} />
                    <span>{t(locale, "dark")}</span>
                  </div>
                ),
                value: "dark",
              },
            ]}
          />
          <Button
            size="lg"
            fullWidth
            onClick={handleSave}
            leftSection={<IconHome size={20} />}
          >
            {t(locale, "start")}
          </Button>
        </div>
      </Paper>
    </div>
  );
}
