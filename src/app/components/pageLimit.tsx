import { Select } from "@mantine/core";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function PageLimit({
  pageLimit,
  setPageLimit,
  results,
}: {
  pageLimit: string | null;
  setPageLimit: (value: string | null) => void;
  results: number;
}) {
  const { locale } = useOffice();

  return (
    <div className="flex justify-between items-center gap-1">
      <p className="text-xs">
        {results} {t(locale, "results")}
      </p>
      <div className="flex items-baseline gap-2">
        <Select
          size="xs"
          data={["25", "100", "1000", "10000"]}
          value={pageLimit}
          onChange={setPageLimit}
          w={80}
          allowDeselect={false}
          checkIconPosition="right"
        />
        <p className="text-xs">{t(locale, "resultsPerPage")}</p>
      </div>
    </div>
  );
}
