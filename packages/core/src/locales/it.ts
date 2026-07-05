import type { LoomiTranslations } from "./types.js";

export const it: LoomiTranslations = {
  common: { close: "Chiudi", dismiss: "Nascondi", remove: "Rimuovi", clear: "Cancella", loading: "Caricamento" },
  validation: {
    requiredField: "Compila questo campo.",
    selectOption: "Seleziona un'opzione.",
    selectFile: "Seleziona un file.",
    enterNumber: "Inserisci un numero.",
    selectTime: "Seleziona un orario.",
  },
  datepicker: {
    placeholder: "Seleziona una data",
    previousMonth: "Mese precedente",
    nextMonth: "Mese successivo",
    previousYears: "12 anni precedenti",
    nextYears: "12 anni successivi",
    chooseMonth: "Scegli mese",
    chooseYear: "Scegli anno",
    dialog: "Selettore data",
  },
  filepicker: { placeholderLine1: "Scegli file o trascinali qui per caricarli", placeholderLine2: "%s fino a %s", cropTitle: "Ritaglia immagine", cropApply: "Applica", cropCancel: "Annulla", fileTooLargeTitle: "File troppo grande", fileTooLarge: "\":name\" supera il limite di :limit." },
  select: { placeholder: "Seleziona", emptyPlaceholder: "Nessuna opzione disponibile", searchPlaceholder: "Cerca..." },
  countries: { placeholder: "Seleziona un paese", emptyPlaceholder: "Nessun paese trovato", searchPlaceholder: "Cerca paesi...", phoneNumberLabel: "Numero di telefono", selectCountryCode: "Seleziona il prefisso internazionale" },
  table: { searchPlaceholder: "Cerca...", noDataMessage: "Nessun record da mostrare", actionsTitle: "azioni" },
  pagination: { totalLabel: "Visualizzazione da :a a :b di :c", noRecords: "Nessun record", pageOf: "Pagina :page di :pages" },
  modal: { ok: "OK", cancel: "Annulla", dialog: "Finestra di dialogo" },
  drawer: { dialog: "Pannello laterale" },
  floatingPanel: { dialog: "Pannello mobile", move: "Sposta", resize: "Ridimensiona" },
  pin: { errorMessage: "Il codice di verifica non è valido", digitLabel: "Cifra :number", validating: "Verifica del codice…", valid: "Codice verificato" },
  colorpicker: { pickColor: "Scegli colore" },
  input: { togglePassword: "Mostra o nascondi password" },
  number: { increment: "Aumenta", decrement: "Diminuisci" },
  processing: { processing: "Elaborazione" },
  sortable: { dropHere: "Rilascia qui" },
  themeSwitcher: { light: "Chiaro", dark: "Scuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
  timepicker: { placeholder: "HH:MM", hour: "Ora", minute: "Minuto", ampm: "AM/PM", toggleFormat: "Alterna formato 12/24 ore" },
  timezonepicker: { placeholder: "Seleziona un fuso orario", emptyPlaceholder: "Nessun fuso orario trovato", searchPlaceholder: "Cerca fusi orari...", detectLabel: "Usa il mio fuso orario" },
  creditcard: { cardholderLabel: "Titolare della carta", expiresLabel: "Scadenza", namePlaceholder: "Nome completo", numberLabel: "Numero della carta", cvcLabel: "Codice di sicurezza", flipToBack: "Mostra codice di sicurezza", flipToFront: "Torna alla carta" },
  rating: { label: "Valutazione", valueLabel: "Valutazione :value di :max" },
  mention: { emptyPlaceholder: "Nessuna corrispondenza" },
};

export default it;
