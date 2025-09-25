"use client";
import Loader from "@/app/components/loader";
import { Campaign } from "@/app/lib/interfaces";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [campaign, setCampaign] = useState<Campaign>();

  const form = useForm<Campaign>({
    //   initialValues: ,
    validateInputOnChange: true,
  });

  useEffect(() => {
    getCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getCampaign = async () => {
    const response = await fetch(`/api/campaign/${id}`);
    const data = await response.json();
    setCampaign(data[0]);
  };

  if (!campaign) return <Loader />;

  return (
    <main className="flex flex-col gap-4 p-4">
      {/* <div className="flex justify-between items-baseline gap-2">
        <Button
          variant="light"
          color="gray"
          leftSection={<IconChevronLeft size={16} />}
          component={Link}
          href="/company"
        >
          Alle Firmen
        </Button>
        <Contact email={company.mailadr} phone={company.telefon} />
      </div> */}

      <header className="flex items-center gap-4 p-4">
        <div className="flex flex-col gap-1 w-full">
          <h1>{campaign.title}</h1>
          <p className="dimmed"></p>
        </div>
      </header>
    </main>
  );
}
