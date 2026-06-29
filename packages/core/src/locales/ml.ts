import type { LoomiTranslations } from "./types.js";

export const ml: LoomiTranslations = {
  common: { close: "അടയ്ക്കുക", dismiss: "ഒഴിവാക്കുക", remove: "നീക്കം ചെയ്യുക", clear: "മായ്ക്കുക", loading: "ലോഡുചെയ്യുന്നു" },
  validation: {
    requiredField: "ദയവായി ഈ ഫീൽഡ് പൂരിപ്പിക്കുക.",
    selectOption: "ദയവായി ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക.",
    selectFile: "ദയവായി ഒരു ഫയൽ തിരഞ്ഞെടുക്കുക.",
    enterNumber: "ദയവായി ഒരു നമ്പർ നൽകുക.",
    selectTime: "ദയവായി സമയം തിരഞ്ഞെടുക്കുക.",
  },
  datepicker: {
    placeholder: "തീയതി തിരഞ്ഞെടുക്കുക",
    previousMonth: "മുൻ മാസം",
    nextMonth: "അടുത്ത മാസം",
    previousYears: "മുൻ 12 വർഷങ്ങൾ",
    nextYears: "അടുത്ത 12 വർഷങ്ങൾ",
    chooseMonth: "മാസം തിരഞ്ഞെടുക്കുക",
    chooseYear: "വർഷം തിരഞ്ഞെടുക്കുക",
    dialog: "തീയതി തിരഞ്ഞെടുക്കൽ",
  },
  filepicker: { placeholderLine1: "ഫയലുകൾ തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യാൻ വലിച്ചിടുക", placeholderLine2: "%s %s വരെ", cropTitle: "ചിത്രം ക്രോപ്പ് ചെയ്യുക", cropApply: "പ്രയോഗിക്കുക", cropCancel: "റദ്ദാക്കുക", fileTooLargeTitle: "ഫയൽ വളരെ വലുതാണ്", fileTooLarge: "\":name\" പരിധി :limit കവിയുന്നു." },
  select: { placeholder: "ഒന്ന് തിരഞ്ഞെടുക്കുക", emptyPlaceholder: "ഓപ്ഷനുകളൊന്നും ലഭ്യമല്ല", searchPlaceholder: "തിരയുക..." },
  countries: { placeholder: "ഒരു രാജ്യം തിരഞ്ഞെടുക്കുക", emptyPlaceholder: "രാജ്യങ്ങളൊന്നും കണ്ടെത്തിയില്ല", searchPlaceholder: "രാജ്യങ്ങൾ തിരയുക...", phoneNumberLabel: "ഫോൺ നമ്പർ", selectCountryCode: "കൺട്രി കോഡ് തിരഞ്ഞെടുക്കുക" },
  table: { searchPlaceholder: "തിരയുക...", noDataMessage: "കാണിക്കാൻ രേഖകളില്ല", actionsTitle: "നടപടികൾ" },
  pagination: { totalLabel: ":c ൽ :a മുതൽ :b വരെ കാണിക്കുന്നു", noRecords: "രേഖകളില്ല", pageOf: "പേജ് :page / :pages" },
  modal: { ok: "ശരി", cancel: "റദ്ദാക്കുക", dialog: "ഡയലോഗ്" },
  drawer: { dialog: "ഡ്രോയർ" },
  code: { errorMessage: "സ്ഥിരീകരണ കോഡ് അസാധുവാണ്", digitLabel: "അക്കം :number" },
  colorpicker: { pickColor: "നിറം തിരഞ്ഞെടുക്കുക" },
  input: { togglePassword: "പാസ്‌വേഡ് ദൃശ്യമാക്കൽ മാറ്റുക" },
  number: { increment: "കൂട്ടുക", decrement: "കുറയ്ക്കുക" },
  processing: { processing: "പ്രോസസ്സ് ചെയ്യുന്നു" },
  sortable: { dropHere: "ഇവിടെ ഇടുക" },
  themeSwitcher: { light: "ലൈറ്റ്", dark: "ഡാർക്ക്", system: "സിസ്റ്റം", theme: "തീം", selectedTheme: "തീം: :theme" },
  timepicker: { placeholder: "HH:MM", hour: "മണിക്കൂർ", minute: "മിനിറ്റ്", ampm: "AM/PM" },
  rating: { label: "റേറ്റിംഗ്", valueLabel: "റേറ്റിംഗ് :value / :max" },
};

export default ml;
