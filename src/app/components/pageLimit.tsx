import { Pagination, Select } from "@mantine/core";
import { useEffect } from "react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function PageLimit({
  value,
  onChange,
  pageLimit,
  setPageLimit,
  results,
}: {
  value: number;
  onChange: (page: number) => void;
  pageLimit: string | null;
  setPageLimit: (value: string | null) => void;
  results: number;
}) {
  const { locale } = useOffice();

  useEffect(() => {
    onChange(1);
  }, [pageLimit]);

  const totalPages = Math.ceil(results / (parseInt(pageLimit || "25") || 25));

  if (totalPages < 2) return null;

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center gap-2 backdrop-blur py-2">
      <div className="flex items-center gap-2">
        <Pagination.Root value={value} onChange={onChange} total={totalPages}>
          <div className="flex items-center gap-2">
            <Pagination.Previous />
            <p className="text-xs">
              {t(locale, "page")} {value} {t(locale, "of")} {totalPages}
            </p>
            <Pagination.Next />
          </div>
        </Pagination.Root>
        <p className="text-xs dimmed">
          {results} {t(locale, "results")}
        </p>
      </div>

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
