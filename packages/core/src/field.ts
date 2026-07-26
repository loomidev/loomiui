import { css, type CSSResultGroup } from "lit";

/**
 * Keeps each field's existing label treatment by default, or places a compact,
 * always-visible label inside the top of the control.
 */
export type LoomiFieldLabelPosition = "default" | "inside";

/**
 * Shared sizing scale for form controls. Every field-style component (input, select,
 * datepicker, ...) offers the same five sizes; these classes set the control vars the
 * component's own CSS consumes (`--loomi-control-height` / `-pad-x` / `-font-size`).
 * Compose via `static styles = loomiStyles(controlSizeStyles, fieldStyles, componentStyles)`.
 * The component's `:host` keeps its own *default* var values (input defaults to the
 * medium scale, datepicker to regular, etc.) — only the `.size-*` rows live here.
 *
 * Height and horizontal padding are scaled by `--loomi-density`, an unitless multiplier
 * (default 1) that a theme can set at `:root` to make every control more compact (< 1) or
 * spacious (> 1) at once, proportionally, without collapsing the per-size scale. It is
 * intentionally not declared on `:host`, so a `:root` value inherits through Shadow DOM.
 * Font size is deliberately left unscaled — density controls spacing, `size` controls type.
 */
export const controlSizeStyles: CSSResultGroup = css`
  .size-tiny {
    --loomi-control-height: calc(var(--loomi-density, 1) * 2rem);
    --loomi-control-pad-x: calc(var(--loomi-density, 1) * 0.625rem);
    --loomi-control-font-size: 0.75rem;
    font-size: var(--loomi-control-font-size);
  }
  .size-small {
    --loomi-control-height: calc(var(--loomi-density, 1) * 2.25rem);
    --loomi-control-pad-x: calc(var(--loomi-density, 1) * 0.75rem);
    --loomi-control-font-size: 0.875rem;
    font-size: var(--loomi-control-font-size);
  }
  .size-regular {
    --loomi-control-height: calc(var(--loomi-density, 1) * 2.5rem);
    --loomi-control-pad-x: calc(var(--loomi-density, 1) * 0.875rem);
    --loomi-control-font-size: 0.875rem;
    font-size: var(--loomi-control-font-size);
  }
  .size-medium {
    --loomi-control-height: calc(var(--loomi-density, 1) * 2.75rem);
    --loomi-control-pad-x: calc(var(--loomi-density, 1) * 1rem);
    --loomi-control-font-size: 1rem;
    font-size: var(--loomi-control-font-size);
  }
  .size-big {
    --loomi-control-height: calc(var(--loomi-density, 1) * 3rem);
    --loomi-control-pad-x: calc(var(--loomi-density, 1) * 1.25rem);
    --loomi-control-font-size: 1.125rem;
    font-size: var(--loomi-control-font-size);
  }
`;

/**
 * Shared chrome for field-style components — the border/background/focus/invalid/
 * disabled/minimal-variant treatment that every text-entry field and select-style
 * trigger repeats. Two class hooks, opt-in per package (this is NOT part of
 * \`loomiStyles()\`'s implicit layers):
 *
 * - \`.loomi-field\` — a focus-delegating wrapper around an inner \`<input>\` etc.;
 *   focus states key off \`:focus-within\`.
 * - \`.loomi-trigger\` — a \`<button>\` that IS the control (select, countries,
 *   timezonepicker); focus states key off \`:focus-visible\` so mouse clicks don't
 *   leave a lingering ring.
 *
 * Both hooks understand the shared state classes: an \`.open\` ancestor (or the
 * element itself being \`.open\`) shows the focused chrome while a popup is up,
 * \`.no-focus-ring\` (on the element or an ancestor) suppresses the halo, and
 * \`.variant-minimal\` (on the field, or an ancestor of the trigger) switches to the
 * borderless underline look. \`:host([invalid])\` / \`:host([disabled])\` flip the
 * error and muted treatments.
 *
 * Layout (display, gap, padding, cursor) intentionally stays in each component's own
 * stylesheet — later in the cascade, so equal-specificity local rules win.
 */
