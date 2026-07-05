import { css, type CSSResultGroup } from "lit";

/**
 * Shared elevation shadow token, prepended into every component's styles via
 * `loomiStyles()`. Reuse `var(--loomi-shadow-elevated)` for a floating dialog/panel's
 * drop shadow instead of retyping the same rgba stack — see `@loomidev/modal`,
 * `@loomidev/drawer`, and `@loomidev/floating-panel`.
 */
export const elevationStyles: CSSResultGroup = css`
  :host {
    --loomi-shadow-elevated:
      0 20px 25px -5px rgba(0, 0, 0, 0.2),
      0 8px 10px -6px rgba(0, 0, 0, 0.2);
  }
`;
