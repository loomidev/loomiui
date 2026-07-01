import type { LoomiTranslations } from "./types.js";

export const tr: LoomiTranslations = {
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
  filepicker: { placeholderLine1: "Dosya seçin veya yüklemek için sürükleyip bırakın", placeholderLine2: "%s en fazla %s", cropTitle: "Görseli kırp", cropApply: "Uygula", cropCancel: "İptal", fileTooLargeTitle: "Dosya çok büyük", fileTooLarge: "\":name\" :limit sınırını aşıyor." },
  select: { placeholder: "Seçin", emptyPlaceholder: "Kullanılabilir seçenek yok", searchPlaceholder: "Ara..." },
  countries: { placeholder: "Bir ülke seçin", emptyPlaceholder: "Ülke bulunamadı", searchPlaceholder: "Ülke ara...", phoneNumberLabel: "Telefon numarası", selectCountryCode: "Ülke kodu seçin" },
  table: { searchPlaceholder: "Ara...", noDataMessage: "Gösterilecek kayıt yok", actionsTitle: "işlemler" },
  pagination: { totalLabel: ":c kayıttan :a ile :b arası gösteriliyor", noRecords: "Kayıt yok", pageOf: "Sayfa :page / :pages" },
  modal: { ok: "Tamam", cancel: "İptal", dialog: "İletişim kutusu" },
  drawer: { dialog: "Yan panel" },
  pin: { errorMessage: "Doğrulama kodu geçersiz", digitLabel: "Rakam :number" },
  colorpicker: { pickColor: "Renk seç" },
  input: { togglePassword: "Parola görünürlüğünü değiştir" },
  number: { increment: "Artır", decrement: "Azalt" },
  processing: { processing: "İşleniyor" },
  sortable: { dropHere: "Buraya bırak" },
  themeSwitcher: { light: "Açık", dark: "Koyu", system: "Sistem", theme: "Tema", selectedTheme: "Tema: :theme" },
  timepicker: { placeholder: "SS:DD", hour: "Saat", minute: "Dakika", ampm: "ÖÖ/ÖS" },
  timezonepicker: { placeholder: "Bir saat dilimi seçin", emptyPlaceholder: "Saat dilimi bulunamadı", searchPlaceholder: "Saat dilimi ara...", detectLabel: "Saat dilimimi kullan" },
  creditcard: { cardholderLabel: "Kart Sahibi", expiresLabel: "Son Kullanma", namePlaceholder: "Ad Soyad", numberLabel: "Kart numarası", cvcLabel: "Güvenlik kodu", flipToBack: "Güvenlik kodunu göster", flipToFront: "Karta geri dön" },
  rating: { label: "Puan", valueLabel: ":max üzerinden :value puan" },
  mention: { emptyPlaceholder: "Eşleşme yok" },
};

export default tr;
