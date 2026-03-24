export const brands = [
  "Meinl Cymbals",
  "Meinl Percussion",
  "Meinl Sonic Energy",
  "Meinl Stick & Brush",
  "Nino Percussion",
  "Ortega",
  "Ibanez",
  "Tama",
  "Hardcase",
];

export const customerTypes: { [key: string]: string } = {
  "1": "Retail",
  "2": "Online",
  "3": "Retail & Online",
};

export const competences = [
  "Administration",
  "Hardcase",
  "Ibanez Akustik-Gitarre",
  "Ibanez E-Gitarre",
  "Ibanez E-Bass",
  "Meinl Cymbals",
  "Meinl Percussion",
  "Meinl Sonic Energy",
  "Meinl Stick & Brush",
  "Meinl Viva Rhythm",
  "Nino",
  "Ortega",
  "Tama",
  "VIP",
];

export const b2bAccess = (source: "OFFGUT" | "OFFUSA") => {
  return source === "OFFGUT"
    ? [
        { label: "Voll", value: "1" },
        { label: "Ohne offene Posten", value: "2" },
        { label: "Nur Bestand", value: "3" },
        { label: "Nur Serviceportal", value: "4" },
        { label: "Kein", value: "0" },
      ]
    : [
        { label: "Full access", value: "1" },
        { label: "Without outstanding items", value: "2" },
        { label: "Without open accounts", value: "3" },
        { label: "Stock only", value: "4" },
        { label: "No access", value: "0" },
      ];
};

export const downloads = (source: "OFFGUT" | "OFFUSA") => {
  return source === "OFFGUT"
    ? [
        {
          label: "Brancheneinheitliches Format, Reintext mit festen Satzlängen",
          value: "mymgmi",
        },
        { label: "Brancheneinheitliches Format, XML", value: "mymgmi-xml" },
        {
          label: "Brancheneinheitliches Format, XML, uneingeschränkt",
          value: "mymgmi-xml-unrestricted",
        },
        { label: "Microsoft Excel XP+, XML", value: "excel" },
        { label: "Händlerpreise VK/EK", value: "haendlerpreise" },
        { label: "Verfügbarkeiten", value: "verfuegbar" },
        { label: "CITES", value: "cites" },
      ]
    : [
        { label: "Dealer purchase / retail prices", value: "haendlerpreise" },
        { label: "CITES", value: "cites" },
      ];
};

export const familyStatus = ["ledig", "verheiratet", "verwitwet", "geschieden"];

export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const titles = [
  "Dr.",
  "Dr. med.",
  "Dr.-Ing.",
  "Dipl.-Ing.",
  "Prof.",
  "Prof. Dr.",
];

export const genders = ["Frau", "Herr"];
