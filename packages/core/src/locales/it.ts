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
  code: { errorMessage: "Il codice di verifica non è valido", digitLabel: "Cifra :number" },
  colorpicker: { pickColor: "Scegli colore" },
  input: { togglePassword: "Mostra o nascondi password" },
  number: { increment: "Aumenta", decrement: "Diminuisci" },
  processing: { processing: "Elaborazione" },
  sortable: { dropHere: "Rilascia qui" },
  themeSwitcher: { light: "Chiaro", dark: "Scuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
  timepicker: { placeholder: "HH:MM", hour: "Ora", minute: "Minuto", ampm: "AM/PM" },
  rating: { label: "Valutazione", valueLabel: "Valutazione :value di :max" },
};

export default it;
