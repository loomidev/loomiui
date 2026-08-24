import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  LoomiElement,
  controlSizeStyles,
  fieldStyles,
  loomiDateFormatter,
  loomiDefaultText,
  loomiMonthName,
  loomiStyles,
  loomiT,
  loomiWeekdayNames,
  onClickOutside,
  type LoomiFieldLabelPosition,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiDateFormat =
  | "yyyy-mm-dd"
  | "dd-mm-yyyy"
  | "mm-dd-yyyy"
  | "yyyy/mm/dd"
  | "dd/mm/yyyy"
  | "mm/dd/yyyy"
  | "D d M, Y";
export type LoomiDatepickerSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiDatepickerStyle = "popup" | "inline";
export type LoomiDatepickerVariant = "default" | "minimal";
type LoomiCalendarView = "days" | "months" | "years";

const CAL = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />`;
const PREV = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`;
const NEXT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;
const DEFAULT_PLACEHOLDER = "Select a date";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (s: string): Date | null => {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/**
 * `<loomi-datepicker>` — a calendar date picker (single or range). `popup` (input +
 * panel) or `inline` (calendar always visible, no triggering input). Locale-aware
 * month and weekday names. Form-associated: submits the formatted date(s) under `name`.
 * `selected-value`/`min-date`/`max-date` are parsed as ISO `yyyy-mm-dd`.
 *
 * @fires change - `detail: { value, dates }` when the selection changes.
 */
@customElement("loomi-datepicker")
export class LoomiDatepicker extends LoomiElement {
  static override styles = loomiStyles(controlSizeStyles, fieldStyles, componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();
  private initialSelectedValue = "";

  @property({ reflect: true }) name = "";
  /** `popup` (input + panel) or `inline`. Attribute is `dp-style` (`style` is reserved). */
  @property({ attribute: "dp-style" }) dpStyle: LoomiDatepickerStyle = "popup";
  @property({ type: Boolean }) range = false;
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property({ attribute: "min-date" }) minDate = "";
  @property({ attribute: "max-date" }) maxDate = "";
  @property() format: LoomiDateFormat = "yyyy-mm-dd";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property() label = "";
  @property({ attribute: "label-position", reflect: true })
  labelPosition: LoomiFieldLabelPosition = "default";
  @property() locale = "";
  @property({ type: Boolean }) required = false;
  @property({ attribute: "week-starts" }) weekStarts: "sunday" | "monday" = "sunday";
  @property() size: LoomiDatepickerSize = "regular";
  @property() variant: LoomiDatepickerVariant = "default";

  @state() private start: Date | null = null;
  @state() private end: Date | null = null;
  @state() private view = new Date();
  @state() private open = false;
  @state() private parsed = false;
  @state() private calendarView: LoomiCalendarView = "days";
  @state() private yearRangeStart = Math.floor(new Date().getFullYear() / 12) * 12;
  /**
   * The day the grid's single tab stop sits on. A month is 28–31 buttons; making each one
   * a tab stop means tabbing past the whole month to leave the calendar, so the grid uses
   * the roving-tabindex pattern the WAI-ARIA APG specifies for a date grid instead.
   */
  @state() private focusedDay: Date | null = null;
  /** Set when a keypress moved the roving focus, so `updated()` follows it in the DOM. */
  private pendingFocusMove = false;
  private cleanup?: () => void;

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialSelectedValue = this.selectedValue;
    super.connectedCallback();
  }

  formResetCallback(): void {
    this.selectedValue = this.initialSelectedValue;
    this.applySelectedValue(this.initialSelectedValue);
    this.open = false;
    this.calendarView = "days";
    this.cleanup?.();
    this.cleanup = undefined;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("selectedValue") || (!this.parsed && this.selectedValue)) {
      this.applySelectedValue(this.selectedValue);
    }
    this.internals.setFormValue(this.value);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  private applySelectedValue(value: string): void {
    const parts = value.split(" - ");
    this.start = parts[0] ? (parseISO(parts[0]) ?? null) : null;
    this.end = parts[1] ? (parseISO(parts[1]) ?? null) : null;
    if (this.start) this.view = new Date(this.start);
    this.parsed = true;
  }

  private fmt(d: Date): string {
    const y = d.getFullYear(),
      mm = pad(d.getMonth() + 1),
      dd = pad(d.getDate());
    switch (this.format) {
      case "dd-mm-yyyy":
        return `${dd}-${mm}-${y}`;
      case "mm-dd-yyyy":
        return `${mm}-${dd}-${y}`;
      case "yyyy/mm/dd":
        return `${y}/${mm}/${dd}`;
      case "dd/mm/yyyy":
        return `${dd}/${mm}/${y}`;
      case "mm/dd/yyyy":
        return `${mm}/${dd}/${y}`;
      case "D d M, Y": {
        const wd = loomiDateFormatter(this.locale, { weekday: "short" }).format(d);
        const mo = loomiDateFormatter(this.locale, { month: "short" }).format(d);
        return `${wd} ${d.getDate()} ${mo}, ${y}`;
      }
      default:
        return `${y}-${mm}-${dd}`;
    }
  }

  /** Formatted value (range joined with " - "). */
  get value(): string {
    if (!this.start) return "";
    if (this.range)
      return this.end ? `${this.fmt(this.start)} - ${this.fmt(this.end)}` : this.fmt(this.start);
    return this.fmt(this.start);
  }

  private get min(): Date | null {
    return this.minDate ? parseISO(this.minDate) : null;
  }
  private get max(): Date | null {
    return this.maxDate ? parseISO(this.maxDate) : null;
  }

  private disabled(d: Date): boolean {
    if (this.min && d < this.min) return true;
    if (this.max && d > this.max) return true;
    return false;
  }

  private toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.calendarView = "days";
      this.yearRangeStart = this.yearRangeFor(this.view.getFullYear());
      this.cleanup = onClickOutside(this, () => (this.open = false));
    } else this.cleanup?.();
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
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          dates: [this.start, this.end].filter(Boolean).map((d) => d && iso(d)),
        },
      }),
    );
  }

  /**
   * Which day carries the grid's tab stop: the roving focus if the user has moved it, else
   * the selected day, else the first of the month — so arriving by Tab lands somewhere
   * meaningful rather than always on the 1st.
   */
  private rovingDay(year: number, month: number): Date {
    if (
      this.focusedDay &&
      this.focusedDay.getFullYear() === year &&
      this.focusedDay.getMonth() === month
    ) {
      return this.focusedDay;
    }
    for (const candidate of [this.start, this.end]) {
      if (candidate && candidate.getFullYear() === year && candidate.getMonth() === month) {
        return candidate;
      }
    }
    return new Date(year, month, 1);
  }

  private moveFocus(days: number): void {
    const from = this.rovingDay(this.view.getFullYear(), this.view.getMonth());
    const next = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
    this.focusedDay = next;
    // Stepping off either end of the month scrolls the grid rather than dead-ending.
    if (
      next.getMonth() !== this.view.getMonth() ||
      next.getFullYear() !== this.view.getFullYear()
    ) {
      this.view = new Date(next.getFullYear(), next.getMonth(), 1);
    }
    this.pendingFocusMove = true;
  }

  private onGridKeydown = (event: KeyboardEvent): void => {
    const current = this.rovingDay(this.view.getFullYear(), this.view.getMonth());
    switch (event.key) {
      case "ArrowLeft":
        this.moveFocus(-1);
        break;
      case "ArrowRight":
        this.moveFocus(1);
        break;
      case "ArrowUp":
        this.moveFocus(-7);
        break;
      case "ArrowDown":
        this.moveFocus(7);
        break;
      case "Home":
        this.moveFocus(-current.getDay());
        break;
      case "End":
        this.moveFocus(6 - current.getDay());
        break;
      case "PageUp":
        this.focusedDay = new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          current.getDate(),
        );
        this.view = new Date(this.focusedDay.getFullYear(), this.focusedDay.getMonth(), 1);
        this.pendingFocusMove = true;
        break;
      case "PageDown":
        this.focusedDay = new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          current.getDate(),
        );
        this.view = new Date(this.focusedDay.getFullYear(), this.focusedDay.getMonth(), 1);
        this.pendingFocusMove = true;
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  override updated(changed: Map<string, unknown>): void {
    super.updated?.(changed as never);
    if (!this.pendingFocusMove) return;
    this.pendingFocusMove = false;
    // Keyboard focus has to follow the roving tab stop, or the grid moves visually while
    // the screen reader stays announcing the day the user started on.
    const target = this.renderRoot.querySelector<HTMLButtonElement>('.loomi-day[tabindex="0"]');
    target?.focus();
  }

  private shiftMonth(delta: number): void {
    this.view = new Date(this.view.getFullYear(), this.view.getMonth() + delta, 1);
  }

  private yearRangeFor(year: number): number {
    return Math.floor(year / 12) * 12;
  }

  private showMonths(): void {
    this.calendarView = "months";
  }

  private showYears(): void {
    this.yearRangeStart = this.yearRangeFor(this.view.getFullYear());
    this.calendarView = "years";
  }

  private pickMonth(month: number): void {
    this.view = new Date(this.view.getFullYear(), month, 1);
    this.calendarView = "days";
  }

  private pickYear(year: number): void {
    this.view = new Date(year, this.view.getMonth(), 1);
    this.calendarView = "days";
  }

  private shiftYearRange(delta: number): void {
    this.yearRangeStart += delta * 12;
  }

  private weekdays(): string[] {
    return loomiWeekdayNames(this.locale, this.weekStarts);
  }

  override render(): TemplateResult {
    const y = this.view.getFullYear(),
      m = this.view.getMonth();
    const first = new Date(y, m, 1);
    const offset = (first.getDay() - (this.weekStarts === "monday" ? 1 : 0) + 7) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    const placeholder = loomiDefaultText(
      this.placeholder,
      DEFAULT_PLACEHOLDER,
      "datepicker.placeholder",
      this.locale,
    );

    const cells: TemplateResult[] = [];
    for (let i = 0; i < offset; i++) cells.push(html`<span class="loomi-empty"></span>`);
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(y, m, day);
      const isStart = this.start && sameDay(d, this.start);
      const isEnd = this.end && sameDay(d, this.end);
      const inRange = this.range && this.start && this.end && d > this.start && d < this.end;
      const isFocusTarget = sameDay(d, this.rovingDay(y, m));
      cells.push(html`<button
        class="loomi-day ${isStart || isEnd ? "selected" : ""} ${inRange ? "in-range" : ""} ${sameDay(d, today) ? "today" : ""}"
        role="gridcell"
        data-day=${day}
        tabindex=${isFocusTarget ? "0" : "-1"}
        aria-selected=${isStart || isEnd ? "true" : "false"}
        aria-label=${loomiDateFormatter(this.locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(d)}
        ?disabled=${this.disabled(d)}
        @click=${() => this.pick(d)}
      >${day}</button>`);
    }

    const months = Array.from({ length: 12 }, (_value, month) => {
      return html`<button
        class="loomi-picker-cell ${month === m ? "selected" : ""}"
        aria-label=${loomiDateFormatter(this.locale, { month: "long", year: "numeric" }).format(new Date(y, month, 1))}
        @click=${() => this.pickMonth(month)}
      >${loomiMonthName(this.locale, month, "short")}</button>`;
    });

    const years = Array.from({ length: 12 }, (_value, index) => {
      const year = this.yearRangeStart + index;
      return html`<button
        class="loomi-picker-cell ${year === y ? "selected" : ""}"
        @click=${() => this.pickYear(year)}
      >${year}</button>`;
    });

    const calendarBody = html`
      <div class="loomi-head">
        ${
          this.calendarView === "years"
            ? html`<button class="loomi-nav" aria-label=${loomiT("datepicker.previousYears", {}, this.locale)} @click=${() => this.shiftYearRange(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${PREV}</svg></button>
            <span class="loomi-month">${this.yearRangeStart} - ${this.yearRangeStart + 11}</span>
            <button class="loomi-nav" aria-label=${loomiT("datepicker.nextYears", {}, this.locale)} @click=${() => this.shiftYearRange(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${NEXT}</svg></button>`
            : this.calendarView === "months"
              ? html`<span class="loomi-nav-spacer"></span>
              <button class="loomi-head-button" aria-label=${loomiT("datepicker.chooseYear", {}, this.locale)} @click=${() => this.showYears()}>${y}</button>
              <span class="loomi-nav-spacer"></span>`
              : html`<button class="loomi-nav" aria-label=${loomiT("datepicker.previousMonth", {}, this.locale)} @click=${() => this.shiftMonth(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${PREV}</svg></button>
              <span class="loomi-title">
                <button class="loomi-head-button" aria-label=${loomiT("datepicker.chooseMonth", {}, this.locale)} @click=${() => this.showMonths()}>${loomiMonthName(this.locale, this.view.getMonth(), "long")}</button>
                <button class="loomi-head-button" aria-label=${loomiT("datepicker.chooseYear", {}, this.locale)} @click=${() => this.showYears()}>${y}</button>
              </span>
              <button class="loomi-nav" aria-label=${loomiT("datepicker.nextMonth", {}, this.locale)} @click=${() => this.shiftMonth(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${NEXT}</svg></button>`
        }
      </div>
      ${
        this.calendarView === "years"
          ? html`<div class="loomi-picker-grid years">${years}</div>`
          : this.calendarView === "months"
            ? html`<div class="loomi-picker-grid months">${months}</div>`
            : html`<div class="loomi-grid" role="grid" @keydown=${this.onGridKeydown}>
            ${this.weekdays().map(
              (w) => html`<span class="loomi-wd" role="columnheader">${w}</span>`,
            )}
            ${cells}
          </div>`
      }
    `;

    if (this.dpStyle === "inline") {
      return html`<div class="loomi-dp-inline">
        ${this.label ? html`<span class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>` : nothing}
        <div class="loomi-cal inline">${calendarBody}</div>
      </div>`;
    }

    return html`<div class="loomi-dp ${this.open ? "open" : ""}">
      ${this.label ? html`<span class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>` : nothing}
      <div class="loomi-field size-${this.size} variant-${this.variant}" @click=${() => this.toggle()}>
        <span class="loomi-text ${this.value ? "" : "placeholder"}">${this.value || placeholder}${!this.value && this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${CAL}</svg>
      </div>
      ${
        this.open
          ? html`<div class="loomi-cal" @click=${(e: Event) => e.stopPropagation()}>${calendarBody}</div>`
          : nothing
      }
    </div>`;
  }
}

export interface LoomiDatepickerChangeDetail {
  /** Formatted value — one ISO date, or a range joined with `" - "`. */
  value: string;
  /** Selected dates as ISO `yyyy-mm-dd` strings: one entry, or two for a range. */
  dates: string[];
}

/** Event map for `<loomi-datepicker>`. `change` carries a datepicker-specific detail,
 * so it is typed per package instead of globally on `HTMLElementEventMap`. */
export interface LoomiDatepickerEventMap {
  change: CustomEvent<LoomiDatepickerChangeDetail>;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-datepicker": LoomiDatepicker;
  }
}
