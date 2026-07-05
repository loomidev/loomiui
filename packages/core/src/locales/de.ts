import type { LoomiTranslations } from "./types.js";

export const de: LoomiTranslations = {
  common: { close: "Schließen", dismiss: "Ausblenden", remove: "Entfernen", clear: "Leeren", loading: "Wird geladen" },
  validation: {
    requiredField: "Bitte füllen Sie dieses Feld aus.",
    selectOption: "Bitte wählen Sie eine Option aus.",
    selectFile: "Bitte wählen Sie eine Datei aus.",
    enterNumber: "Bitte geben Sie eine Zahl ein.",
    selectTime: "Bitte wählen Sie eine Uhrzeit aus.",
  },
  datepicker: {
    placeholder: "Datum auswählen",
    previousMonth: "Vorheriger Monat",
    nextMonth: "Nächster Monat",
    previousYears: "Vorherige 12 Jahre",
    nextYears: "Nächste 12 Jahre",
    chooseMonth: "Monat auswählen",
    chooseYear: "Jahr auswählen",
    dialog: "Datumsauswahl",
  },
  filepicker: { placeholderLine1: "Dateien auswählen oder zum Hochladen hier ablegen", placeholderLine2: "%s bis %s", cropTitle: "Bild zuschneiden", cropApply: "Anwenden", cropCancel: "Abbrechen", fileTooLargeTitle: "Datei zu groß", fileTooLarge: "\":name\" überschreitet das Limit von :limit." },
  select: { placeholder: "Auswählen", emptyPlaceholder: "Keine Optionen verfügbar", searchPlaceholder: "Suchen..." },
  countries: { placeholder: "Land auswählen", emptyPlaceholder: "Keine Länder gefunden", searchPlaceholder: "Länder suchen...", phoneNumberLabel: "Telefonnummer", selectCountryCode: "Landesvorwahl auswählen" },
  table: { searchPlaceholder: "Suchen...", noDataMessage: "Keine Einträge vorhanden", actionsTitle: "Aktionen" },
  pagination: { totalLabel: "Zeige :a bis :b von :c", noRecords: "Keine Einträge", pageOf: "Seite :page von :pages" },
  modal: { ok: "OK", cancel: "Abbrechen", dialog: "Dialog" },
  drawer: { dialog: "Seitenleiste" },
  floatingPanel: { dialog: "Schwebendes Panel", move: "Verschieben", resize: "Größe ändern" },
  pin: { errorMessage: "Der Bestätigungscode ist ungültig", digitLabel: "Ziffer :number", validating: "Code wird überprüft…", valid: "Code bestätigt" },
  colorpicker: { pickColor: "Farbe wählen" },
  input: { togglePassword: "Passwortsichtbarkeit umschalten" },
  number: { increment: "Erhöhen", decrement: "Verringern" },
  processing: { processing: "Wird verarbeitet" },
  sortable: { dropHere: "Hier ablegen" },
  themeSwitcher: { light: "Hell", dark: "Dunkel", system: "System", theme: "Design", selectedTheme: "Design: :theme" },
  timepicker: { placeholder: "HH:MM", hour: "Stunde", minute: "Minute", ampm: "AM/PM", toggleFormat: "12/24-Stunden-Format umschalten" },
  timezonepicker: { placeholder: "Zeitzone auswählen", emptyPlaceholder: "Keine Zeitzonen gefunden", searchPlaceholder: "Zeitzonen suchen...", detectLabel: "Meine Zeitzone verwenden" },
  creditcard: { cardholderLabel: "Karteninhaber", expiresLabel: "Gültig bis", namePlaceholder: "Vollständiger Name", numberLabel: "Kartennummer", cvcLabel: "Sicherheitscode", flipToBack: "Sicherheitscode anzeigen", flipToFront: "Zurück zur Karte" },
  rating: { label: "Bewertung", valueLabel: "Bewertung :value von :max" },
  mention: { emptyPlaceholder: "Keine Treffer" },
};

export default de;