export const fieldStyles: CSSResultGroup = css`
  .loomi-field,
  .loomi-trigger {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--loomi-control-height, 2.5rem);
    background: var(--loomi-surface);
    border: 2px solid var(--loomi-surface-border);
    border-radius: var(--loomi-control-radius, var(--_loomi-control-radius-default, 0.5rem));
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }
  .loomi-field:focus-within,
  .open .loomi-field,
  .loomi-field.open,
  .loomi-trigger:focus-visible,
  .open .loomi-trigger {
    outline: none;
    border-color: var(--loomi-primary-600, var(--_loomi-primary-600-default));
    box-shadow: 0 0 0 3px var(--loomi-focus-ring, var(--loomi-primary-100, var(--_loomi-primary-100-default)));
  }
  .loomi-field.no-focus-ring:focus-within,
  .no-focus-ring .loomi-field:focus-within,
  .no-focus-ring.open .loomi-field,
  .no-focus-ring .loomi-trigger:focus-visible,
  .no-focus-ring.open .loomi-trigger {
    box-shadow: none;
  }
  :host([invalid]) .loomi-field,
  :host([invalid]) .loomi-trigger {
    border-color: var(--loomi-error-400, var(--_loomi-error-400-default));
  }
  :host([invalid]) .loomi-field:focus-within,
  :host([invalid]) .open .loomi-field,
  :host([invalid]) .loomi-field.open,
  :host([invalid]) .loomi-trigger:focus-visible,
  :host([invalid]) .open .loomi-trigger {
    border-color: var(--loomi-error-500, var(--_loomi-error-500-default));
  }
  :host([disabled]) .loomi-field,
  :host([disabled]) .loomi-trigger {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--loomi-surface-muted);
  }
  .loomi-field.variant-minimal,
  .variant-minimal .loomi-trigger,
  .loomi-trigger.variant-minimal {
    border: 0;
    border-bottom: 2px solid var(--loomi-surface-border);
    border-radius: 0;
    background: transparent;
  }
  .loomi-field.variant-minimal:focus-within,
  .open .loomi-field.variant-minimal,
  .loomi-field.variant-minimal.open,
  .variant-minimal .loomi-trigger:focus-visible,
  .variant-minimal.open .loomi-trigger,
  .loomi-trigger.variant-minimal:focus-visible,
  .open .loomi-trigger.variant-minimal {
    box-shadow: none;
    border-bottom-color: var(--loomi-primary-600, var(--_loomi-primary-600-default));
  }
  :host([invalid]) .loomi-field.variant-minimal,
  :host([invalid]) .variant-minimal .loomi-trigger,
  :host([invalid]) .loomi-trigger.variant-minimal {
    border-bottom-color: var(--loomi-error-400, var(--_loomi-error-400-default));
  }
  :host([invalid]) .loomi-field.variant-minimal:focus-within,
  :host([invalid]) .open .loomi-field.variant-minimal,
  :host([invalid]) .loomi-field.variant-minimal.open,
  :host([invalid]) .variant-minimal .loomi-trigger:focus-visible,
  :host([invalid]) .variant-minimal.open .loomi-trigger,
  :host([invalid]) .loomi-trigger.variant-minimal:focus-visible,
  :host([invalid]) .open .loomi-trigger.variant-minimal {
    border-bottom-color: var(--loomi-error-500, var(--_loomi-error-500-default));
  }
  :host([disabled]) .loomi-field.variant-minimal,
  :host([disabled]) .variant-minimal .loomi-trigger,
  :host([disabled]) .loomi-trigger.variant-minimal {
    background: transparent;
  }

  /*
   * Inset labels stay below the control's top edge instead of straddling its border.
   * The extra height and top padding reserve a separate line for the value so the two
   * never overlap, including at the compact size presets.
   */
  :host([label-position="inside"]) .loomi-field,
  :host([label-position="inside"]) .loomi-trigger {
    min-height: calc(var(--loomi-control-height, 2.5rem) + 0.75rem);
  }
  :host([label-position="inside"]) .loomi-label.loomi-label {
    position: absolute;
    inset-inline-start: var(--loomi-control-pad-x, 1rem);
    top: 0.5rem;
    z-index: 1;
    display: block;
    max-width: calc(
      100% - var(--loomi-control-pad-x, 1rem) - var(--loomi-control-pad-x, 1rem)
    );
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: var(--loomi-text-muted);
    background: transparent;
    box-shadow: none;
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    transform: none;
  }
  :host([label-position="inside"]) .loomi-field > input,
  :host([label-position="inside"]) .loomi-inputwrap > input,
  :host([label-position="inside"]) .loomi-field > textarea,
  :host([label-position="inside"]) .loomi-trigger {
    padding-top: 0.9rem;
  }
  :host([label-position="inside"]) .loomi-field > .loomi-text {
    padding-top: 0.9rem;
  }
`;
