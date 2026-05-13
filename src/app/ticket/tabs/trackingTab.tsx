import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Ticket } from "@/app/lib/interfaces";
import { ActionIcon, Paper } from "@mantine/core";
import { IconDownload, IconExternalLink } from "@tabler/icons-react";

export default function TrackingTab({ ticket }: { ticket: Ticket }) {
  const { locale } = useOffice();

  const handleDownload = (id: string, label: string) => {
    if (!ticket || !ticket.tracking) return;

    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${label}`;
    link.download = `Rücksendeetikett_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Tracking</h2>
      <div className="flex flex-col gap-2">
        {ticket.tracking && ticket.tracking.length > 1 ? (
          ticket.tracking.map((track, i) => (
            <Paper key={i} p="sm" shadow="sm" bg="var(--background)">
              <div className="flex justify-between items-center gap-2">
                <h2>
                  {track.versender}/{track.sendungnr}
                </h2>
                {track.versender === "DHL" && (
                  <div className="flex gap-2">
                    <ActionIcon
                      variant="transparent"
                      component="a"
                      target="_blank"
                      href={`https://www.dhl.com/de-${locale}/home/tracking.html?submit=1&tracking-id=${track.sendungnr}`}
                    >
                      <IconExternalLink size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      aria-label={t(locale, "download")}
                      onClick={() =>
                        handleDownload(track.sendungnr, track.label)
                      }
                    >
                      <IconDownload size={16} />
                    </ActionIcon>
                  </div>
                )}
              </div>
            </Paper>
          ))
        ) : (
          <p className="text-xs text-center dimmed py-4">
            {t(locale, "noTracking")}
          </p>
        )}
      </div>
    </div>
  );
}
