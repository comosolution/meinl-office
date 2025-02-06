import { Avatar, Button, Paper } from "@mantine/core";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { CompanyInStorage, PersonInStorage } from "../lib/interfaces";

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
    <Paper p="lg" shadow="lg" className="flex flex-col justify-between gap-4">
      <h2>Kürzlich besuchte {title}</h2>
      {history.length > 0 ? (
        <>
          <div className="flex flex-col gap-2">
            {history.map((item, index) => (
              <Link
                key={index}
                href={`${linkPrefix}/${
                  (item as CompanyInStorage | PersonInStorage).kdnr
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar size={48} radius="md">
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
            leftSection={<IconTrash size={16} />}
            onClick={clearHistory}
          >
            Verlauf löschen
          </Button>
        </>
      ) : (
        <>
          <p className="dimmed text-center">Keine {title} besucht.</p>
          <Button
            color="dark"
            variant="light"
            leftSection={<IconSearch size={16} />}
            fullWidth
            component={Link}
            href={`${linkPrefix}`}
          >
            {title} finden
          </Button>
        </>
      )}
    </Paper>
  );
}
