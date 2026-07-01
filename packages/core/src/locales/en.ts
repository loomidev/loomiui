import type { LoomiTranslations } from "./types.js";

export const en: LoomiTranslations = {
  common: {
    close: "Close",
    dismiss: "Dismiss",
    remove: "Remove",
    clear: "Clear",
    loading: "Loading",
  },
  validation: {
    requiredField: "Please fill out this field.",
    selectOption: "Please select an option.",
    selectFile: "Please select a file.",
    enterNumber: "Please enter a number.",
    selectTime: "Please select a time.",
  },
  datepicker: {
    placeholder: "Select a date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousYears: "Previous 12 years",
    nextYears: "Next 12 years",
    chooseMonth: "Choose month",
    chooseYear: "Choose year",
    dialog: "Date picker",
  },
  filepicker: {
    placeholderLine1: "Choose files or drag and drop to upload",
    placeholderLine2: "%s up to %s",
    cropTitle: "Crop image",
    cropApply: "Apply",
    cropCancel: "Cancel",
    fileTooLargeTitle: "File too large",
    fileTooLarge: "\":name\" exceeds the :limit limit.",
  },
  select: {
    placeholder: "Select One",
    emptyPlaceholder: "No options available",
    searchPlaceholder: "Search…",
  },
  countries: {
    placeholder: "Select a country",
    emptyPlaceholder: "No countries found",
    searchPlaceholder: "Search countries…",
    phoneNumberLabel: "Phone number",
    selectCountryCode: "Select country code",
  },
  table: {
    searchPlaceholder: "Search…",
    noDataMessage: "No records to display",
    actionsTitle: "actions",
  },
  pagination: {
    totalLabel: "Showing :a to :b of :c",
    noRecords: "No records",
    pageOf: "Page :page of :pages",
  },
  modal: {
    ok: "Okay",
    cancel: "Cancel",
    dialog: "Dialog",
  },
  drawer: {
    dialog: "Drawer",
  },
  pin: {
    errorMessage: "Verification code is invalid",
    digitLabel: "Digit :number",
  },
  colorpicker: {
    pickColor: "Pick color",
  },
  emojiPicker: {
    placeholder: "Pick an emoji",
    searchPlaceholder: "Search emoji",
    emptyText: "No emoji found",
    dialog: "Emoji",
  },
  input: {
    togglePassword: "Toggle password visibility",
  },
  number: {
    increment: "Increment",
    decrement: "Decrement",
  },
  processing: {
    processing: "Processing",
  },
  sortable: {
    dropHere: "Drop here",
  },
  themeSwitcher: {
    light: "Light",
    dark: "Dark",
    system: "System",
    theme: "Theme",
    selectedTheme: "Theme: :theme",
  },
  timepicker: {
    placeholder: "HH:MM",
    hour: "Hour",
    minute: "Minute",
    ampm: "AM/PM",
  },
  timezonepicker: {
    placeholder: "Select a timezone",
    emptyPlaceholder: "No timezones found",
    searchPlaceholder: "Search timezones…",
    detectLabel: "Use my timezone",
  },
  creditcard: {
    cardholderLabel: "Card Holder",
    expiresLabel: "Expires",
    namePlaceholder: "Full Name",
    numberLabel: "Card number",
    cvcLabel: "Security code",
    flipToBack: "Show security code",
    flipToFront: "Back to card",
  },
  rating: {
    label: "Rating",
    valueLabel: "Rating :value of :max",
  },
  mention: {
    emptyPlaceholder: "No matches",
  },
};

export default en;
