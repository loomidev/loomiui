export type LoomiTranslationValue = string | string[] | LoomiTranslationTree;

export interface LoomiTranslationTree {
  [key: string]: LoomiTranslationValue;
}

export type LoomiTranslations = LoomiTranslationTree;
