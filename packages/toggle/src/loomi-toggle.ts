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

export type LoomiToggleBar = "thin" | "thick" | "thicker";
export type LoomiLabelPosition = "left" | "right";

/**
 * `<loomi-toggle>` — a themeable toggle/switch (a checkbox, spiced up).
 * Form-associated: submits `value` (default `"on"`) under `name` when checked.
 *
 * @slot - Label content. Falls back to the `label` attribute.
 * @csspart track - The switch track.
 * @csspart knob - The sliding knob.
 * @fires input - Fired on every user toggle, after `checked` has updated (composed).
 * @fires change - Fired when the user commits a new checked state (composed).
 */
@customElement("loomi-toggle")
export class LoomiToggle extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private initialChecked = false;

  @property({ reflect: true }) name = "";
  @property() value = "on";
  @property() label = "";
  @property({ attribute: "label-position" }) labelPosition: LoomiLabelPosition = "left";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) justified = false;
  @property() bar: LoomiToggleBar = "thick";
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
    // Assume slotted content exists on the server: rendering the slot keeps light-DOM content visible in the server HTML, whereas omitting it would drop that content until hydration.
    const hasLabel = !!this.label || isServer || this.hasChildNodes();
    const labelEl = hasLabel
      ? html`<span class="loomi-label"><slot>${this.label}</slot></span>`
      : nothing;
    const control = html`
      <input
        class="loomi-native"
        type="checkbox"
        role="switch"
        name=${this.name || nothing}
        .checked=${live(this.checked)}
        ?disabled=${this.disabled}
        @input=${this.onInput}
          @change=${this.onChange}
      />
      <span class="loomi-track bar-${this.bar}" part="track">
        <span class="loomi-knob" part="knob"></span>
      </span>
    `;
    return html`
      <label class="loomi-toggle" style=${style}>
        ${this.labelPosition === "left" ? labelEl : nothing} ${control}
        ${this.labelPosition === "right" ? labelEl : nothing}
      </label>
    `;
  }
}

/** Event map for `<loomi-toggle>`. `change` is a plain `Event`; read `checked`
 * off the element itself. */
export interface LoomiToggleEventMap {
  input: Event;
  change: Event;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-toggle": LoomiToggle;
  }
}
