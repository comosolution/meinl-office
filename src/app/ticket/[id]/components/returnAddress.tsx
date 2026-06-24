import { normalizeAlpha2CountryCode } from "@/app/lib/countryCodes";
import { Person, Ticket } from "@/app/lib/interfaces";

export function getReturnAddress(ticket: Ticket, owner: Person | null) {
  const ticketAddress = {
    name: ticket?.versandadresse?.vaname ?? "",
    street: ticket?.versandadresse?.vastrasse ?? "",
    zip: ticket?.versandadresse?.vaplz ?? "",
    city: ticket?.versandadresse?.vaort ?? "",
    country: ticket?.versandadresse?.valand ?? "",
  };

  if (!owner) return ticketAddress;

  const ownerAddress = {
    name: owner.name1 ?? `${owner.vorname ?? ""} ${owner.nachname ?? ""}`,
    street: owner.strasse ?? owner.street ?? "",
    zip: owner.plz ?? owner.zip ?? owner.postalCode ?? "",
    city: owner.ort ?? owner.city ?? "",
    country: owner.land ?? owner.country ?? "",
  };

  const hasTicketAddress =
    !!ticketAddress.name ||
    !!ticketAddress.street ||
    !!ticketAddress.zip ||
    !!ticketAddress.city;
  return hasTicketAddress ? ticketAddress : ownerAddress;
}

export function ReturnAddress({
  ticket,
  owner,
}: {
  ticket: Ticket;
  owner: Person | null;
}) {
  const address = getReturnAddress(ticket, owner);

  return (
    <>
      {address.name ? (
        <>
          {address.name}
          <br />
        </>
      ) : null}
      {address.street ? (
        <>
          {address.street}
          <br />
        </>
      ) : null}
      {address.zip || address.city || address.country ? (
        <>
          {address.zip} {address.city}
          {address.country
            ? `, ${normalizeAlpha2CountryCode(address.country)}`
            : ""}
        </>
      ) : null}
    </>
  );
}
