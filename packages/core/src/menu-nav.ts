/**
 * Resolves the Arrow/Home/End portion of a menu's keydown into the (possibly
 * out-of-range) index the caller should move focus to — the shared shape of
 * `@loomidev/dropmenu` and `@loomidev/context-menu`'s top-level item navigation. Returns
 * `undefined` for any other key, so the caller keeps handling Escape/Enter/Space itself.
 *
 * Doesn't touch focus, call `event.preventDefault()`, or wrap the index into range — the
 * caller's own `focusItemAt()`-style method already does that (see either package for
 * the pattern), so this stays a small, dependency-free decision function rather than one
 * that reaches into the DOM or a component's state.
 */
export function nextMenuFocusIndex(
  event: KeyboardEvent,
  currentIndex: number,
  itemCount: number,
): number | undefined {
  if (itemCount <= 0) return undefined;
  switch (event.key) {
    case "ArrowDown":
      return currentIndex + 1;
    case "ArrowUp":
      return currentIndex - 1;
    case "Home":
      return 0;
    case "End":
      return itemCount - 1;
    default:
      return undefined;
  }
}
