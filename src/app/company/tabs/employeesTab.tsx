import EmployeeHead from "@/app/components/employeeHead";
import EmployeeRow from "@/app/components/employeeRow";
import PageLimit from "@/app/components/pageLimit";
import { Company } from "@/app/lib/interfaces";
import { Table, Tabs } from "@mantine/core";
import { useState } from "react";

export default function EmployeesTab({ company }: { company: Company }) {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>("25");

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = company.personen.slice(startIndex, endIndex);

  return (
    <Tabs.Panel value="employees" className="py-4">
      <div className="flex flex-col gap-2">
        {company.personen.length > 0 ? (
          <div className="flex flex-col gap-4">
            <PageLimit
              value={page}
              onChange={setPage}
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
          <p className="dimmed text-center p-4">Keine Mitarbeiter erfasst.</p>
        )}
      </div>
    </Tabs.Panel>
  );
}
