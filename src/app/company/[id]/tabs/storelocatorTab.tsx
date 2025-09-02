import { Company } from "@/app/lib/interfaces";
import { Button, Checkbox, Fieldset, Tabs, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useState } from "react";

export default function StorelocatorTab({ company }: { company: Company }) {
  const [showDealer, setShowDealer] = useState(false);

  const brands = [
    "Meinl Cymbals",
    "Meinl Percussion",
    "Meinl Sonic Energy",
    "Meinl Stick & Brush",
    "Nino Percussion",
    "Ortega",
    "Ibanez",
    "Tama",
    "Hardcase",
    "Backun",
  ];

  return (
    <Tabs.Panel value="storelocator" className="py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex justify-between items-center gap-2">
          <Checkbox
            size="md"
            label={`${company.name1} im DealerLocator anzeigen.`}
            checked={showDealer}
            onChange={(event) => setShowDealer(event.currentTarget.checked)}
          />
          <Button
            type="submit"
            leftSection={<IconDeviceFloppy size={16} />}
            // disabled={!form.isValid()}
          >
            Änderungen speichern
          </Button>
        </div>
        <Fieldset>
          <h2>Daten</h2>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Website URL" readOnly={!showDealer} />
            <TextInput label="Webshop URL" readOnly={!showDealer} />
          </div>
        </Fieldset>
        <Fieldset disabled={!showDealer}>
          <h2>Brands</h2>
          <Checkbox.Group>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((b, i) => (
                <Checkbox key={i} label={b} value={b} />
              ))}
            </div>
          </Checkbox.Group>
        </Fieldset>
      </div>
    </Tabs.Panel>
  );
}
