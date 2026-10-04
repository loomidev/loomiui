// The subscription behind "translated text may have changed". It lives apart from
// i18n.ts so that LoomiElement can listen without importing the translation tables: a
// component that never calls loomiT() shouldn't bundle the English locale.

const translationListeners = new Set<() => void>();

/** Tell every subscriber that translated text may have changed. */
export function notifyTranslationsChange(): void {
  for (const listener of [...translationListeners]) listener();
}

/**
 * Call `listener` whenever translated text may have changed: the active locale switched,
 * a built-in locale finished loading, or translations were registered. Returns a cleanup
 * function. `LoomiElement` uses this to re-render connected components.
 */
export function onLoomiTranslationsChange(listener: () => void): () => void {
  translationListeners.add(listener);
  return () => translationListeners.delete(listener);
}
