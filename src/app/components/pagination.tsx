import { Pagination as MantinePagination, Select } from "@mantine/core";
import { useEffect } from "react";
import { useOffice } from "../context/officeContext";
import { MEINL_OFFICE_LIMIT_KEY } from "../lib/constants";
import { t } from "../lib/i18n";

export default function Pagination({
  page,
  setPage,
  pageLimit,
  setPageLimit,
  results,
}: {
  page: number;
  setPage: (page: number) => void;
  pageLimit: string | null;
  setPageLimit: (page: string | null) => void;
  results: number;
}) {
  const { locale } = useOffice();

  useEffect(() => {
    const savedLimit = localStorage.getItem(MEINL_OFFICE_LIMIT_KEY);
    if (savedLimit !== null) {
      setPageLimit(savedLimit);
    } else {
      setPageLimit("25");
    }
  }, []);

  useEffect(() => {
    setPage(1);
    if (pageLimit !== null) {
      localStorage.setItem(MEINL_OFFICE_LIMIT_KEY, pageLimit);
    }
  }, [pageLimit]);

  const totalPages = Math.ceil(results / (parseInt(pageLimit || "25") || 25));

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center gap-2 backdrop-blur py-2">
      <div className="flex items-center gap-2">
        <MantinePagination.Root
          value={page}
          onChange={setPage}
          total={totalPages}
        >
          <div className="flex items-center gap-2">
            <MantinePagination.Previous />
            <p className="text-xs">
              {t(locale, "page")} {page} {t(locale, "of")} {totalPages}
            </p>
            <MantinePagination.Next />
          </div>
        </MantinePagination.Root>
        <p className="text-xs dimmed">
          {results} {t(locale, "results")}
        </p>
      </div>
      <div className="flex items-baseline gap-1">
        <p className="text-xs">{t(locale, "resultsPerPage")}:</p>
        <Select
          size="xs"
          data={["25", "100", "1000", "10000"]}
          value={pageLimit}
          onChange={setPageLimit}
          w={80}
          allowDeselect={false}
          checkIconPosition="right"
        />
      </div>
    </div>
  );
}
