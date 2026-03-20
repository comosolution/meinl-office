import { Button, Paper } from "@mantine/core";
import { IconEyeOff, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOffice } from "../context/officeContext";

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
    <Paper p="lg" radius="md" bg="transparent" withBorder>
      <div className="h-full flex flex-col gap-4 justify-between">
        <h2 className="text-center">
          {locale === "de" ? "Kürzlich besuchte" : "Recently visited"} {title}
        </h2>
        {filteredHistory.length > 0 ? (
          <>
            <div className="h-full flex flex-col gap-4">
              {filteredHistory.map((item, index) => (
                <Link key={index} href={link(item)}>
                  <div className="flex items-center gap-2 text-(--mantine-color-dimmed) hover:text-(--foreground) transition-all duration-300">
                    {getAvatar(item)}
                    <div className="flex flex-col">
                      <h3>{getTitle(item)}</h3>
                      <p className="text-xs dimmed">{getSubtitle(item)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button
              variant="transparent"
              leftSection={<IconTrash size={16} />}
              onClick={clearHistory}
            >
              {locale === "de" ? "Verlauf löschen" : "Clear history"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <IconEyeOff size={48} color="gray" />
              <p className="dimmed text-center">
                {locale === "de"
                  ? `Keine ${title} besucht`
                  : `No ${title} visited`}
              </p>
            </div>
            <div />
          </>
        )}
      </div>
    </Paper>
  );
}
