import EmployeeHead from "@/app/components/employeeHead";
import EmployeeRow from "@/app/components/employeeRow";
import { Company } from "@/app/lib/interfaces";
import { Table, Tabs } from "@mantine/core";

export default function EmployeesTab({ company }: { company: Company }) {
  return (
    <Tabs.Panel value="employees" className="py-4">
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
    </Tabs.Panel>
  );
}
