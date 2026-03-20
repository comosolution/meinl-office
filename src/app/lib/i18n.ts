export type Locale = "de" | "en";

export type TranslationKey =
  | "homeTitle"
  | "userName"
  | "userEmail"
  | "companies"
  | "dealers"
  | "people"
  | "all"
  | "allCompanies"
  | "allPeople"
  | "searchCompanies"
  | "searchPeople"
  | "createPerson"
  | "dashboard"
  | "search"
  | "startPage"
  | "campaigns"
  | "tickets"
  | "logout"
  | "source"
  | "language"
  | "companyLabel"
  | "personLabel"
  | "paginationTotal"
  | "backToStart"
  | "discard"
  | "saveChanges"
  | "editData"
  | "companyDetails"
  | "companyLogo"
  | "dealerLocator"
  | "dealer"
  | "employees"
  | "details"
  | "addCampaign"
  | "searchByName"
  | "ticketOverview"
  | "ticketStats"
  | "createTicket"
  | "allTickets"
  | "cancel"
  | "delete"
  | "allCampaigns"
  | "copyLink"
  | "customer"
  | "shippingAddress"
  | "contactPerson"
  | "person"
  | "articleNumber"
  | "quantity"
  | "descriptionLabel"
  | "next"
  | "previous"
  | "selectCustomer"
  | "deleteConfirm"
  | "noResults"
  | "invalidRequired"
  | "company"
  | "address"
  | "communication"
  | "socialMedia"
  | "brands"
  | "start"
  | "end"
  | "searchByContact"
  | "back"
  | "idLabel"
  | "nameLabel"
  | "dealerFor"
  | "personalData"
  | "privateSection"
  | "responsibilities"
  | "officeAddress"
  | "personalAddress"
  | "position"
  | "department"
  | "managedBy"
  | "employee"
  | "showInDealerLocator"
  | "noDealers"
  | "noEmployees"
  | "noNotes"
  | "noFiles"
  | "ticketNotFound"
  | "addReturnLabel"
  | "downloadReturnLabel"
  | "selectPickupDate"
  | "date"
  | "customerType"
  | "websiteUrl"
  | "streetPostbox"
  | "customerNumber"
  | "country"
  | "postalCode"
  | "city"
  | "extra"
  | "matchcode"
  | "extra"
  | "kdnr"
  | "ka"
  | "latitude"
  | "longitude"
  | "phone"
  | "email"
  | "salutation"
  | "title"
  | "lastName"
  | "firstName"
  | "mobile"
  | "fax"
  | "cookieDeprecated";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  de: {
    homeTitle: "Willkommen",
    userName: "Max Mustermann",
    userEmail: "max.mustermann@meinl.de",
    companies: "Firmen",
    dealers: "Händler",
    people: "Personen",
    all: "Alle",
    allCompanies: "Alle Firmen",
    allPeople: "Alle Personen",
    searchCompanies: "Firmen durchsuchen ...",
    searchPeople: "Personen durchsuchen ...",
    createPerson: "Person anlegen",
    dashboard: "Dashboard",
    search: "Suche",
    startPage: "Startseite",
    campaigns: "Kampagnen",
    tickets: "RMA Tickets",
    logout: "Ausloggen",
    source: "Quelle",
    language: "Sprache",
    companyLabel: "Firma",
    personLabel: "Person",
    paginationTotal: "Gesamt",
    backToStart: "Zurück zur Startseite",
    discard: "Verwerfen",
    saveChanges: "Änderungen speichern",
    editData: "Daten bearbeiten",
    companyDetails: "Firmendaten",
    companyLogo: "Firmenlogo",
    dealerLocator: "DealerLocator",
    dealer: "Händler",
    employees: "Mitarbeiter",
    details: "Details",
    addCampaign: "Kampagne anlegen",
    searchByName: "Nach Name oder Kdnr suchen ...",
    allCampaigns: "Alle Kampagnen",
    ticketOverview: "Übersicht",
    ticketStats: "Auswertungen",
    createTicket: "Ticket erstellen",
    cancel: "Abbrechen",
    delete: "Löschen",
    deleteConfirm: "Kampagne endgültig löschen",
    noResults: "Keine Ergebnisse",
    invalidRequired: "ist erforderlich",
    customer: "Kunde",
    shippingAddress: "Versandadresse",
    contactPerson: "Kontaktperson",
    articleNumber: "Artikelnummer",
    quantity: "Menge",
    descriptionLabel: "Beschreibung",
    person: "Person",
    next: "Weiter",
    previous: "Zurück",
    selectCustomer: "Kundennummer oder Name eingeben",
    company: "Unternehmen",
    allTickets: "Alle Tickets",
    address: "Anschrift",
    communication: "Kommunikation",
    socialMedia: "Social Media",
    brands: "Brands",
    start: "Start",
    end: "Ende",
    searchByContact: "Nach Name oder Kdnr suchen ...",
    back: "Zurück",
    idLabel: "ID",
    nameLabel: "Name",
    dealerFor: "Händler für",
    showInDealerLocator: "im DealerLocator anzeigen",
    noDealers: "Keine Händler erfasst.",
    noEmployees: "Keine Mitarbeiter erfasst.",
    noNotes: "Keine Notizen vorhanden",
    noFiles: "Keine Dateien vorhanden",
    ticketNotFound: "Kein Ticket gefunden",
    addReturnLabel: "Retoure beantragen",
    downloadReturnLabel: "Label herunterladen",
    selectPickupDate: "Abholtermin wählen",
    date: "Datum",
    customerType: "Kundentyp",
    websiteUrl: "Website URL",
    streetPostbox: "Straße / Postfach",
    customerNumber: "Kundennummer",
    country: "Land",
    postalCode: "PLZ",
    city: "Ort",
    extra: "Zusatz",
    matchcode: "Matchcode",
    kdnr: "Kdnr",
    ka: "KA",
    latitude: "Breitengrad",
    longitude: "Längengrad",
    phone: "Telefon",
    email: "E-Mail",
    personalData: "Persönliche Daten",
    salutation: "Anrede",
    title: "Titel",
    lastName: "Nachname",
    firstName: "Vorname",
    mobile: "Mobil",
    fax: "Fax",
    employee: "Mitarbeiter",
    privateSection: "Privat",
    responsibilities: "Zuständigkeiten",
    officeAddress: "Büroanschrift",
    personalAddress: "Privatanschrift",
    position: "Position",
    department: "Abteilung",
    managedBy: "Betreut von",
    copyLink: "Link kopieren",
    cookieDeprecated:
      "Diese Übersetzung ist aus Kompatibilitätsgründen eingestellt.",
  },
  en: {
    homeTitle: "Welcome",
    userName: "John Doe",
    userEmail: "john.doe@meinl.de",
    companies: "Companies",
    dealers: "Dealers",
    people: "People",
    all: "All",
    allCompanies: "All Companies",
    allPeople: "All People",
    searchCompanies: "Search companies ...",
    searchPeople: "Search people ...",
    createPerson: "Add person",
    dashboard: "Dashboard",
    search: "Search",
    startPage: "Home",
    campaigns: "Campaigns",
    tickets: "RMA Tickets",
    logout: "Sign out",
    source: "Source",
    language: "Language",
    companyLabel: "Company",
    personLabel: "Person",
    paginationTotal: "Total",
    backToStart: "Back to start",
    discard: "Discard",
    saveChanges: "Save changes",
    editData: "Edit data",
    companyDetails: "Company details",
    companyLogo: "Company logo",
    dealerLocator: "DealerLocator",
    dealer: "Dealer",
    employees: "Employees",
    details: "Details",
    addCampaign: "Add campaign",
    searchByName: "Search by name or kdnr ...",
    allCampaigns: "All Campaigns",
    ticketOverview: "Overview",
    ticketStats: "Analytics",
    createTicket: "Create ticket",
    allTickets: "All tickets",
    cancel: "Cancel",
    delete: "Delete",
    deleteConfirm: "Delete campaign permanently",
    noResults: "No results",
    invalidRequired: "is required",
    company: "Company",
    address: "Address",
    communication: "Communication",
    socialMedia: "Social Media",
    brands: "Brands",
    start: "Start",
    end: "End",
    searchByContact: "Search by name or kdnr ...",
    back: "Back",
    idLabel: "ID",
    nameLabel: "Name",
    dealerFor: "Dealer for",
    showInDealerLocator: "show in DealerLocator",
    noDealers: "No dealers found.",
    noEmployees: "No employees found.",
    noNotes: "No notes available",
    noFiles: "No files available",
    ticketNotFound: "No ticket found",
    addReturnLabel: "Create return",
    downloadReturnLabel: "Download label",
    selectPickupDate: "Select pickup date",
    date: "Date",
    customerType: "Customer type",
    websiteUrl: "Website URL",
    streetPostbox: "Street / PO Box",
    customerNumber: "Customer number",
    country: "Country",
    postalCode: "Postal code",
    city: "City",
    extra: "Extra",
    matchcode: "Matchcode",
    kdnr: "Kdnr",
    ka: "KA",
    latitude: "Latitude",
    longitude: "Longitude",
    phone: "Phone",
    email: "Email",
    salutation: "Salutation",
    title: "Title",
    lastName: "Last name",
    firstName: "First name",
    mobile: "Mobile",
    fax: "Fax",
    personalData: "Personal data",
    employee: "Employee",
    privateSection: "Private",
    responsibilities: "Responsibilities",
    officeAddress: "Office address",
    personalAddress: "Private address",
    position: "Position",
    department: "Department",
    managedBy: "Managed by",
    copyLink: "Copy link",
    customer: "Customer",
    shippingAddress: "",
    contactPerson: "",
    person: "",
    articleNumber: "",
    quantity: "",
    descriptionLabel: "",
    next: "",
    previous: "",
    selectCustomer: "",
    cookieDeprecated: "This translation is set for compatibility.",
  },
};

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations.de[key] ?? key;
}
