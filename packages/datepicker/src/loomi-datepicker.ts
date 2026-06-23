import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles, onClickOutside } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiDateFormat =
  | "yyyy-mm-dd" | "dd-mm-yyyy" | "mm-dd-yyyy" | "yyyy/mm/dd" | "dd/mm/yyyy" | "mm/dd/yyyy" | "D d M, Y";
export type LoomiDatepickerSize = "tiny" | "small" | "regular" | "medium" | "big";

const CAL = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />`;
const PREV = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`;
const NEXT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (s: string): Date | null => {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/**
 * `<loomi-datepicker>` — a calendar date picker (single or range). Locale-aware month
 * and weekday names. Form-associated: submits the formatted date(s) under `name`.
 * `selected-value`/`min-date`/`max-date` are parsed as ISO `yyyy-mm-dd`.
 *
 * @fires change - `detail: { value, dates }` when the selection changes.
 */
@customElement("loomi-datepicker")
export class LoomiDatepicker extends LitElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property() name = "";
  @property({ type: Boolean }) range = false;
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property({ attribute: "min-date" }) minDate = "";
  @property({ attribute: "max-date" }) maxDate = "";
  @property() format: LoomiDateFormat = "yyyy-mm-dd";
  @property() placeholder = "Select a date";
  @property() label = "";
  @property({ type: Boolean }) required = false;
  @property({ attribute: "week-starts" }) weekStarts: "sunday" | "monday" = "sunday";
  @property() size: LoomiDatepickerSize = "regular";

  @state() private start: Date | null = null;
  @state() private end: Date | null = null;
  @state() private view = new Date();
  @state() private open = false;
  @state() private parsed = false;
  private cleanup?: () => void;

  override willUpdate(): void {
    if (!this.parsed && this.selectedValue) {
      const parts = this.selectedValue.split(" - ");
      this.start = parseISO(parts[0]) ?? null;
      this.end = parts[1] ? parseISO(parts[1]) : null;
      if (this.start) this.view = new Date(this.start);
      this.parsed = true;
    }
    this.internals.setFormValue(this.value);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  private fmt(d: Date): string {
    const y = d.getFullYear(), mm = pad(d.getMonth() + 1), dd = pad(d.getDate());
    switch (this.format) {
      case "dd-mm-yyyy": return `${dd}-${mm}-${y}`;
      case "mm-dd-yyyy": return `${mm}-${dd}-${y}`;
      case "yyyy/mm/dd": return `${y}/${mm}/${dd}`;
      case "dd/mm/yyyy": return `${dd}/${mm}/${y}`;
      case "mm/dd/yyyy": return `${mm}/${dd}/${y}`;
      case "D d M, Y": {
        const wd = d.toLocaleDateString(undefined, { weekday: "short" });
        const mo = d.toLocaleDateString(undefined, { month: "short" });
        return `${wd} ${d.getDate()} ${mo}, ${y}`;
      }
      default: return `${y}-${mm}-${dd}`;
    }
  }

  /** Formatted value (range joined with " - "). */
  get value(): string {
    if (!this.start) return "";
    if (this.range) return this.end ? `${this.fmt(this.start)} - ${this.fmt(this.end)}` : this.fmt(this.start);
    return this.fmt(this.start);
  }

  private get min(): Date | null { return this.minDate ? parseISO(this.minDate) : null; }
  private get max(): Date | null { return this.maxDate ? parseISO(this.maxDate) : null; }

  private disabled(d: Date): boolean {
    if (this.min && d < this.min) return true;
    if (this.max && d > this.max) return true;
    return false;
  }

  private toggle(): void {
    this.open = !this.open;
    if (this.open) this.cleanup = onClickOutside(this, () => (this.open = false));
    else this.cleanup?.();
  }

  private pick(d: Date): void {
    if (this.range) {
      if (!this.start || this.end || d < this.start) {
        this.start = d;
        this.end = null;
      } else {
        this.end = d;
      }
    } else {
      this.start = d;
      this.open = false;
      this.cleanup?.();
    }
    this.internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true, composed: true,
      detail: { value: this.value, dates: [this.start, this.end].filter(Boolean).map((d) => d && iso(d)) },
    }));
  }

  private shiftMonth(delta: number): void {
    this.view = new Date(this.view.getFullYear(), this.view.getMonth() + delta, 1);
  }

  private weekdays(): string[] {
    const base = new Date(2023, 0, 1); // a Sunday
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i + (this.weekStarts === "monday" ? 1 : 0));
      days.push(d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2));
    }
    return days;
  }

  override render(): TemplateResult {
    const y = this.view.getFullYear(), m = this.view.getMonth();
    const first = new Date(y, m, 1);
    const offset = (first.getDay() - (this.weekStarts === "monday" ? 1 : 0) + 7) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    const monthLabel = this.view.toLocaleDateString(undefined, { month: "long", year: "numeric" });

    const cells: TemplateResult[] = [];
    for (let i = 0; i < offset; i++) cells.push(html`<span class="loomi-empty"></span>`);
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day);
      const isStart = this.start && sameDay(d, this.start);
      const isEnd = this.end && sameDay(d, this.end);
      const inRange = this.range && this.start && this.end && d > this.start && d < this.end;
      cells.push(html`<button
        class="loomi-day ${isStart || isEnd ? "selected" : ""} ${inRange ? "in-range" : ""} ${sameDay(d, today) ? "today" : ""}"
        ?disabled=${this.disabled(d)}
        @click=${() => this.pick(d)}
      >${day}</button>`);
    }

    return html`<div class="loomi-dp ${this.open ? "open" : ""}">
      ${this.label ? html`<span class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>` : nothing}
      <div class="loomi-field size-${this.size}" @click=${() => this.toggle()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${CAL}</svg>
        <span class="loomi-text ${this.value ? "" : "placeholder"}">${this.value || this.placeholder}${!this.value && this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>
      </div>
      ${this.open
        ? html`<div class="loomi-cal" @click=${(e: Event) => e.stopPropagation()}>
            <div class="loomi-head">
              <button class="loomi-nav" aria-label="Previous month" @click=${() => this.shiftMonth(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${PREV}</svg></button>
              <span class="loomi-month">${monthLabel}</span>
              <button class="loomi-nav" aria-label="Next month" @click=${() => this.shiftMonth(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${NEXT}</svg></button>
            </div>
            <div class="loomi-grid">
              ${this.weekdays().map((w) => html`<span class="loomi-wd">${w}</span>`)}
              ${cells}
            </div>
          </div>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-datepicker": LoomiDatepicker;
  }
}
