import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiStyles, loomiT, onClickOutside } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

const CLOCK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`;
const pad = (n: number) => String(n).padStart(2, "0");
export type LoomiTimepickerSize = "tiny" | "small" | "regular" | "medium" | "big";
const DEFAULT_PLACEHOLDER = "HH:MM";
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-timepicker>` — pick a time. `popup` (input + panel) or `inline`. 12/24-hour.
 * Form-associated: submits a formatted time (e.g. `3:25PM` or `03:25`) under `name`.
 *
 * @fires change - `detail: { value }` when the time changes.
 */
@customElement("loomi-timepicker")
export class LoomiTimepicker extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  /** `popup` (input + panel) or `inline`. Attribute is `tp-style` (`style` is reserved). */
  @property({ attribute: "tp-style" }) tpStyle: "popup" | "inline" | "clock" = "popup";
  @property() format: "12" | "24" = "12";
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property() label = "";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property() locale = "";
  @property() size: LoomiTimepickerSize = "medium";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute }) showFocusRing = true;

  @state() private hour: number | null = null;
  @state() private minute: number | null = null;
  @state() private ampm: "AM" | "PM" = "AM";
  @state() private open = false;
  @state() private parsed = false;
  private cleanup?: () => void;

  override willUpdate(): void {
    if (!this.parsed && this.selectedValue) {
      this.parse(this.selectedValue);
      this.parsed = true;
    }
    this.internals.setFormValue(this.value);
    this.syncValidity();
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  private parse(v: string): void {
    const m = v.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return;
    this.hour = parseInt(m[1], 10);
    this.minute = parseInt(m[2], 10);
    if (m[3]) this.ampm = m[3].toUpperCase() as "AM" | "PM";
  }

  /** The formatted time, or "" if incomplete. */
  get value(): string {
    if (this.hour === null || this.minute === null) return "";
    return this.format === "24"
      ? `${pad(this.hour)}:${pad(this.minute)}`
      : `${this.hour}:${pad(this.minute)}${this.ampm}`;
  }

  private commit(): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value: this.value } }));
  }

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
    const empty = this.required && this.value === "";
    this.invalid = empty && showInvalid;
    this.internals.setValidity(
      empty ? { valueMissing: true } : {},
      empty ? loomiT("validation.selectTime", {}, this.locale) : "",
    );
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private toggle(): void {
    if (this.open) {
      this.open = false;
      this.cleanup?.();
      this.showValidation();
      return;
    }
    this.open = true;
    this.cleanup = onClickOutside(this, () => {
      this.open = false;
      this.showValidation();
    });
  }

  private renderSelects(): TemplateResult {
    const hours = this.format === "24"
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);
    return html`<div class="loomi-selects">
      <select aria-label=${loomiT("timepicker.hour", {}, this.locale)} @blur=${this.showValidation} @change=${(e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        this.hour = value === "" ? null : Number(value);
        this.commit();
      }}>
        <option value="" ?selected=${this.hour === null}>HH</option>
        ${hours.map((h) => html`<option value=${h} ?selected=${this.hour === h}>${this.format === "24" ? pad(h) : h}</option>`)}
      </select>
      <span class="loomi-colon">:</span>
      <select aria-label=${loomiT("timepicker.minute", {}, this.locale)} @blur=${this.showValidation} @change=${(e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        this.minute = value === "" ? null : Number(value);
        this.commit();
      }}>
        <option value="" ?selected=${this.minute === null}>MM</option>
        ${Array.from({ length: 60 }, (_, i) => i).map((m) => html`<option value=${m} ?selected=${this.minute === m}>${pad(m)}</option>`)}
      </select>
      ${this.format === "12"
        ? html`<select aria-label=${loomiT("timepicker.ampm", {}, this.locale)} @blur=${this.showValidation} @change=${(e: Event) => { this.ampm = (e.target as HTMLSelectElement).value as "AM" | "PM"; this.commit(); }}>
            <option value="AM" ?selected=${this.ampm === "AM"}>AM</option>
            <option value="PM" ?selected=${this.ampm === "PM"}>PM</option>
          </select>`
        : nothing}
    </div>`;
  }

  private selectClockHour(hour: number): void {
    this.hour = hour;
    if (this.minute === null) this.minute = 0;
    this.commit();
  }

  private selectClockMinute(minute: number): void {
    if (this.hour === null) this.hour = this.format === "24" ? 0 : 12;
    this.minute = minute;
    this.commit();
  }

  private renderClock(): TemplateResult {
    const hours = this.format === "24"
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);
    return html`<div class="loomi-clock">
      <div class="loomi-clock-face" aria-label="Choose hour">
        ${hours.map((hour, index) => {
          const angle = ((index / hours.length) * 360) - 90;
          return html`<button
            type="button"
            class=${this.hour === hour ? "active" : ""}
            style=${`--loomi-clock-angle:${angle}deg`}
            @click=${() => this.selectClockHour(hour)}
          >${this.format === "24" ? pad(hour) : hour}</button>`;
        })}
      </div>
      <div class="loomi-clock-minutes" aria-label="Choose minute">
        ${[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => html`<button
          type="button"
          class=${this.minute === minute ? "active" : ""}
          @click=${() => this.selectClockMinute(minute)}
        >${pad(minute)}</button>`)}
      </div>
      ${this.format === "12"
        ? html`<div class="loomi-clock-ampm">
            ${(["AM", "PM"] as const).map((period) => html`<button type="button" class=${this.ampm === period ? "active" : ""} @click=${() => { this.ampm = period; this.commit(); }}>${period}</button>`)}
          </div>`
        : nothing}
    </div>`;
  }

  override render(): TemplateResult {
    if (this.tpStyle === "inline") {
      return html`${this.label ? html`<span class="loomi-label">${this.label}</span>` : nothing}${this.renderSelects()}`;
    }
    return html`<div class="loomi-tp size-${this.size} ${this.open ? "open" : ""} ${this.showFocusRing ? "" : "no-focus-ring"}">
      ${this.label ? html`<span class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>` : nothing}
      <div class="loomi-field" tabindex="0" @blur=${this.showValidation} @click=${() => this.toggle()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${CLOCK}</svg>
        <span class="loomi-text ${this.value ? "" : "placeholder"}">${this.value || loomiDefaultText(this.placeholder, DEFAULT_PLACEHOLDER, "timepicker.placeholder", this.locale)}${!this.value && this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>
      </div>
      ${this.open ? html`<div class="loomi-panel ${this.tpStyle === "clock" ? "clock-panel" : ""}" @click=${(e: Event) => e.stopPropagation()}>${this.tpStyle === "clock" ? this.renderClock() : this.renderSelects()}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timepicker": LoomiTimepicker;
  }
}
