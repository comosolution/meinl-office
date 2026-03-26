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
  | "employee"
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
  | "brand"
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
  | "kdnr"
  | "matchcode"
  | "matchcodeStartsWith"
  | "kdnrStartsWith"
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
  | "hobbies"
  | "musicGenre"
  | "instrument"
  | "dateOfBirth"
  | "maritalStatus"
  | "tShirtSize"
  | "street"
  | "poBox"
  | "additional"
  | "name"
  | "name1"
  | "name2"
  | "name3"
  | "serialNumber"
  | "orderType"
  | "streetAndNumber"
  | "zip"
  | "additionalShipping"
  | "status"
  | "editTicket"
  | "save"
  | "files"
  | "uploadFiles"
  | "upload"
  | "download"
  | "comment"
  | "ticketId"
  | "createdOn"
  | "created"
  | "rmaFrom"
  | "downloadLaufzettel"
  | "edit"
  | "customerX"
  | "tabDetails"
  | "tabFiles"
  | "tabHistory"
  | "articleNumberKu"
  | "articleNumberMei"
  | "serialNumberKu"
  | "serialNumberMei"
  | "description"
  | "newStatus"
  | "newCompany"
  | "newPerson"
  | "newCampaign"
  | "newTicket"
  | "showAllTickets"
  | "createReturn"
  | "pleaseEnterTitle"
  | "error"
  | "openLink"
  | "linkCopied"
  | "participatingDealers"
  | "searchByNameOrKdnr"
  | "notActivatedForDealerLocator"
  | "offeredProducts"
  | "searchByArticleNumber"
  | "modified"
  | "filter"
  | "results"
  | "export"
  | "byCustomer"
  | "byArticleNumber"
  | "total"
  | "orders"
  | "history"
  | "days90"
  | "months12"
  | "years5"
  | "allCustomers"
  | "allArticles"
  | "cookieDeprecated"
  | "reset";

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
    searchCompanies: "Firma suchen ...",
    searchPeople: "Person suchen ...",
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
    brand: "Brand",
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
    matchcodeStartsWith: "Matchcode beginnt mit",
    kdnrStartsWith: "Kdnr beginnt mit",
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
    hobbies: "Hobbies",
    musicGenre: "Musikrichtung",
    instrument: "Instrument",
    dateOfBirth: "Geburtsdatum",
    maritalStatus: "Familienstand",
    tShirtSize: "T-Shirt",
    street: "Straße",
    poBox: "Postfach",
    additional: "Zusatz",
    name: "Name",
    name1: "Name 1",
    name2: "Name 2",
    name3: "Name 3",
    serialNumber: "Seriennummer",
    orderType: "Auftragsart",
    streetAndNumber: "Straße & Nr.",
    zip: "PLZ",
    additionalShipping: "Zusatz",
    status: "Status",
    editTicket: "Ticket bearbeiten",
    save: "Speichern",
    files: "Dateien",
    uploadFiles: "Bilder oder PDFs auswählen",
    upload: "Hochladen",
    download: "Herunterladen",
    comment: "Notiz",
    ticketId: "Ticket ID",
    createdOn: "Erstellt am",
    created: "Erstellt",
    rmaFrom: "RMA von",
    downloadLaufzettel: "Laufzettel herunterladen",
    edit: "Bearbeiten",
    customerX: "Kunde {kdnr}",
    tabDetails: "Details",
    tabFiles: "Dateien",
    tabHistory: "Historie",
    articleNumberKu: "Artikelnummer (ext)",
    articleNumberMei: "Artikelnummer (int)",
    serialNumberKu: "Seriennummer (ext)",
    serialNumberMei: "Seriennummer (int)",
    description: "Beschreibung",
    newStatus: "Neuer Status",
    newCompany: "Neue Firma",
    newPerson: "Neue Person",
    newCampaign: "Neue Kampagne",
    newTicket: "Neues RMA Ticket",
    showAllTickets: "Alle Tickets anzeigen",
    createReturn: "Retoure beantragen",
    pleaseEnterTitle: "Bitte Titel angeben.",
    error: "Fehler",
    openLink: "Link öffnen",
    linkCopied: "Link kopiert",
    participatingDealers: "Teilnehmende Händler",
    searchByNameOrKdnr: "Nach Name oder Kdnr suchen ...",
    notActivatedForDealerLocator: "ist für den DealerLocator nicht aktiviert.",
    offeredProducts: "Angebotene Produkte",
    searchByArticleNumber: "Nach Artikelnummer suchen ...",
    modified: "Bearbeitet",
    filter: "Filtern ...",
    results: "Ergebnisse",
    export: "Exportieren",
    byCustomer: "Nach Kunde",
    byArticleNumber: "Nach Artikelnummer",
    total: "Insgesamt",
    orders: "Bestellungen",
    history: "Historie",
    days90: "90 Tage",
    months12: "12 Monate",
    years5: "5 Jahre",
    allCustomers: "Alle Kunden",
    allArticles: "Alle Artikel",
    cookieDeprecated:
      "Diese Übersetzung ist aus Kompatibilitätsgründen eingestellt.",
    reset: "Zurücksetzen",
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
    brand: "Brand",
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
    matchcodeStartsWith: "Matchcode starts with",
    kdnrStartsWith: "Kdnr starts with",
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
    employee: "Employee",
    personalData: "Personal data",
    privateSection: "Private",
    responsibilities: "Responsibilities",
    officeAddress: "Office address",
    personalAddress: "Private address",
    position: "Position",
    department: "Department",
    managedBy: "Managed by",
    copyLink: "Copy link",
    customer: "Customer",
    shippingAddress: "Shipping address",
    contactPerson: "Contact person",
    person: "Person",
    articleNumber: "Article number",
    quantity: "Quantity",
    descriptionLabel: "Description",
    next: "Next",
    previous: "Previous",
    selectCustomer: "Enter customer number or name",
    hobbies: "Hobbies",
    musicGenre: "Music genre",
    instrument: "Instrument",
    dateOfBirth: "Date of birth",
    maritalStatus: "Marital status",
    tShirtSize: "T-shirt size",
    street: "Street",
    poBox: "P.O. box",
    additional: "Additional",
    name: "Name",
    name1: "Name 1",
    name2: "Name 2",
    name3: "Name 3",
    serialNumber: "Serial number",
    orderType: "Order type",
    streetAndNumber: "Street & No.",
    zip: "ZIP",
    additionalShipping: "Additional",
    status: "Status",
    editTicket: "Edit ticket",
    save: "Save",
    files: "Files",
    uploadFiles: "Select images or PDFs",
    upload: "Upload",
    download: "Download",
    comment: "Note",
    ticketId: "Ticket ID",
    createdOn: "Created on",
    created: "Created",
    rmaFrom: "RMA from",
    downloadLaufzettel: "Download tracking sheet",
    edit: "Edit",
    customerX: "Customer {kdnr}",
    tabDetails: "Details",
    tabFiles: "Files",
    tabHistory: "History",
    articleNumberKu: "Article number (ext)",
    articleNumberMei: "Article number (int)",
    serialNumberKu: "Serial number (ext)",
    serialNumberMei: "Serial number (int)",
    description: "Description",
    newStatus: "New status",
    newCompany: "New company",
    newPerson: "New person",
    newCampaign: "New campaign",
    newTicket: "New RMA ticket",
    showAllTickets: "Show all tickets",
    createReturn: "Request return",
    pleaseEnterTitle: "Please enter title.",
    error: "Error",
    openLink: "Open link",
    linkCopied: "Link copied",
    participatingDealers: "Participating dealers",
    searchByNameOrKdnr: "Search by name or kdnr ...",
    notActivatedForDealerLocator: "is not activated for the DealerLocator.",
    offeredProducts: "Offered products",
    searchByArticleNumber: "Search by article number ...",
    modified: "Modified",
    filter: "Filter ...",
    results: "results",
    export: "Export",
    byCustomer: "By customer",
    byArticleNumber: "By article number",
    total: "Total",
    orders: "Orders",
    history: "History",
    days90: "90 days",
    months12: "12 months",
    years5: "5 years",
    allCustomers: "All customers",
    allArticles: "All articles",
    cookieDeprecated: "This translation is set for compatibility.",
    reset: "Reset",
  },
};

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations.de[key] ?? key;
}
