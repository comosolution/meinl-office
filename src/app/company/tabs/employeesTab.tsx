import Pagination from "@/app/components/pagination";
import { useOffice } from "@/app/context/officeContext";
import { b2bAccess } from "@/app/lib/data";
import { t } from "@/app/lib/i18n";
import { Company } from "@/app/lib/interfaces";
import { getAvatarColor } from "@/app/lib/utils";
import { Avatar, Table, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmployeesTab({ company }: { company: Company }) {
  const { locale, source } = useOffice();

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
                  <Table.Th>{t(locale, "b2bAccess")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentPageData.map((e, i) => (
                  <Table.Tr
                    key={i}
                    className="cursor-pointer"
                    onClick={() => router.push(`/person/${e.b2bnr}`)}
                  >
                    <Table.Td>
                      <Avatar
                        size={24}
                        color={getAvatarColor(e.kundenart)}
                        name={`${e.nachname} ${e.vorname}`}
                      />
                    </Table.Td>
                    <Table.Td>
                      <b>
                        {e.nachname}, {e.vorname}
                      </b>
                    </Table.Td>
                    <Table.Td>{e.jobpos}</Table.Td>
                    <Table.Td>{e.email}</Table.Td>
                    <Table.Td>{e.b2bnr}</Table.Td>
                    <Table.Td>
                      {b2bAccess(source).find((a) => a.value === e.b2bzugriff)
                        ?.label || e.b2bzugriff}
                    </Table.Td>
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
