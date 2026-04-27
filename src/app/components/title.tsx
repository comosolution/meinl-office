import { useSession } from "next-auth/react";
import { useOffice } from "../context/officeContext";
import { t } from "../lib/i18n";

export default function Title() {
  const { data: session } = useSession();
  const { locale } = useOffice();

  const fullName = session?.user?.name;
  const userName = fullName?.includes(",")
    ? fullName.split(",")[1]?.trim()
    : fullName?.split(" ")[0] || null;

  return (
    <h1>
      {t(locale, "homeTitle")}
      {userName ? `, ${userName}` : null}!
    </h1>
  );
}
