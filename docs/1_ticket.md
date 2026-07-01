---
hidden: OFFUSA
---

# RMA Tickets

> RMA Tickets sind aktuell nur in der Office Deutschland verfügbar.

## Startseite

![Startseite – Übersicht aller Tickets mit Filtern, Navigationssidebar und Tabelle mit Spalten ID, Status, Unternehmen, Kundennummer, Name, Erstellt](/docs/ticket/startseite.png)

## Filter

Die zur Verfügung stehenden Filterfelder stehen in allen Ansichten zur Verfügung:

![Filterleiste mit Feldern: Erstellt von, Status, Unternehmen, Kundennummer, Name, Artikelnummer, Erstellt, Kundenart sowie Buttons „Filter zurücksetzen" und „Exportieren"](/docs/ticket/filter.png)

| Feld              | Beschreibung                                                 |
| ----------------- | ------------------------------------------------------------ |
| **Erstellt von**  | Filterung nach Ersteller des Tickets                         |
| **Status**        | Status des Tickets                                           |
| **Unternehmen**   | Name des Unternehmens, dem das Ticket zugeordnet ist         |
| **Kundennummer**  | Kundennummer, der das Ticket zugeordnet ist                  |
| **Name**          | Name des Mitarbeiters der o.g. Firma                         |
| **Artikelnummer** | Die im Ticket angegebene Artikelnummer                       |
| **Erstellt**      | Erstellungszeitpunkt, bzw. -raum                             |
| **Kundenart**     | Filtermöglichkeiten sind „Alle", „Ohne Export", „Nur Export" |

Das Feld **„Ticket suchen"** rechts oben neben „Ticket erstellen" bietet die Möglichkeit einer Volltextsuche über alle Tickets – dabei wird sämtlicher Text aller Tickets durchsucht – hilfreich bei der Suche nach Schlagworten aus dem Beschreibungsfeld.

Das Datumsfeld „Erstellt" öffnet einen Kalender mit Schnellauswahl-Optionen (Heute, Gestern, Diese Woche, Letzte Woche, Dieser Monat, Letzter Monat, Dieses Jahr) sowie einer Monatsansicht zur manuellen Auswahl.

## Ansichten

### „Alle Tickets"

Die Standard-Ansicht ist „Alle Tickets" – dort werden alle Tickets angezeigt, die es im RMA gibt.

Sollte vor einem Ticket ein **„Auge"-Icon** (👁) angezeigt werden, bedeutet das, dass dieses Ticket durch einen User aus der Ansicht „Neu" ausgeblendet wurde. Durch Klicken auf das Icon wird das Ticket wieder in „Neu" angezeigt.

### „Neu"

In dieser Ansicht werden alle Tickets angezeigt, die neu eingegangen sind (Status = 100). Durch das Icon **„Durchgestrichenes Auge"** kann das Ticket ausgeblendet werden.

### „Meine"

Zeigt Tickets an, die vom angemeldeten Benutzer erstellt wurden.

### „Zuletzt angesehen"

Die Historie der vom angemeldeten Benutzer angesehenen/bearbeiteten Tickets.

### „Auswertungen"

Überblick über Tickets mit verschiedenen Filtermöglichkeiten.

## Ticketerstellung

Über den Button **„Ticket erstellen"** rechts oben wird die Anlage eines neuen Tickets gestartet. Beim Tippen werden hier (wie in den meisten Eingabefeldern bei der Anlage) mögliche Treffer vorgeschlagen:

### Schritt 1 – Kunde

