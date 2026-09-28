import { html, nothing, type TemplateResult, isServer } from "lit";
import { customElement, property } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import {
  LoomiElement,
  loomiStyles,
  accentVars,
  isLoomiColor,
  type LoomiColor,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-checkbox>` — a themeable checkbox in the full loomi palette.
 * Form-associated: submits `value` (default `"on"`) under `name` when checked.
 *
 * @slot - Label content (supports HTML such as links). Falls back to the `label` attribute.
 * @csspart box - The checkbox box.
 * @fires input - Fired on every user toggle, after `checked` has updated (composed).
 * @fires change - Fired when the user commits a new checked state (composed).
 */
@customElement("loomi-checkbox")
export class LoomiCheckbox extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private initialChecked = false;

  @property({ reflect: true }) name = "";
  @property() value = "on";
  @property() label = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() color: LoomiColor = "primary" as LoomiColor;

  /**
   * Always `"checkbox"`, like the native control this replaces, so framework bindings that
   * branch on `type` (Vue, Alpine, …) bind `checked` rather than `value`. Read-only: writes
   * are ignored rather than thrown on, since some frameworks mirror a `type` attribute
   * onto the property.
   */
  get type(): "checkbox" {
    return "checkbox";
  }
  set type(_ignored: string) {
    // Read-only; see the getter.
  }

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialChecked = this.checked;
    super.connectedCallback();
  }

  formResetCallback(): void {
    this.checked = this.initialChecked;
  }

  override willUpdate(): void {
    this.internals.setFormValue(this.checked ? this.value : null);
  }

  private get accentColor(): LoomiColor {
    return isLoomiColor(this.color) ? this.color : ("primary" as LoomiColor);
  }

  // The native `input` event is composed, so left alone it reaches listeners on the host
  // before `checked` has caught up. Stop it and re-fire from the host once it has.
  private onInput = (e: Event): void => {
    e.stopPropagation();
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  // `checked` was already taken from the native box on `input`; re-reading it here would
  // undo a listener that reverted `checked` in between.
  private onChange = (): void => {
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  override render(): TemplateResult {
    const style = accentVars(this.accentColor);
    return html`
      <label class="loomi-cb" style=${style}>
        <input
          class="loomi-native"
          type="checkbox"
          name=${this.name || nothing}
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @change=${this.onChange}
        />
        <span class="loomi-box" part="box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </span>
        ${
          // Assume slotted content exists on the server: rendering the slot keeps light-DOM
          // content visible in the server HTML, whereas omitting it would drop that content
          // until hydration.
          this.label || isServer || this.hasChildNodes()
            ? html`<span class="loomi-label"><slot>${this.label}</slot></span>`
            : nothing
        }
      </label>
    `;
  }
}

/** Event map for `<loomi-checkbox>`. `change` is a plain `Event`; read `checked`
 * off the element itself. */
export interface LoomiCheckboxEventMap {
  input: Event;
  change: Event;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-checkbox": LoomiCheckbox;
  }
}
