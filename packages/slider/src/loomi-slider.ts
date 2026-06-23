import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-slider>` — select a numeric value with a slider. Form-associated: submits the
 * value under `name`.
 *
 * @fires input - As the value changes (composed).
 * @fires change - On commit (composed).
 */
@customElement("loomi-slider")
export class LoomiSlider extends LitElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property() name = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) selected = 0;
  @property({ type: Boolean, attribute: "show-values" }) showValues = true;

  override willUpdate(): void {
    this.internals.setFormValue(String(this.selected));
  }

  private onInput = (e: Event): void => {
    this.selected = Number((e.target as HTMLInputElement).value);
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  override render(): TemplateResult {
    const value = Math.min(this.max, Math.max(this.min, this.selected));
    return html`<div class="loomi-slider" style=${accentVars(this.color)}>
      <input
        class="loomi-range"
        type="range"
        name=${this.name || nothing}
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(value)}
        @input=${this.onInput}
        @change=${() => this.dispatchEvent(new Event("change", { bubbles: true, composed: true }))}
      />
      ${this.showValues ? html`<span class="loomi-value">${value}</span>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-slider": LoomiSlider;
  }
}
