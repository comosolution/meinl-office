import { useOffice } from "@/app/context/officeContext";
import { DHL_TRACKING_URL } from "@/app/lib/config";
import { t } from "@/app/lib/i18n";
import { Ticket } from "@/app/lib/interfaces";
import { handleDownload } from "@/app/lib/utils";
import { ActionIcon, CopyButton, Paper } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconExternalLink,
} from "@tabler/icons-react";

export default function TrackingTab({ ticket }: { ticket: Ticket }) {
  const { locale } = useOffice();

  return (
    <div className="flex flex-col gap-4">
      <h2>Tracking</h2>
      <div className="flex flex-col gap-2">
        {ticket.tracking && ticket.tracking.length > 0 ? (
          ticket.tracking
            .map((track, i) => (
              <Paper key={i} p="sm" shadow="sm" bg="var(--background)">
                <div className="flex justify-between items-center gap-2">
                  <h2>
                    {track.versender} {track.sendungnr}
                  </h2>
                  {track.versender === "DHL" && (
                    <div className="flex gap-1">
                      <ActionIcon
                        color="yellow"
                        variant="light"
                        component="a"
                        target="_blank"
                        href={`${DHL_TRACKING_URL}${track.sendungnr}`}
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="yellow"
                        aria-label={t(locale, "download")}
                        onClick={() =>
                          handleDownload(track.sendungnr, track.label)
                        }
                      >
                        <IconDownload size={16} />
                      </ActionIcon>
                    </div>
                  )}
                  {track.versender === "GLS" && (
                    <CopyButton value={track.sendungnr}>
                      {({ copied, copy }) => (
                        <ActionIcon color="blue" onClick={copy}>
                          {copied ? (
                            <IconCheck size={16} />
                          ) : (
                            <IconCopy size={16} />
                          )}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  )}
                </div>
              </Paper>
            ))
            .reverse()
        ) : (
          <p className="text-xs text-center dimmed py-4">
            {t(locale, "noTracking")}
          </p>
        )}
      </div>
    </div>
  );
}
