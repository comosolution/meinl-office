import { Campaign } from "@/app/lib/interfaces";

export const getInitialValues = (campaign: Campaign) => {
  return {
    id: campaign?.id || 0,
    brand: campaign?.brand || "Meinl Cymbals",
    title: campaign?.title || "",
    description: campaign?.description || "",
    start: campaign?.start || null,
    end: campaign?.end || null,
    dealers: campaign.dealers || [""],
  };
};
