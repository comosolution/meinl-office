import Pagination from "@/app/components/pagination";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Company } from "@/app/lib/interfaces";
import { getAvatarColor } from "@/app/lib/utils";
import { Avatar, Table, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmployeesTab({ company }: { company: Company }) {
  const { locale } = useOffice();

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);

  const router = useRouter();

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
              <Table.Thead>
                <Table.Tr>
                  <Table.Th />
                  <Table.Th>{t(locale, "name")}</Table.Th>
                  <Table.Th>{t(locale, "position")}</Table.Th>
                  <Table.Th>{t(locale, "email")}</Table.Th>
                  <Table.Th>{t(locale, "b2b")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentPageData.map((employee, i) => (
                  <Table.Tr
                    key={i}
                    className="cursor-pointer"
                    onClick={() => router.push(`/person/${employee.b2bnr}`)}
                  >
                    <Table.Td>
                      <Avatar
                        size={24}
                        color={getAvatarColor(employee.kundenart)}
                        name={`${employee.nachname} ${employee.vorname}`}
                      />
                    </Table.Td>
                    <Table.Td>
                      <b>
                        {employee.nachname}, {employee.vorname}
                      </b>
                    </Table.Td>
                    <Table.Td>{employee.jobpos}</Table.Td>
                    <Table.Td>{employee.email}</Table.Td>
                    <Table.Td>{employee.b2bnr}</Table.Td>
                  </Table.Tr>
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
