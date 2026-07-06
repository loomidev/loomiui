type DarkModeListener = (isDark: boolean) => void;

let sharedObserver: MutationObserver | undefined;
const listeners = new Set<DarkModeListener>();
let lastIsDark = false;

function readIsDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

function notifyAll(): void {
  const isDark = readIsDark();
  if (isDark === lastIsDark) return;
  lastIsDark = isDark;
  for (const listener of listeners) listener(isDark);
}

/**
 * Watches the `dark` class on `<html>` — the convention `@loomidev/theme-switcher` uses
 * (see its `applyLoomiTheme()`) — for components whose own CSS needs real dark-mode
 * awareness. `:host-context(.dark)` would be the obvious CSS-only tool for this, but it
 * has no Firefox support at all (never implemented, no cross-browser equivalent exists),
 * so detection has to happen here in JS and get reflected onto the component itself
 * (e.g. a class applied in its own `render()` output) rather than relied on as a CSS
 * ancestor-selector. A single shared `MutationObserver` backs every subscriber, so many
 * instances of a dark-mode-aware component on one page don't add one observer each.
 * Calls `listener` immediately with the current value, then again on every change.
 * Returns a cleanup function.
 */
export function watchDarkMode(listener: DarkModeListener): () => void {
  if (!sharedObserver) {
    lastIsDark = readIsDark();
    sharedObserver = new MutationObserver(notifyAll);
    sharedObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }
  listener(readIsDark());
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      sharedObserver?.disconnect();
      sharedObserver = undefined;
    }
  };
}
