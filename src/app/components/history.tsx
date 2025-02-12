import { Avatar, Button, Paper } from "@mantine/core";
import { IconEyeOff, IconHistoryOff, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { CompanyInStorage, PersonInStorage } from "../lib/interfaces";
import { getAvatarColor } from "../lib/utils";

export default function HistoryList<T>({
  title,
  storageKey,
  linkPrefix,
  getAvatar,
  getTitle,
  getSubtitle,
}: {
  title: string;
  storageKey: string;
  linkPrefix: string;
  getAvatar: (item: T) => JSX.Element | string;
  getTitle: (item: T) => string;
  getSubtitle: (item: T) => string;
}) {
  const [history, setHistory] = useState<T[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(storageKey);
    setHistory([]);
  };

  return (
    <Paper p="lg" shadow="lg" radius="lg" className="flex flex-col gap-4">
      <div className="h-full flex flex-col gap-4 place-content-between">
        <h2>Kürzlich besuchte {title}</h2>
        {history.length > 0 ? (
          <>
            <div className="h-full flex flex-col">
              {history.map((item, index) => (
                <Link
                  key={index}
                  href={`${linkPrefix}/${
                    (item as CompanyInStorage | PersonInStorage).kdnr
                  }`}
                >
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-[var(--mantine-color-gray-light)] transition-all duration-300">
                    <Avatar
                      size={48}
                      radius="md"
                      color={getAvatarColor(
                        (
                          item as CompanyInStorage | PersonInStorage
                        ).kdnr.substring(0, 5)
                      )}
                    >
                      {getAvatar(item)}
                    </Avatar>
                    <div className="flex flex-col">
                      <h3>{getTitle(item)}</h3>
                      <p className="dimmed">{getSubtitle(item)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button
              variant="transparent"
              leftSection={<IconHistoryOff size={16} />}
              onClick={clearHistory}
            >
              Verlauf löschen
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <IconEyeOff size={48} color="gray" />
              <p className="dimmed text-center">Keine {title} besucht.</p>
            </div>
            <Button
              color="dark"
              variant="light"
              leftSection={<IconSearch size={16} />}
              component={Link}
              href={`${linkPrefix}`}
            >
              {title} finden
            </Button>
          </>
        )}
      </div>
    </Paper>
  );
}
