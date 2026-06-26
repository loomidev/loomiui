export type LoomiLocale = "en" | "ar" | "de" | "es" | "fr" | "it" | "ml" | "pt_BR" | "tr" | "zh_CN" | string;

type LoomiTranslationValue = string | string[] | LoomiTranslationTree;
export interface LoomiTranslationTree {
  [key: string]: LoomiTranslationValue;
}

export type LoomiTranslations = LoomiTranslationTree;

const DEFAULT_LOCALE = "en";
let activeLocale = DEFAULT_LOCALE;

const en: LoomiTranslations = {
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
  },
  select: {
    placeholder: "Select One",
    emptyPlaceholder: "No options available",
    searchPlaceholder: "Search…",
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
  code: {
    errorMessage: "Verification code is invalid",
    digitLabel: "Digit :number",
  },
  colorpicker: {
    pickColor: "Pick color",
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
  rating: {
    label: "Rating",
    valueLabel: "Rating :value of :max",
  },
};

export const loomiTranslations: Record<string, LoomiTranslations> = {
  en,
  ar: {
    common: { close: "إغلاق", dismiss: "استبعاد", remove: "إزالة", clear: "مسح", loading: "جار التحميل" },
    validation: {
      requiredField: "يرجى ملء هذا الحقل.",
      selectOption: "يرجى تحديد خيار.",
      selectFile: "يرجى تحديد ملف.",
      enterNumber: "يرجى إدخال رقم.",
      selectTime: "يرجى تحديد وقت.",
    },
    datepicker: {
      placeholder: "اختر تاريخا",
      previousMonth: "الشهر السابق",
      nextMonth: "الشهر التالي",
      previousYears: "السنوات 12 السابقة",
      nextYears: "السنوات 12 التالية",
      chooseMonth: "اختر الشهر",
      chooseYear: "اختر السنة",
      dialog: "منتقي التاريخ",
    },
    filepicker: { placeholderLine1: "اختر ملفات أو اسحبها وأفلتها للرفع", placeholderLine2: "%s حتى %s" },
    select: { placeholder: "اختر واحدا", emptyPlaceholder: "لا توجد خيارات متاحة", searchPlaceholder: "بحث..." },
    table: { searchPlaceholder: "بحث...", noDataMessage: "لا توجد سجلات للعرض", actionsTitle: "الإجراءات" },
    pagination: { totalLabel: "عرض :a إلى :b من :c", noRecords: "لا توجد سجلات", pageOf: "الصفحة :page من :pages" },
    modal: { ok: "موافق", cancel: "إلغاء", dialog: "مربع حوار" },
    code: { errorMessage: "رمز التحقق غير صالح", digitLabel: "الرقم :number" },
    colorpicker: { pickColor: "اختر لونا" },
    input: { togglePassword: "تبديل إظهار كلمة المرور" },
    number: { increment: "زيادة", decrement: "إنقاص" },
    processing: { processing: "جار المعالجة" },
    sortable: { dropHere: "أفلت هنا" },
    themeSwitcher: { light: "فاتح", dark: "داكن", system: "النظام", theme: "السمة", selectedTheme: "السمة: :theme" },
    timepicker: { placeholder: "س س:د د", hour: "الساعة", minute: "الدقيقة", ampm: "ص/م" },
    rating: { label: "التقييم", valueLabel: "التقييم :value من :max" },
  },
  de: {
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
    filepicker: { placeholderLine1: "Dateien auswählen oder zum Hochladen hier ablegen", placeholderLine2: "%s bis %s" },
    select: { placeholder: "Auswählen", emptyPlaceholder: "Keine Optionen verfügbar", searchPlaceholder: "Suchen..." },
    table: { searchPlaceholder: "Suchen...", noDataMessage: "Keine Einträge vorhanden", actionsTitle: "Aktionen" },
    pagination: { totalLabel: "Zeige :a bis :b von :c", noRecords: "Keine Einträge", pageOf: "Seite :page von :pages" },
    modal: { ok: "OK", cancel: "Abbrechen", dialog: "Dialog" },
    code: { errorMessage: "Der Bestätigungscode ist ungültig", digitLabel: "Ziffer :number" },
    colorpicker: { pickColor: "Farbe wählen" },
    input: { togglePassword: "Passwortsichtbarkeit umschalten" },
    number: { increment: "Erhöhen", decrement: "Verringern" },
    processing: { processing: "Wird verarbeitet" },
    sortable: { dropHere: "Hier ablegen" },
    themeSwitcher: { light: "Hell", dark: "Dunkel", system: "System", theme: "Design", selectedTheme: "Design: :theme" },
    timepicker: { placeholder: "HH:MM", hour: "Stunde", minute: "Minute", ampm: "AM/PM" },
    rating: { label: "Bewertung", valueLabel: "Bewertung :value von :max" },
  },
  es: {
    common: { close: "Cerrar", dismiss: "Descartar", remove: "Eliminar", clear: "Borrar", loading: "Cargando" },
    validation: {
      requiredField: "Completa este campo.",
      selectOption: "Selecciona una opción.",
      selectFile: "Selecciona un archivo.",
      enterNumber: "Introduce un número.",
      selectTime: "Selecciona una hora.",
    },
    datepicker: {
      placeholder: "Selecciona una fecha",
      previousMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      previousYears: "12 años anteriores",
      nextYears: "12 años siguientes",
      chooseMonth: "Elegir mes",
      chooseYear: "Elegir año",
      dialog: "Selector de fecha",
    },
    filepicker: { placeholderLine1: "Elige archivos o arrástralos para subirlos", placeholderLine2: "%s hasta %s" },
    select: { placeholder: "Selecciona una opción", emptyPlaceholder: "No hay opciones disponibles", searchPlaceholder: "Buscar..." },
    table: { searchPlaceholder: "Buscar...", noDataMessage: "No hay registros para mostrar", actionsTitle: "acciones" },
    pagination: { totalLabel: "Mostrando :a a :b de :c", noRecords: "No hay registros", pageOf: "Página :page de :pages" },
    modal: { ok: "Aceptar", cancel: "Cancelar", dialog: "Diálogo" },
    code: { errorMessage: "El código de verificación no es válido", digitLabel: "Dígito :number" },
    colorpicker: { pickColor: "Elegir color" },
    input: { togglePassword: "Alternar visibilidad de la contraseña" },
    number: { increment: "Incrementar", decrement: "Disminuir" },
    processing: { processing: "Procesando" },
    sortable: { dropHere: "Suelta aquí" },
    themeSwitcher: { light: "Claro", dark: "Oscuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
    timepicker: { placeholder: "HH:MM", hour: "Hora", minute: "Minuto", ampm: "a. m./p. m." },
    rating: { label: "Valoración", valueLabel: "Valoración :value de :max" },
  },
  fr: {
    common: { close: "Fermer", dismiss: "Masquer", remove: "Retirer", clear: "Effacer", loading: "Chargement" },
    validation: {
      requiredField: "Veuillez renseigner ce champ.",
      selectOption: "Veuillez sélectionner une option.",
      selectFile: "Veuillez sélectionner un fichier.",
      enterNumber: "Veuillez saisir un nombre.",
      selectTime: "Veuillez sélectionner une heure.",
    },
    datepicker: {
      placeholder: "Sélectionner une date",
      previousMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      previousYears: "12 années précédentes",
      nextYears: "12 années suivantes",
      chooseMonth: "Choisir le mois",
      chooseYear: "Choisir l'année",
      dialog: "Sélecteur de date",
    },
    filepicker: { placeholderLine1: "Choisissez des fichiers ou glissez-déposez-les pour les téléverser", placeholderLine2: "%s jusqu'à %s" },
    select: { placeholder: "Sélectionner", emptyPlaceholder: "Aucune option disponible", searchPlaceholder: "Rechercher..." },
    table: { searchPlaceholder: "Rechercher...", noDataMessage: "Aucun enregistrement à afficher", actionsTitle: "actions" },
    pagination: { totalLabel: "Affichage de :a à :b sur :c", noRecords: "Aucun enregistrement", pageOf: "Page :page sur :pages" },
    modal: { ok: "OK", cancel: "Annuler", dialog: "Dialogue" },
    code: { errorMessage: "Le code de vérification est invalide", digitLabel: "Chiffre :number" },
    colorpicker: { pickColor: "Choisir une couleur" },
    input: { togglePassword: "Afficher ou masquer le mot de passe" },
    number: { increment: "Augmenter", decrement: "Diminuer" },
    processing: { processing: "Traitement en cours" },
    sortable: { dropHere: "Déposer ici" },
    themeSwitcher: { light: "Clair", dark: "Sombre", system: "Système", theme: "Thème", selectedTheme: "Thème : :theme" },
    timepicker: { placeholder: "HH:MM", hour: "Heure", minute: "Minute", ampm: "AM/PM" },
    rating: { label: "Note", valueLabel: "Note :value sur :max" },
  },
  it: {
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
    filepicker: { placeholderLine1: "Scegli file o trascinali qui per caricarli", placeholderLine2: "%s fino a %s" },
    select: { placeholder: "Seleziona", emptyPlaceholder: "Nessuna opzione disponibile", searchPlaceholder: "Cerca..." },
    table: { searchPlaceholder: "Cerca...", noDataMessage: "Nessun record da mostrare", actionsTitle: "azioni" },
    pagination: { totalLabel: "Visualizzazione da :a a :b di :c", noRecords: "Nessun record", pageOf: "Pagina :page di :pages" },
    modal: { ok: "OK", cancel: "Annulla", dialog: "Finestra di dialogo" },
    code: { errorMessage: "Il codice di verifica non è valido", digitLabel: "Cifra :number" },
    colorpicker: { pickColor: "Scegli colore" },
    input: { togglePassword: "Mostra o nascondi password" },
    number: { increment: "Aumenta", decrement: "Diminuisci" },
    processing: { processing: "Elaborazione" },
    sortable: { dropHere: "Rilascia qui" },
    themeSwitcher: { light: "Chiaro", dark: "Scuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
    timepicker: { placeholder: "HH:MM", hour: "Ora", minute: "Minuto", ampm: "AM/PM" },
    rating: { label: "Valutazione", valueLabel: "Valutazione :value di :max" },
  },
  ml: {
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
    filepicker: { placeholderLine1: "ഫയലുകൾ തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യാൻ വലിച്ചിടുക", placeholderLine2: "%s %s വരെ" },
    select: { placeholder: "ഒന്ന് തിരഞ്ഞെടുക്കുക", emptyPlaceholder: "ഓപ്ഷനുകളൊന്നും ലഭ്യമല്ല", searchPlaceholder: "തിരയുക..." },
    table: { searchPlaceholder: "തിരയുക...", noDataMessage: "കാണിക്കാൻ രേഖകളില്ല", actionsTitle: "നടപടികൾ" },
    pagination: { totalLabel: ":c ൽ :a മുതൽ :b വരെ കാണിക്കുന്നു", noRecords: "രേഖകളില്ല", pageOf: "പേജ് :page / :pages" },
    modal: { ok: "ശരി", cancel: "റദ്ദാക്കുക", dialog: "ഡയലോഗ്" },
    code: { errorMessage: "സ്ഥിരീകരണ കോഡ് അസാധുവാണ്", digitLabel: "അക്കം :number" },
    colorpicker: { pickColor: "നിറം തിരഞ്ഞെടുക്കുക" },
    input: { togglePassword: "പാസ്‌വേഡ് ദൃശ്യമാക്കൽ മാറ്റുക" },
    number: { increment: "കൂട്ടുക", decrement: "കുറയ്ക്കുക" },
    processing: { processing: "പ്രോസസ്സ് ചെയ്യുന്നു" },
    sortable: { dropHere: "ഇവിടെ ഇടുക" },
    themeSwitcher: { light: "ലൈറ്റ്", dark: "ഡാർക്ക്", system: "സിസ്റ്റം", theme: "തീം", selectedTheme: "തീം: :theme" },
    timepicker: { placeholder: "HH:MM", hour: "മണിക്കൂർ", minute: "മിനിറ്റ്", ampm: "AM/PM" },
    rating: { label: "റേറ്റിംഗ്", valueLabel: "റേറ്റിംഗ് :value / :max" },
  },
  pt_BR: {
    common: { close: "Fechar", dismiss: "Dispensar", remove: "Remover", clear: "Limpar", loading: "Carregando" },
    validation: {
      requiredField: "Preencha este campo.",
      selectOption: "Selecione uma opção.",
      selectFile: "Selecione um arquivo.",
      enterNumber: "Digite um número.",
      selectTime: "Selecione um horário.",
    },
    datepicker: {
      placeholder: "Selecione uma data",
      previousMonth: "Mês anterior",
      nextMonth: "Próximo mês",
      previousYears: "12 anos anteriores",
      nextYears: "Próximos 12 anos",
      chooseMonth: "Escolher mês",
      chooseYear: "Escolher ano",
      dialog: "Seletor de data",
    },
    filepicker: { placeholderLine1: "Escolha arquivos ou arraste e solte para enviar", placeholderLine2: "%s até %s" },
    select: { placeholder: "Selecione", emptyPlaceholder: "Nenhuma opção disponível", searchPlaceholder: "Buscar..." },
    table: { searchPlaceholder: "Buscar...", noDataMessage: "Nenhum registro para exibir", actionsTitle: "ações" },
    pagination: { totalLabel: "Mostrando :a a :b de :c", noRecords: "Nenhum registro", pageOf: "Página :page de :pages" },
    modal: { ok: "OK", cancel: "Cancelar", dialog: "Diálogo" },
    code: { errorMessage: "O código de verificação é inválido", digitLabel: "Dígito :number" },
    colorpicker: { pickColor: "Escolher cor" },
    input: { togglePassword: "Alternar visibilidade da senha" },
    number: { increment: "Aumentar", decrement: "Diminuir" },
    processing: { processing: "Processando" },
    sortable: { dropHere: "Solte aqui" },
    themeSwitcher: { light: "Claro", dark: "Escuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
    timepicker: { placeholder: "HH:MM", hour: "Hora", minute: "Minuto", ampm: "AM/PM" },
    rating: { label: "Avaliação", valueLabel: "Avaliação :value de :max" },
  },
  tr: {
    common: { close: "Kapat", dismiss: "Kapat", remove: "Kaldır", clear: "Temizle", loading: "Yükleniyor" },
    validation: {
      requiredField: "Lütfen bu alanı doldurun.",
      selectOption: "Lütfen bir seçenek seçin.",
      selectFile: "Lütfen bir dosya seçin.",
      enterNumber: "Lütfen bir sayı girin.",
      selectTime: "Lütfen bir saat seçin.",
    },
    datepicker: {
      placeholder: "Tarih seçin",
      previousMonth: "Önceki ay",
      nextMonth: "Sonraki ay",
      previousYears: "Önceki 12 yıl",
      nextYears: "Sonraki 12 yıl",
      chooseMonth: "Ay seç",
      chooseYear: "Yıl seç",
      dialog: "Tarih seçici",
    },
    filepicker: { placeholderLine1: "Dosya seçin veya yüklemek için sürükleyip bırakın", placeholderLine2: "%s en fazla %s" },
    select: { placeholder: "Seçin", emptyPlaceholder: "Kullanılabilir seçenek yok", searchPlaceholder: "Ara..." },
    table: { searchPlaceholder: "Ara...", noDataMessage: "Gösterilecek kayıt yok", actionsTitle: "işlemler" },
    pagination: { totalLabel: ":c kayıttan :a ile :b arası gösteriliyor", noRecords: "Kayıt yok", pageOf: "Sayfa :page / :pages" },
    modal: { ok: "Tamam", cancel: "İptal", dialog: "İletişim kutusu" },
    code: { errorMessage: "Doğrulama kodu geçersiz", digitLabel: "Rakam :number" },
    colorpicker: { pickColor: "Renk seç" },
    input: { togglePassword: "Parola görünürlüğünü değiştir" },
    number: { increment: "Artır", decrement: "Azalt" },
    processing: { processing: "İşleniyor" },
    sortable: { dropHere: "Buraya bırak" },
    themeSwitcher: { light: "Açık", dark: "Koyu", system: "Sistem", theme: "Tema", selectedTheme: "Tema: :theme" },
    timepicker: { placeholder: "SS:DD", hour: "Saat", minute: "Dakika", ampm: "ÖÖ/ÖS" },
    rating: { label: "Puan", valueLabel: ":max üzerinden :value puan" },
  },
  zh_CN: {
    common: { close: "关闭", dismiss: "关闭", remove: "移除", clear: "清除", loading: "正在加载" },
    validation: {
      requiredField: "请填写此字段。",
      selectOption: "请选择一个选项。",
      selectFile: "请选择一个文件。",
      enterNumber: "请输入数字。",
      selectTime: "请选择时间。",
    },
    datepicker: {
      placeholder: "选择日期",
      previousMonth: "上个月",
      nextMonth: "下个月",
      previousYears: "前 12 年",
      nextYears: "后 12 年",
      chooseMonth: "选择月份",
      chooseYear: "选择年份",
      dialog: "日期选择器",
    },
    filepicker: { placeholderLine1: "选择文件或拖放以上传", placeholderLine2: "%s，最大 %s" },
    select: { placeholder: "请选择", emptyPlaceholder: "没有可用选项", searchPlaceholder: "搜索..." },
    table: { searchPlaceholder: "搜索...", noDataMessage: "没有可显示的记录", actionsTitle: "操作" },
    pagination: { totalLabel: "显示第 :a 到 :b 条，共 :c 条", noRecords: "没有记录", pageOf: "第 :page 页，共 :pages 页" },
    modal: { ok: "确定", cancel: "取消", dialog: "对话框" },
    code: { errorMessage: "验证码无效", digitLabel: "第 :number 位" },
    colorpicker: { pickColor: "选择颜色" },
    input: { togglePassword: "切换密码可见性" },
    number: { increment: "增加", decrement: "减少" },
    processing: { processing: "处理中" },
    sortable: { dropHere: "拖放到此处" },
    themeSwitcher: { light: "浅色", dark: "深色", system: "系统", theme: "主题", selectedTheme: "主题：:theme" },
    timepicker: { placeholder: "HH:MM", hour: "小时", minute: "分钟", ampm: "上午/下午" },
    rating: { label: "评分", valueLabel: "评分 :value / :max" },
  },
};

function normalizeLocale(locale?: string): string {
  const raw = (locale || activeLocale || DEFAULT_LOCALE).replace("-", "_");
  if (loomiTranslations[raw]) return raw;
  const lower = raw.toLowerCase();
  const match = Object.keys(loomiTranslations).find((key) => key.toLowerCase() === lower);
  if (match) return match;
  const base = raw.split("_")[0];
  return loomiTranslations[base] ? base : raw;
}

function intlLocale(locale?: string): string {
  return normalizeLocale(locale).replace("_", "-");
}

function readPath(source: LoomiTranslations | undefined, path: string): LoomiTranslationValue | undefined {
  return path.split(".").reduce<LoomiTranslationValue | undefined>((value, part) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    return value[part];
  }, source);
}

function readLocalizedValue(path: string, locale?: LoomiLocale): LoomiTranslationValue | undefined {
  const key = normalizeLocale(locale);
  return readPath(loomiTranslations[key], path)
    ?? readPath(loomiTranslations[key.split("_")[0]], path)
    ?? readPath(loomiTranslations[DEFAULT_LOCALE], path);
}

function mergeTranslations(target: LoomiTranslations, source: LoomiTranslations): LoomiTranslations {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const existing = target[key];
      target[key] = mergeTranslations(
        existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {},
        value,
      );
    } else {
      target[key] = value;
    }
  }
  return target;
}

function formatTemplate(template: string, params: Record<string, string | number> = {}): string {
  let out = template;
  for (const [key, value] of Object.entries(params)) {
    out = out.replaceAll(`:${key}`, String(value));
  }
  return out;
}

export function getLoomiLocale(): string {
  return activeLocale;
}

export function setLoomiLocale(locale: LoomiLocale): void {
  activeLocale = normalizeLocale(locale);
  if (typeof globalThis.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
    globalThis.dispatchEvent(new CustomEvent("loomi-locale-change", { detail: { locale: activeLocale } }));
  }
}

export function defineLoomiTranslations(locale: LoomiLocale, translations: LoomiTranslations): void {
  const key = normalizeLocale(locale);
  loomiTranslations[key] = mergeTranslations(loomiTranslations[key] ? { ...loomiTranslations[key] } : {}, translations);
}

export function loomiT(
  path: string,
  params: Record<string, string | number> = {},
  locale?: LoomiLocale,
): string {
  const value = readLocalizedValue(path, locale);
  return typeof value === "string" ? formatTemplate(value, params) : path;
}

export function loomiDefaultText(
  value: string,
  defaultValue: string,
  path: string,
  locale?: LoomiLocale,
  params: Record<string, string | number> = {},
): string {
  return value === defaultValue ? loomiT(path, params, locale) : value;
}

export function loomiDateFormatter(locale: LoomiLocale | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(intlLocale(locale), options);
}

export function loomiMonthName(locale: LoomiLocale | undefined, month: number, style: "short" | "long"): string {
  const custom = readLocalizedValue(`datepicker.${style === "long" ? "monthsLong" : "monthsShort"}`, locale);
  if (Array.isArray(custom) && typeof custom[month] === "string") return custom[month];
  return loomiDateFormatter(locale, { month: style }).format(new Date(2023, month, 1));
}

export function loomiWeekdayNames(locale: LoomiLocale | undefined, weekStarts: "sunday" | "monday"): string[] {
  const custom = readLocalizedValue("datepicker.weekdaysShort", locale);
  if (Array.isArray(custom) && custom.length >= 7 && custom.every((item) => typeof item === "string")) {
    return weekStarts === "monday" ? [...custom.slice(1), custom[0]] : [...custom];
  }
  const base = new Date(2023, 0, 1);
  return Array.from({ length: 7 }, (_value, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i + (weekStarts === "monday" ? 1 : 0));
    return loomiDateFormatter(locale, { weekday: "short" }).format(date).slice(0, 2);
  });
}
