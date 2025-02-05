import { IconLoader3 } from "@tabler/icons-react";

export default function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center p-8">
      <IconLoader3 size={48} className="animate-spin" />
    </div>
  );
}
