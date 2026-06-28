import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-slider>` — select a numeric value or numeric range with a slider.
 * Form-associated: submits the value under `name`.
 *
 * @fires input - As the value changes (composed).
 * @fires change - On commit (composed).
 */
@customElement("loomi-slider")
export class LoomiSlider extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) selected = 0;
  @property({ type: Number, attribute: "selected-end" }) selectedEnd = 100;
  @property({ type: Boolean, reflect: true }) range = false;
  @property({ type: Boolean, attribute: "show-values" }) showValues = true;

  override willUpdate(): void {
    this.internals.setFormValue(this.value);
  }

  get value(): string {
    if (!this.range) return String(this.startValue);
    return `${this.startValue} - ${this.endValue}`;
  }

  private get lowerBound(): number {
    return Math.min(this.min, this.max);
  }

  private get upperBound(): number {
    return Math.max(this.min, this.max);
  }

  private clamp(value: number): number {
    return Math.min(this.upperBound, Math.max(this.lowerBound, value));
  }

  private get selectedValue(): number {
    return this.clamp(this.selected);
  }

  private get selectedEndValue(): number {
    return this.clamp(this.selectedEnd);
  }

  private get startValue(): number {
    return this.range ? Math.min(this.selectedValue, this.selectedEndValue) : this.selectedValue;
  }

  private get endValue(): number {
    return Math.max(this.selectedValue, this.selectedEndValue);
  }

  private get progressStyle(): string {
    const span = this.upperBound - this.lowerBound;
    const start = this.range ? this.startValue : this.lowerBound;
    const end = this.range ? this.endValue : this.startValue;
    const startPercent = span ? ((start - this.lowerBound) / span) * 100 : 0;
    const endPercent = span ? ((end - this.lowerBound) / span) * 100 : 0;

    return `${accentVars(this.color)} --loomi-range-start: ${startPercent}%; --loomi-range-end: ${endPercent}%;`;
  }

  private onInput(handle: "start" | "end", e: Event): void {
    const next = Number((e.target as HTMLInputElement).value);

    if (handle === "start") {
      this.selected = next;
      if (this.range && next > this.selectedEnd) this.selectedEnd = next;
    } else {
      this.selectedEnd = next;
      if (next < this.selected) this.selected = next;
    }

    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private onChange(): void {
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  override render(): TemplateResult {
    return html`<div class="loomi-slider" style=${this.progressStyle}>
      <div class="loomi-control ${this.range ? "loomi-control-range" : ""}">
        <span class="loomi-track" aria-hidden="true"></span>
        <input
          class="loomi-range ${this.range ? "loomi-range-start" : ""}"
          type="range"
          name=${this.name || nothing}
          min=${this.lowerBound}
          max=${this.upperBound}
          step=${this.step}
          aria-label=${this.range ? "Minimum value" : "Value"}
          .value=${String(this.startValue)}
          @input=${(event: Event) => this.onInput("start", event)}
          @change=${this.onChange}
        />
        ${this.range
          ? html`<input
              class="loomi-range loomi-range-end"
              type="range"
              min=${this.lowerBound}
              max=${this.upperBound}
              step=${this.step}
              aria-label="Maximum value"
              .value=${String(this.endValue)}
              @input=${(event: Event) => this.onInput("end", event)}
              @change=${this.onChange}
            />`
          : nothing}
      </div>
      ${this.showValues ? html`<span class="loomi-value">${this.value}</span>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-slider": LoomiSlider;
  }
}
