import type { LoomiTranslations } from "./types.js";

export const fr: LoomiTranslations = {
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
};

export default fr;
