import type { LoomiTranslations } from "./types.js";

export const es: LoomiTranslations = {
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
  filepicker: { placeholderLine1: "Elige archivos o arrástralos para subirlos", placeholderLine2: "%s hasta %s", cropTitle: "Recortar imagen", cropApply: "Aplicar", cropCancel: "Cancelar", fileTooLargeTitle: "Archivo demasiado grande", fileTooLarge: "\":name\" supera el límite de :limit." },
  select: { placeholder: "Selecciona una opción", emptyPlaceholder: "No hay opciones disponibles", searchPlaceholder: "Buscar..." },
  countries: { placeholder: "Selecciona un país", emptyPlaceholder: "No se encontraron países", searchPlaceholder: "Buscar países...", phoneNumberLabel: "Número de teléfono", selectCountryCode: "Seleccionar código de país" },
  table: { searchPlaceholder: "Buscar...", noDataMessage: "No hay registros para mostrar", actionsTitle: "acciones" },
  pagination: { totalLabel: "Mostrando :a a :b de :c", noRecords: "No hay registros", pageOf: "Página :page de :pages" },
  modal: { ok: "Aceptar", cancel: "Cancelar", dialog: "Diálogo" },
  drawer: { dialog: "Panel lateral" },
  pin: { errorMessage: "El código de verificación no es válido", digitLabel: "Dígito :number" },
  colorpicker: { pickColor: "Elegir color" },
  input: { togglePassword: "Alternar visibilidad de la contraseña" },
  number: { increment: "Incrementar", decrement: "Disminuir" },
  processing: { processing: "Procesando" },
  sortable: { dropHere: "Suelta aquí" },
  themeSwitcher: { light: "Claro", dark: "Oscuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
  timepicker: { placeholder: "HH:MM", hour: "Hora", minute: "Minuto", ampm: "a. m./p. m." },
  timezonepicker: { placeholder: "Selecciona una zona horaria", emptyPlaceholder: "No se encontraron zonas horarias", searchPlaceholder: "Buscar zonas horarias...", detectLabel: "Usar mi zona horaria" },
  creditcard: { cardholderLabel: "Titular de la tarjeta", expiresLabel: "Vencimiento", namePlaceholder: "Nombre completo", numberLabel: "Número de tarjeta", cvcLabel: "Código de seguridad", flipToBack: "Mostrar código de seguridad", flipToFront: "Volver a la tarjeta" },
  rating: { label: "Valoración", valueLabel: "Valoración :value de :max" },
  mention: { emptyPlaceholder: "Sin coincidencias" },
};

export default es;
