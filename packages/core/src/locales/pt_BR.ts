import type { LoomiTranslations } from "./types.js";

export const pt_BR: LoomiTranslations = {
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
  filepicker: { placeholderLine1: "Escolha arquivos ou arraste e solte para enviar", placeholderLine2: "%s até %s", cropTitle: "Recortar imagem", cropApply: "Aplicar", cropCancel: "Cancelar", fileTooLargeTitle: "Arquivo muito grande", fileTooLarge: "\":name\" excede o limite de :limit." },
  select: { placeholder: "Selecione", emptyPlaceholder: "Nenhuma opção disponível", searchPlaceholder: "Buscar..." },
  countries: { placeholder: "Selecione um país", emptyPlaceholder: "Nenhum país encontrado", searchPlaceholder: "Buscar países...", phoneNumberLabel: "Número de telefone", selectCountryCode: "Selecionar código do país" },
  table: { searchPlaceholder: "Buscar...", noDataMessage: "Nenhum registro para exibir", actionsTitle: "ações" },
  pagination: { totalLabel: "Mostrando :a a :b de :c", noRecords: "Nenhum registro", pageOf: "Página :page de :pages" },
  modal: { ok: "OK", cancel: "Cancelar", dialog: "Diálogo" },
  drawer: { dialog: "Painel lateral" },
  code: { errorMessage: "O código de verificação é inválido", digitLabel: "Dígito :number" },
  colorpicker: { pickColor: "Escolher cor" },
  input: { togglePassword: "Alternar visibilidade da senha" },
  number: { increment: "Aumentar", decrement: "Diminuir" },
  processing: { processing: "Processando" },
  sortable: { dropHere: "Solte aqui" },
  themeSwitcher: { light: "Claro", dark: "Escuro", system: "Sistema", theme: "Tema", selectedTheme: "Tema: :theme" },
  timepicker: { placeholder: "HH:MM", hour: "Hora", minute: "Minuto", ampm: "AM/PM" },
  timezonepicker: { placeholder: "Selecione um fuso horário", emptyPlaceholder: "Nenhum fuso horário encontrado", searchPlaceholder: "Buscar fusos horários...", detectLabel: "Usar meu fuso horário" },
  creditcard: { cardholderLabel: "Titular do cartão", expiresLabel: "Validade", namePlaceholder: "Nome completo", numberLabel: "Número do cartão", cvcLabel: "Código de segurança", flipToBack: "Mostrar código de segurança", flipToFront: "Voltar ao cartão" },
  rating: { label: "Avaliação", valueLabel: "Avaliação :value de :max" },
  mention: { emptyPlaceholder: "Nenhuma correspondência" },
};

export default pt_BR;
