import EmployeeHead from "@/app/components/employeeHead";
import EmployeeRow from "@/app/components/employeeRow";
import { Company } from "@/app/lib/interfaces";
import { Button, Table, Tabs } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

export default function EmployeesTab({ company }: { company: Company }) {
  return (
    <Tabs.Panel value="employees" className="py-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <Button color="dark" leftSection={<IconCirclePlus size={16} />}>
            Mitarbeiter hinzufügen
          </Button>
        </div>
        {company.personen.length > 0 ? (
          <Table stickyHeader highlightOnHover>
            <EmployeeHead />
            <Table.Tbody>
              {company.personen.map((employee, i) => (
                <EmployeeRow key={i} employee={employee} />
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <p className="dimmed text-center p-4">Keine Mitarbeiter erfasst.</p>
        )}
      </div>
    </Tabs.Panel>
  );
}
