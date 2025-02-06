import {
  FormValues,
  getInitialValues,
  validateForm,
} from "@/app/company/[id]/form";
import { Company } from "@/app/lib/interfaces";
import { Button, Fieldset, NumberInput, Tabs, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useState } from "react";

export default function InfoTab({
  company,
  getCompany,
}: {
  company: Company;
  getCompany: () => Promise<void>;
}) {
  const [edit, setEdit] = useState(false);

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: getInitialValues(company),
    validate: (values: FormValues) => validateForm(values),
  });

  const updateCustomer = async (values: FormValues) => {
    const response = await fetch("/api/customer", {
      method: "POST",
      body: JSON.stringify(values, null, 2),
    });
    if (response.ok) {
      setEdit(false);
      getCompany();
    }
  };

  return (
    <Tabs.Panel value="info" className="py-4">
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={form.onSubmit((values) => {
          updateCustomer(values);
        })}
      >
        <Fieldset legend="Unternehmen">
          <TextInput
            label="Name"
            key={form.key("name1")}
            {...form.getInputProps("name1")}
            readOnly={!edit}
          />
          <TextInput
            label="Zusatz"
            key={form.key("name2")}
            {...form.getInputProps("name2")}
            readOnly={!edit}
          />
          <TextInput
            label="Matchcode"
            key={form.key("matchcode")}
            {...form.getInputProps("matchcode")}
            readOnly
          />
          <NumberInput
            label="Kundennummer"
            key={form.key("kdnr")}
            {...form.getInputProps("kdnr")}
            readOnly
          />
        </Fieldset>
        <Fieldset legend="Anschrift">
          <TextInput
            label="Straße / Postfach"
            key={form.key("strasse")}
            {...form.getInputProps("strasse")}
            readOnly={!edit}
          />
          <TextInput
            label="PLZ"
            key={form.key("plz")}
            {...form.getInputProps("plz")}
            readOnly={!edit}
          />
          <TextInput
            label="Ort"
            key={form.key("ort")}
            {...form.getInputProps("ort")}
            readOnly={!edit}
          />
          <TextInput
            label="Land"
            key={form.key("land")}
            {...form.getInputProps("land")}
            readOnly={!edit}
          />
        </Fieldset>
        <Fieldset legend="Kommunikation">
          <TextInput
            label="Telefon"
            key={form.key("telefon")}
            {...form.getInputProps("telefon")}
            readOnly
          />
          <TextInput
            label="E-Mail"
            key={form.key("email")}
            {...form.getInputProps("email")}
            readOnly
          />
        </Fieldset>
        <div className="col-span-2 flex justify-end gap-2">
          {edit ? (
            <>
              <Button
                color="gray"
                variant="light"
                onClick={async () => {
                  await getCompany();
                  form.setValues(getInitialValues(company));
                  setEdit(false);
                }}
              >
                Verwerfen
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                disabled={!form.isValid()}
              >
                Änderungen speichern
              </Button>
            </>
          ) : (
            <Button
              color="gray"
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEdit(true)}
            >
              Firmendaten bearbeiten
            </Button>
          )}
        </div>
      </form>
    </Tabs.Panel>
  );
}