![Dialog „Ticket erstellen" – Schritt Kunde: Eingabefeld „Kunde" mit Suchbegriff „730" und Dropdown-Liste mit Treffern (z.B. Musik Schmid, Christian Neuner, Klaus Paulus usw.) – Fortschrittsleiste mit Schritten Kunde, Kontaktperson, Details](/docs/ticket/erstellen_kunde.png)

Nach der Auswahl des gewünschten Kunden wird (insofern vorhanden) eine Versandadresse vorbelegt:

![Dialog „Ticket erstellen" – Schritt Kunde: Kunde „Testkunde B2B" ausgewählt, Versandadresse vorbelegt mit Name 1, Straße & Nr., PLZ, Ort, Land – Button „Weiter" unten rechts](/docs/ticket/erstellen_versandadresse.png)

Sollten mehrere Versandadressen hinterlegt sein, kann man eine andere aus der Auswahlliste bei „Versandadresse" auswählen.

Weiter mit **„Weiter"** …

### Schritt 2 – Kontaktperson

![Dialog „Ticket erstellen" – Schritt Kontaktperson: Dropdown mit allen Kontakten des gewählten Kunden (z.B. aaaa b bb, No B2BNumber, AAAA BBBB usw.) – Fortschrittsleiste zeigt Schritt Kunde als abgehakt](/docs/ticket/erstellen_kontaktperson.png)

Weiter mit **„Weiter"** …

### Schritt 3 – Details

![Dialog „Ticket erstellen" – Schritt Details: Felder Artikelnummer (mit Suche, z.B. „ts9" zeigt TS9, TS9-TESTAD, TS9/DX-PACK usw.), Seriennummer, Menge – Button „Bilder oder PDFs auswählen" sowie Buttons „Zurück" und „Ticket erstellen"](/docs/ticket/erstellen_details.png)

Mit der Schaltfläche **„Bilder und PDFs auswählen"** lassen sich Anhänge zum Ticket hinzufügen.

Mit dem Button **„Ticket erstellen"** wird die Erfassung abgeschlossen und man landet wieder in der Startansicht.

## Bearbeitung von Tickets

Um ein Ticket zu bearbeiten, öffnet man es und klickt den Button **„Ticket bearbeiten"** auf der rechten Seite.

Dadurch werden die Felder bearbeitbar und man kann z.B. die kundenseitige ArtNr oder Seriennummer übernehmen:

![Detailbereich eines Tickets: links „Artikelnummer (Kunde)" mit Wert IBB541-BE und Pfeil-Button zum Übernehmen, rechts leeres Feld „Artikelnummer (Meinl)" mit Lupe – darunter analog Seriennummer (Kunde) und Seriennummer (Meinl)](/docs/ticket/bearbeiten_details.png)

bzw. korrigieren:

![Gleicher Detailbereich im Bearbeitungsmodus: beide rechten Felder (Artikelnummer Meinl, Seriennummer Meinl) sind rot umrandet und editierbar](/docs/ticket/bearbeiten_details_edit.png)

Mit dem **„Speichern"-Button** rechts werden die Änderungen übernommen.

## Notizen

Das Hinzufügen von Notizen ist auch ohne vorherige Bearbeitung des Tickets möglich:

![Ticket 29-4483CA mit Status „RMA PRÜFUNG SERVICE (150)": Detailbereich mit Artikelnummer TS9-TESTAD, Beschreibung „TEST", Menge 1 – darunter Historiebereich mit drei Einträgen (Statusänderungen) und Button „+ Eintrag hinzufügen"](/docs/ticket/notizen_ticket.png)

### Neuen Eintrag hinzufügen

![Dialog „Neuer Eintrag": Kommentar-Textfeld, Buttons „Öffentlich" und „Privat", Bereich „Bilder oder PDFs auswählen", Checkboxen „WICHTIG!" und „Per Mail senden", Buttons „Abbrechen" und „+ Eintrag hinzufügen"](/docs/ticket/notizen_neu.png)

Man kann eine Notiz **öffentlich** oder **privat** machen.

- **Öffentlich** – die Notiz ist für den Kunden im B2B-Serviceportal sichtbar.
- **Privat** – die Notiz ist nur für RM-Mitarbeiter sichtbar (z.B. als Hinweis für einen Kollegen).

Die Checkbox **„WICHTIG!"** sorgt dafür, dass die Notiz im Ticket rot dargestellt wird:

![Historiebereich: zwei Einträge von Grund, Sebastian – oberer mit grauem Icon und Text „nicht wichtig", unterer mit rotem Icon und rotem Text „wichtig"](/docs/ticket/notizen_wichtig.png)

Durch Aktivierung von **„Per Mail senden"** wird die Notiz zusätzlich per Mail geschickt – bei einer öffentlichen Notiz geht die Mail an den Ticketersteller:

![„Per Mail senden" aktiviert – Hinweistext: Der Ticketersteller bekommt diesen Kommentar zusätzlich per Mail geschickt](/docs/ticket/notizen_mail_oeffentlich.png)

Bei einer **privaten Notiz** können über **„Empfänger hinzufügen"** ein oder mehrere Empfänger angegeben werden:

![„Per Mail senden" aktiviert – zwei Empfänger-Zeilen mit E-Mail-Adressen und je einem Entfernen-Button rechts – darunter Button „Empfänger hinzufügen"](/docs/ticket/notizen_mail_privat.png)

Einen bereits angegebenen Empfänger kann man mit der Schaltfläche rechts entfernen.

Mit **„Eintrag hinzufügen"** wird die Notiz gespeichert.

## Anhänge nachreichen

Im Ticket auf **„Bilder oder PDFs auswählen"** klicken, Dateien auswählen, **„Hochladen"** klicken, fertig.

![Bereich „Dateien": Schaltfläche „Bilder oder PDFs auswählen", darunter eine ausgewählte Datei „DPD old credentials.png" mit X-Button zum Entfernen, darunter roter Button „Hochladen"](/docs/ticket/anhaenge.png)

Das Ticket muss hierfür nicht bearbeitet werden.

## Retoure beantragen

In einem Ticket hat man rechts oben die Möglichkeit, eine Retoure einzuleiten:

![Ticketkopf mit Buttons „Retoure beantragen" und „Laufzettel herunterladen" rechts oben – darunter Ticket-ID, Status, Ersteller, Versandadresse und Details](/docs/ticket/retoure_ticket.png)

Aktuell stehen **DHL** und **GLS** als Dienstleister zur Verfügung. Wenn man mit der Maus über den Button geht, sieht man, wie viele Vorgänge mit dem jeweiligen Dienstleister vorgenommen wurden:

![Hover-Menü „Retoure beantragen": DHL mit Zähler 5, GLS mit Zähler 0](/docs/ticket/retoure_auswahl.png)

### DHL

Es wird die im Ticket hinterlegte Versandadresse vorbelegt, sowie die E-Mail-Adresse des Melders – an diese Adresse wird das Retoure-Label geschickt (darüber hinaus kann der Kunde sich das Label auch im B2B-Serviceportal herunterladen).

![Dialog „Retoure beantragen" (DHL): vorausgefüllte Versandadresse, E-Mail-Feld, Mengenfeld, Buttons „Abbrechen" und „Retoure beantragen"](/docs/ticket/retoure_dhl.png)

Im Ticket rechts unten können erstellte Retoure-Labels über das **Download-Icon** heruntergeladen, bzw. die **Paketverfolgung** (Link-Icon ↗) aufgerufen werden:

![Bereich „Tracking": zwei Einträge „DHL 545299160180" und „DHL 545299160146", je mit Link-Icon und Download-Icon](/docs/ticket/retoure_tracking.png)

### GLS

Ähnlich bei GLS, aber hier muss ein **Abholtermin** ausgewählt und eine **Telefonnummer** eingetragen werden:

![Dialog „Abholtermin wählen" (GLS): Kalenderansicht Juni 2026 mit Datum 30 rot markiert, darunter vorausgefüllte Versandadresse, E-Mail-Feld, Telefon-Feld, Mengenfeld, Buttons „Abbrechen" und „Termin buchen"](/docs/ticket/retoure_gls.png)

## Laufzettel

Neben dem Retoure-Button kann man sich mittels Button einen **Laufzettel** herunterladen, der folgende Infos beinhaltet:

![Laufzettel-Dokument mit Tabelle: Ticket ID, Erstellt am, Kunde, Artikelnummer, Seriennummer, Fehlerbeschreibung, Menge, Status – darunter Barcode und QR-Code mit der Ticket-ID](/docs/ticket/laufzettel.png)

| Feld               | Inhalt                                      |
| ------------------ | ------------------------------------------- |
| Ticket ID          | Eindeutige Ticket-Nummer                    |
| Erstellt am        | Datum und Uhrzeit der Erstellung            |
| Kunde              | Kundennummer und Name                       |
| Artikelnummer      | Meinl-Artikelnummer                         |
| Seriennummer       | Seriennummer des Artikels (falls vorhanden) |
| Fehlerbeschreibung | Vom Melder eingetragene Beschreibung        |
| Menge              | Anzahl der betroffenen Artikel              |
| Status             | Aktueller Ticketstatus                      |

Der Laufzettel enthält außerdem einen **Barcode** und einen **QR-Code** mit der Ticket-ID zum schnellen Scannen.
