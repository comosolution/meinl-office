"use client";
import {
  Autocomplete,
  AutocompleteProps,
  ComboboxItem,
  Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { AdUser } from "../../lib/interfaces";

let usersCache: AdUser[] | null = null;
let usersPromise: Promise<AdUser[]> | null = null;

async function loadUsers(): Promise<AdUser[]> {
  if (usersCache) return usersCache;

  if (!usersPromise) {
    usersPromise = (async () => {
      try {
        const res = await fetch("/api/users");
        const users: AdUser[] = res.ok ? await res.json() : [];

        usersCache = users;

        return users;
      } catch {
        return [];
      } finally {
        usersPromise = null;
      }
    })();
  }
  return usersPromise;
}

export function EmailAutocomplete(props: Omit<AutocompleteProps, "data">) {
  const [users, setUsers] = useState<AdUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await loadUsers();
      if (!cancelled) {
        setUsers(data);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const data = users.map((u) => ({ value: u.mail, label: u.mail }));

  return (
    <Autocomplete
      data={data}
      limit={20}
      rightSection={loading ? <Loader size="xs" /> : undefined}
      filter={({ options, search }) => {
        const query = search.trim().toLowerCase();

        return (options as ComboboxItem[]).filter((option) => {
          const user = users.find((u) => u.mail === option.value);

          return (
            option.value.toLowerCase().includes(query) ||
            (user?.displayName.toLowerCase().includes(query) ?? false)
          );
        });
      }}
      renderOption={({ option }) => {
        const user = users.find((u) => u.mail === option.value);

        return (
          <div className="flex flex-col">
            <p className="text-sm">{user?.displayName}</p>
            <p className="text-xs dimmed">{option.value}</p>
          </div>
        );
      }}
      {...props}
    />
  );
}
