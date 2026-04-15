import Pagination from "@/app/components/pagination";
import { useOffice } from "@/app/context/officeContext";
import { t } from "@/app/lib/i18n";
import { Company } from "@/app/lib/interfaces";
import { getAvatarColor } from "@/app/lib/utils";
import { Avatar, Checkbox, Table, Tabs } from "@mantine/core";
import { IconBuildingWarehouse } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DistributorTab({ company }: { company: Company }) {
  const { locale } = useOffice();

  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState<string | null>(null);

  const router = useRouter();

  const sortedDistributors = company.haendler.sort((a, b) =>
    a.name1.localeCompare(b.name1),
  );

  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = sortedDistributors.slice(startIndex, endIndex);

  return (
    <Tabs.Panel value="distributor" className="py-4">
      <div className="flex flex-col gap-2">
        {company.haendler.length > 0 ? (
          <div className="flex flex-col gap-4">
            <Pagination
              page={page}
              setPage={setPage}
              pageLimit={pageLimit}
              setPageLimit={setPageLimit}
              results={sortedDistributors.length}
            />
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th />
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Brand</Table.Th>
                  <Table.Th>Kdnr</Table.Th>
                  <Table.Th>Stadt</Table.Th>
                  <Table.Th>Land</Table.Th>
                  <Table.Th>DealerLocator</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentPageData.map((company, i) => (
                  <Table.Tr
                    key={i}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/company/${company.kdnr}/${company.id}`)
                    }
                  >
                    <Table.Td>
                      <Avatar
                        size={24}
                        variant="filled"
                        color={getAvatarColor(company.kundenart)}
                      >
                        <IconBuildingWarehouse size={14} />
                      </Avatar>
                    </Table.Td>
                    <Table.Td>
                      <b>{company.name1}</b>
                    </Table.Td>
                    <Table.Td>{company.brands as unknown as string}</Table.Td>
                    <Table.Td>{company.kdnr}</Table.Td>
                    <Table.Td>{company.ort}</Table.Td>
                    <Table.Td>{company.land}</Table.Td>
                    <Table.Td>
                      <Checkbox defaultChecked={company.dealerloc} disabled />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <p className="dimmed text-center p-4">{t(locale, "noDealers")}</p>
        )}
      </div>
    </Tabs.Panel>
  );
}
