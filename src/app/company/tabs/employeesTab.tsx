import EmployeeHead from "@/app/components/employeeHead";
import EmployeeRow from "@/app/components/employeeRow";
import Pagination from "@/app/components/pagination";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Company } from "@/app/lib/interfaces";
import { Table, Tabs } from "@mantine/core";
import { useState } from "react";

export default function EmployeesTab({ company }: { company: Company }) {
  const { locale } = useOffice();

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = company.personen.slice(startIndex, endIndex);

  return (
    <Tabs.Panel value="employees" className="py-4">
      <div className="flex flex-col gap-2">
        {company.personen.length > 0 ? (
          <div className="flex flex-col gap-4">
            <Pagination
              page={page}
              setPage={setPage}
              pageLimit={pageLimit}
              setPageLimit={setPageLimit}
              results={company.personen.length}
            />
            <Table highlightOnHover>
              <EmployeeHead />
              <Table.Tbody>
                {currentPageData.map((employee, i) => (
                  <EmployeeRow key={i} employee={employee} />
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <p className="dimmed text-center p-4">{t(locale, "noEmployees")}</p>
        )}
      </div>
    </Tabs.Panel>
  );
}
