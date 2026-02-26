import EmployeeHead from "@/app/components/employeeHead";
import EmployeeRow from "@/app/components/employeeRow";
import { Company } from "@/app/lib/interfaces";
import { Pagination, Table, Tabs } from "@mantine/core";
import { useState } from "react";

export default function EmployeesTab({ company }: { company: Company }) {
  const [page, setPage] = useState(1);

  const pageSize = 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = company.personen.slice(startIndex, endIndex);
  const totalPages = Math.ceil(company.personen.length / pageSize);

  return (
    <Tabs.Panel value="employees" className="py-4">
      <div className="flex flex-col gap-4">
        {company.personen.length > 0 ? (
          <div className="flex flex-col gap-8">
            <Table stickyHeader highlightOnHover>
              <EmployeeHead />
              <Table.Tbody>
                {currentPageData.map((employee, i) => (
                  <EmployeeRow key={i} employee={employee} />
                ))}
              </Table.Tbody>
            </Table>
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages}
              className="flex justify-center"
            />
          </div>
        ) : (
          <p className="dimmed text-center p-4">Keine Mitarbeiter erfasst.</p>
        )}
      </div>
    </Tabs.Panel>
  );
}
