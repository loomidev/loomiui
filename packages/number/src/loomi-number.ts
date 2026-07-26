import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import {
  LoomiElement,
  controlSizeStyles,
  fieldStyles,
  loomiT,
  themeStyles,
  type LoomiFieldLabelPosition,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiNumberSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiNumberVariant = "default" | "minimal";

const MINUS = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />`;
const PLUS = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />`;

/**
 * `<loomi-number>` — a themeable number stepper with increment/decrement buttons,
 * min/max/step enforcement and a floating label. Form-associated.
 *
 * @csspart field - The bordered container.
 * @csspart input - The native number `<input>`.
 * @fires input - Fired as the value changes (composed).
 * @fires change - Fired on commit (composed).
 */
@customElement("loomi-number")
export class LoomiNumber extends LoomiElement {
  static override styles = [themeStyles, controlSizeStyles, fieldStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property({ attribute: "label-position", reflect: true })
  labelPosition: LoomiFieldLabelPosition = "default";
  @property() locale = "";
  @property() value = "";
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property() size: LoomiNumberSize = "medium";
  @property() variant: LoomiNumberVariant = "default";
  @property({ type: Boolean, attribute: "transparent-icons" }) transparentIcons = true;
  @property({ type: Boolean, attribute: "with-dots" }) withDots = true;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @query("input") private inputEl!: HTMLInputElement;

  override willUpdate(): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
  }

  override focus(): void {
    this.inputEl?.focus();
  }

  private get current(): number {
    const n = parseFloat(this.value);
    return Number.isNaN(n) ? this.min : n;
  }

  private clamp(n: number): number {
    return Math.min(this.max, Math.max(this.min, n));
  }

  private setValue(n: number, emitChange = true): void {
    const clamped = this.clamp(this.withDots ? n : Math.round(n));
    this.value = String(clamped);
    this.syncValidity();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    if (emitChange) this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private bump(dir: 1 | -1): void {
    if (this.disabled) return;
    this.setValue(this.current + dir * this.step);
  }

  private onInput = (e: Event): void => {
    const raw = (e.target as HTMLInputElement).value;
    const v = raw.replace(this.withDots ? /[^0-9.-]/g : /[^0-9-]/g, "");
    this.value = v;
    this.syncValidity();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  private onChange = (): void => {
    if (this.value.trim() === "") {
      this.syncValidity();
      return;
    }
    this.setValue(this.current);
  };

  validate(): boolean {
    this.validationVisible = true;
    return this.syncValidity(true);
  }

  checkValidity(): boolean {
    this.syncValidity();
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    this.validationVisible = true;
    this.syncValidity(true);
    return this.internals.reportValidity();
  }

  private syncValidity(showInvalid = this.validationVisible): boolean {
    const empty = this.required && !this.disabled && this.value.trim() === "";
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? loomiT("validation.enterNumber", {}, this.locale) : "";
    if (this.inputEl) this.internals.setValidity(validity, message, this.inputEl);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private renderStep(dir: 1 | -1): TemplateResult {
    const atLimit =
      this.value !== "" && (dir === 1 ? this.current >= this.max : this.current <= this.min);
    const cls = `loomi-step ${dir === 1 ? "inc" : "dec"}${this.transparentIcons ? "" : " solid"}`;
    return html`<button
      type="button"
      class=${cls}
      aria-label=${dir === 1 ? loomiT("number.increment", {}, this.locale) : loomiT("number.decrement", {}, this.locale)}
      ?disabled=${this.disabled || atLimit}
      @click=${() => this.bump(dir)}
    >
      <svg class="loomi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        ${dir === 1 ? PLUS : MINUS}
      </svg>
    </button>`;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const placeholderAttr = hasLabel ? " " : nothing;
    return html`
      <div class="loomi-field size-${this.size} variant-${this.variant}" part="field">
        ${this.renderStep(-1)}
        <span class="loomi-inputwrap">
          <input
            class="loomi-input"
            part="input"
            type="number"
            inputmode=${this.withDots ? "decimal" : "numeric"}
            .value=${this.value}
            name=${this.name || nothing}
            min=${this.min}
            max=${this.max}
            step=${this.step}
            placeholder=${placeholderAttr}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-label=${hasLabel ? this.label : nothing}
            aria-invalid=${this.invalid ? "true" : "false"}
            @input=${this.onInput}
            @change=${this.onChange}
            @blur=${this.showValidation}
          />
          ${
            hasLabel
              ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
              : nothing
          }
        </span>
        ${this.renderStep(1)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-number": LoomiNumber;
  }
}
