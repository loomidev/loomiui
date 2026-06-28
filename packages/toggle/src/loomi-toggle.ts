import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, isLoomiColor, type LoomiColor } from "@loomidev/core";
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
 * @fires change - Fired when the checked state changes (composed).
 */
@customElement("loomi-toggle")
export class LoomiToggle extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property() value = "on";
  @property() label = "";
  @property({ attribute: "label-position" }) labelPosition: LoomiLabelPosition = "left";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) justified = false;
  @property() bar: LoomiToggleBar = "thick";
  @property() color: LoomiColor = "primary" as LoomiColor;

  override willUpdate(): void {
    this.internals.setFormValue(this.checked ? this.value : null);
  }

  private get accentColor(): LoomiColor {
    return isLoomiColor(this.color) ? this.color : ("primary" as LoomiColor);
  }

  private onChange = (e: Event): void => {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  override render(): TemplateResult {
    const style = accentVars(this.accentColor);
    const hasLabel = !!this.label || this.hasChildNodes();
    const labelEl = hasLabel
      ? html`<span class="loomi-label"><slot>${this.label}</slot></span>`
      : nothing;
    const control = html`
      <input
        class="loomi-native"
        type="checkbox"
        role="switch"
        name=${this.name || nothing}
        .checked=${this.checked}
        ?disabled=${this.disabled}
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

declare global {
  interface HTMLElementTagNameMap {
    "loomi-toggle": LoomiToggle;
  }
}
