import { Button, Paper } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function HistoryList<T>({
  title,
  storageKey,
  link,
  getAvatar,
  getTitle,
  getSubtitle,
  getSource,
}: {
  title: string;
  storageKey: string;
  link: (item: T) => string;
  getAvatar: (item: T) => React.ReactNode;
  getTitle: (item: T) => string;
  getSubtitle: (item: T) => string;
  getSource: (item: T) => string;
}) {
  const { source, locale } = useOffice();
  const [history, setHistory] = useState<T[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(storageKey);
    setHistory([]);
  };

  const filteredHistory = history
    .filter((item) => {
      return getSource(item) === source;
    })
    .slice(0, 5);

  return (
    <Paper p="md" bg="var(--background-subtle)">
      <div className="h-full flex flex-col gap-2 justify-between">
        <h2 className="text-center">
          {t(locale, "recentlyVisited")} {title}
        </h2>
        {filteredHistory.length > 0 ? (
          <>
            <div className="h-full flex flex-col gap-2">
              {filteredHistory.map((item, index) => (
                <Paper
                  key={index}
                  component={Link}
                  href={link(item)}
                  p="sm"
                  bg="var(--background)"
                  shadow="xl"
                >
                  <div className="flex items-center gap-2 text-(--mantine-color-dimmed) hover:text-(--foreground) transition-all duration-300">
                    {getAvatar(item)}
                    <div className="flex flex-col">
                      <h3>{getTitle(item)}</h3>
                      <p className="text-xs dimmed">{getSubtitle(item)}</p>
                    </div>
                  </div>
                </Paper>
              ))}
            </div>
            <Button
              variant="transparent"
              leftSection={<IconTrash size={16} />}
              onClick={clearHistory}
            >
              {locale === "de" ? "Verlauf löschen" : "Clear History"}
            </Button>
          </>
        ) : (
          <>
            <p className="dimmed text-center">
              {locale === "de"
                ? `Keine ${title} besucht`
                : `No ${title.toLowerCase()} visited`}
            </p>
            <div />
          </>
        )}
      </div>
    </Paper>
  );
}
