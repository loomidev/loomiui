import { css, type CSSResultGroup } from "lit";

/**
 * @deprecated The focus tokens are now emitted by `@loomidev/theme` itself, so
 * `themeStyles` (always prepended by `loomiStyles()`) declares both — including their
 * dark-mode values:
 *
 * - `--loomi-focus-ring-color` — solid color for `outline`-style focus rings
 *   (primary-600 light / primary-500 dark).
 * - `--loomi-focus-ring` — soft halo color for `box-shadow: 0 0 0 <n>px` rings
 *   (primary-100 light / translucent primary-500 dark).
 *
 * This export is retained (empty) so existing `loomiStyles(...)` compositions and
 * imports keep working. Reference the tokens above instead of hardcoding a
 * `--loomi-primary-<shade>` with no fallback chain — the public theme slots are
 * deliberately left undeclared (see `@loomidev/theme`), so an unfallback'd reference
 * silently renders NO outline at all for any consumer who hasn't defined that exact
 * shade at `:root`.
 *
 * A component with its own per-instance `accentVars()` color should reference
 * `--_loomi-accent` directly instead of these tokens — nested `var()` references inside
 * an inherited custom property resolve at the scope where the *outer* property was
 * declared, not at the element that finally consumes it, so baking `--_loomi-accent`
 * into a `:host`-level token can't pick up an accent set on a descendant wrapper
 * (see `@loomidev/creditcard` / `@loomidev/slider` for the direct-reference pattern).
 */
export const focusStyles: CSSResultGroup = css``;
