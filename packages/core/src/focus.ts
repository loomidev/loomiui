import { css, type CSSResultGroup } from "lit";

/**
 * Shared default focus-ring color token, prepended into every component's styles via
 * `loomiStyles()`. Resolves to the global `--loomi-primary-600` override slot, falling
 * back to the private default. Reference it instead of hardcoding a
 * `--loomi-primary-<shade>` with no fallback chain — the public theme slots are
 * deliberately left undeclared (see `@loomidev/theme`), so an unfallback'd reference
 * silently renders NO outline at all for any consumer who hasn't defined that exact
 * shade at `:root`.
 *
 * A component with its own per-instance `accentVars()` color should reference
 * `--_loomi-accent` directly instead of this token — nested `var()` references inside
 * an inherited custom property resolve at the scope where the *outer* property was
 * declared, not at the element that finally consumes it, so baking `--_loomi-accent`
 * into this `:host`-level token can't pick up an accent set on a descendant wrapper
 * (see `@loomidev/creditcard` / `@loomidev/slider` for the direct-reference pattern).
 */
export const focusStyles: CSSResultGroup = css`
  :host {
    --loomi-focus-ring-color: var(--loomi-primary-600, var(--_loomi-primary-600-default));
  }
`;
