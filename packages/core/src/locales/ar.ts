import type { LoomiTranslations } from "./types.js";

export const ar: LoomiTranslations = {
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
  filepicker: { placeholderLine1: "اختر ملفات أو اسحبها وأفلتها للرفع", placeholderLine2: "%s حتى %s", cropTitle: "قص الصورة", cropApply: "تطبيق", cropCancel: "إلغاء", fileTooLargeTitle: "الملف كبير جدًا", fileTooLarge: "\":name\" يتجاوز الحد :limit." },
  select: { placeholder: "اختر واحدا", emptyPlaceholder: "لا توجد خيارات متاحة", searchPlaceholder: "بحث..." },
  countries: { placeholder: "اختر دولة", emptyPlaceholder: "لم يتم العثور على دول", searchPlaceholder: "بحث عن الدول...", phoneNumberLabel: "رقم الهاتف", selectCountryCode: "اختر رمز الدولة" },
  table: { searchPlaceholder: "بحث...", noDataMessage: "لا توجد سجلات للعرض", actionsTitle: "الإجراءات" },
  pagination: { totalLabel: "عرض :a إلى :b من :c", noRecords: "لا توجد سجلات", pageOf: "الصفحة :page من :pages" },
  modal: { ok: "موافق", cancel: "إلغاء", dialog: "مربع حوار" },
  drawer: { dialog: "اللوحة الجانبية" },
  code: { errorMessage: "رمز التحقق غير صالح", digitLabel: "الرقم :number" },
  colorpicker: { pickColor: "اختر لونا" },
  input: { togglePassword: "تبديل إظهار كلمة المرور" },
  number: { increment: "زيادة", decrement: "إنقاص" },
  processing: { processing: "جار المعالجة" },
  sortable: { dropHere: "أفلت هنا" },
  themeSwitcher: { light: "فاتح", dark: "داكن", system: "النظام", theme: "السمة", selectedTheme: "السمة: :theme" },
  timepicker: { placeholder: "س س:د د", hour: "الساعة", minute: "الدقيقة", ampm: "ص/م" },
  rating: { label: "التقييم", valueLabel: "التقييم :value من :max" },
};

export default ar;
