import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiStyles, loomiT, onClickOutside } from "@loomidev/core";
import "@loomidev/modal/loomi-modal.js";
import type { LoomiModal } from "@loomidev/modal";
import { componentStyles } from "./generated/styles.css.js";

const CLOCK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`;
const pad = (n: number) => String(n).padStart(2, "0");

// The clock face renders inside <loomi-modal>, which relocates its slotted content to
// document.body on show() — once moved, it's no longer a descendant of this component's
// shadow host, so it loses both this shadow root's stylesheet AND the --loomi-* token
// values that stylesheet's :host block defines (custom-property inheritance follows the
// live DOM parent chain, which is severed by the move). So this stylesheet travels with
// the slotted markup itself instead of living in styles.css, and every --loomi-* token
// carries a literal fallback (copied from @loomidev/theme's light-mode defaults) for
// after the content has moved and those tokens are no longer in scope.
const CLOCK_STYLE = `
  .loomi-clock { display: grid; gap: 0.9rem; justify-items: center; }
  .loomi-clock-face { position: relative; width: 16rem; height: 16rem; }
  .loomi-clock-ring.hours { position: absolute; inset: 0; }
  .loomi-clock-ring.minutes {
    position: absolute; left: 50%; top: 50%; width: 9.6rem; height: 9.6rem;
    transform: translate(-50%, -50%); border-radius: 9999px; cursor: pointer;
    background: var(--loomi-surface-muted, oklch(98.5% 0.002 247.839));
    border: 1px solid var(--loomi-surface-border-subtle, oklch(96.7% 0.003 264.542));
  }
  .loomi-clock button {
    border: 1px solid transparent; border-radius: 9999px; background: transparent;
    color: var(--loomi-text-secondary, oklch(37.3% 0.034 259.733)); cursor: pointer; font: inherit;
  }
  .loomi-clock button:hover, .loomi-clock button.active {
    background: var(--loomi-primary-100, oklch(93% 0.034 272.788));
    color: var(--loomi-primary-700, oklch(45.7% 0.24 277.023));
  }
  .loomi-clock-hour {
    position: absolute; left: 50%; top: 50%; width: 2.1rem; height: 2.1rem; margin: -1.05rem;
    transform: rotate(var(--loomi-clock-angle)) translate(6.4rem) rotate(calc(-1 * var(--loomi-clock-angle)));
  }
  .loomi-clock-minute {
    position: absolute; left: 50%; top: 50%; width: 1.7rem; height: 1.7rem; margin: -0.85rem;
    font-size: 0.75rem;
    transform: rotate(var(--loomi-clock-angle)) translate(3.8rem) rotate(calc(-1 * var(--loomi-clock-angle)));
  }
  .loomi-clock-center {
    position: absolute; left: 50%; top: 50%; width: 3.2rem; height: 3.2rem; margin: -1.6rem;
    z-index: 2; border: 1px solid var(--loomi-surface-border, oklch(92.8% 0.006 264.531));
    border-radius: 9999px;
    background: var(--loomi-surface, #fff); color: var(--loomi-primary-700, oklch(45.7% 0.24 277.023));
    font: inherit; font-weight: 700; font-size: 0.85rem; cursor: pointer;
  }
  .loomi-clock-center:hover { background: var(--loomi-primary-100, oklch(93% 0.034 272.788)); }
  .loomi-clock-ampm { display: flex; justify-content: center; gap: 0.4rem; }
  .loomi-clock-ampm button { min-width: 3rem; padding: 0.4rem 0.65rem; }
`;
export type LoomiTimepickerSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiTimepickerVariant = "default" | "minimal";
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
  @property() variant: LoomiTimepickerVariant = "default";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute }) showFocusRing = true;

  @state() private hour: number | null = null;
  @state() private minute: number | null = null;
  @state() private ampm: "AM" | "PM" = "AM";
  @state() private open = false;
  @state() private parsed = false;
  private cleanup?: () => void;

  @query(".loomi-clock-modal", true) private clockModalEl?: LoomiModal;

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

  private onFieldClick(): void {
    if (this.tpStyle === "clock") {
      this.clockModalEl?.show();
      return;
    }
    this.toggle();
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

  /** Toggles 12h/24h format from the clock's center button, converting the currently
   * selected hour (and am/pm) so the underlying time doesn't change. */
  private toggleFormat(): void {
    const next = this.format === "12" ? "24" : "12";
    if (this.hour !== null) {
      if (next === "24") {
        this.hour = this.ampm === "PM" ? (this.hour % 12) + 12 : this.hour % 12;
      } else {
        this.ampm = this.hour >= 12 ? "PM" : "AM";
        const h12 = this.hour % 12;
        this.hour = h12 === 0 ? 12 : h12;
      }
    }
    this.format = next;
    this.commit();
  }

  /** Maps a click anywhere on the minute ring's background to the nearest of the 60
   * minutes, so precise values between the 5-minute marks are reachable by mouse. */
  private onMinuteRingClick(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angleFromTop = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
    const normalized = ((angleFromTop % 360) + 360) % 360;
    this.selectClockMinute(Math.round(normalized / 6) % 60);
  }

  private renderClock(): TemplateResult {
    const hours = this.format === "24"
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);
    const minuteMarks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    return html`<style>${CLOCK_STYLE}</style>
    <div class="loomi-clock">
      <div class="loomi-clock-face">
        <div class="loomi-clock-ring hours" role="group" aria-label=${loomiT("timepicker.hour", {}, this.locale)}>
          ${hours.map((hour, index) => {
            const angle = ((index / hours.length) * 360) - 90;
            return html`<button
              type="button"
              class="loomi-clock-hour ${this.hour === hour ? "active" : ""}"
              style=${`--loomi-clock-angle:${angle}deg`}
              @click=${() => this.selectClockHour(hour)}
            >${this.format === "24" ? pad(hour) : hour}</button>`;
          })}
        </div>
        <div class="loomi-clock-ring minutes" role="group" aria-label=${loomiT("timepicker.minute", {}, this.locale)} @click=${this.onMinuteRingClick}>
          ${minuteMarks.map((minute, index) => {
            const angle = ((index / minuteMarks.length) * 360) - 90;
            return html`<button
              type="button"
              class="loomi-clock-minute ${this.minute === minute ? "active" : ""}"
              style=${`--loomi-clock-angle:${angle}deg`}
              @click=${(e: Event) => { e.stopPropagation(); this.selectClockMinute(minute); }}
            >${pad(minute)}</button>`;
          })}
        </div>
        <button
          type="button"
          class="loomi-clock-center"
          aria-label=${loomiT("timepicker.toggleFormat", {}, this.locale)}
          @click=${() => this.toggleFormat()}
        >${this.format}H</button>
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
      <div class="loomi-field variant-${this.variant}" tabindex="0" @blur=${this.showValidation} @click=${() => this.onFieldClick()}>
        <span class="loomi-text ${this.value ? "" : "placeholder"}">${this.value || loomiDefaultText(this.placeholder, DEFAULT_PLACEHOLDER, "timepicker.placeholder", this.locale)}${!this.value && this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${CLOCK}</svg>
      </div>
      ${this.open && this.tpStyle !== "clock" ? html`<div class="loomi-panel" @click=${(e: Event) => e.stopPropagation()}>${this.renderSelects()}</div>` : nothing}
      <loomi-modal
        class="loomi-clock-modal"
        size="small"
        locale=${this.locale}
        cancel-button-label=""
        @open=${() => { this.open = true; }}
        @close=${() => { this.open = false; this.showValidation(); }}
      >${this.renderClock()}</loomi-modal>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timepicker": LoomiTimepicker;
  }
}
