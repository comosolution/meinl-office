"use client";
import { Avatar, Button, Table, Tooltip } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { format, formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { useOffice } from "../context/officeContext";
import { Campaign } from "../lib/interfaces";

export default function Page() {
  const router = useRouter();
  const { source } = useOffice();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const getCampaigns = async () => {
    setLoading(true);
    const res = await fetch("/api/campaign", {
      method: "POST",
      body: JSON.stringify({ source, salt: "" }),
    });
    const data = await res.json();
    setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  const formatDate = (date: string | Date) => {
    if (!date) return;

    try {
      const distance = formatDistance(date, new Date(), {
        addSuffix: true,
        locale: de,
      });

      return (
        <Tooltip
          label={format(date, "dd.MM.yyyy hh:mm:ss")}
          position="left"
          withArrow
        >
          <span>{distance}</span>
        </Tooltip>
      );
    } catch {
      return date.toString();
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="flex flex-col gap-8 px-8 py-4">
      <header className="flex justify-between items-center gap-2 py-4">
        <h1>Kampagnen</h1>
        <div className="flex gap-1">
          <Button
            component={Link}
            href="/campaign/new"
            leftSection={<IconPlus size={16} />}
          >
            Kampagne anlegen
          </Button>
        </div>
      </header>
      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Start</Table.Th>
            <Table.Th>Ende</Table.Th>
            <Table.Th>Händler</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {campaigns &&
            campaigns
              .sort((a, b) => a.id - b.id)
              .map((campaign, index) => (
                <Table.Tr
                  key={index}
                  className="cursor-pointer"
                  onClick={() => router.push(`/campaign/${campaign.id}`)}
                >
                  <Table.Td>{campaign.id}</Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Avatar size={28}>
                        <Image
                          src={`/brands/${campaign.brand
                            ?.replaceAll(" ", "-")
                            .toUpperCase()}.png`}
                          width={20}
                          height={20}
                          alt={`${campaign.brand} Logo`}
                          className="inverted object-contain"
                        />
                      </Avatar>
                      <p>{campaign.brand}</p>
                    </div>
                  </Table.Td>
                  <Table.Td>{campaign.title}</Table.Td>
                  <Table.Td>
                    {campaign.start ? formatDate(campaign.start) : ""}
                  </Table.Td>
                  <Table.Td>
                    {campaign.end ? formatDate(campaign.end) : ""}
                  </Table.Td>
                  <Table.Td>{campaign.dealers.length}</Table.Td>
                </Table.Tr>
              ))}
        </Table.Tbody>
      </Table>
    </main>
  );
}
