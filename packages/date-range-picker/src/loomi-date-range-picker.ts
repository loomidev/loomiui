import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { LoomiElement, loomiStyles, onClickOutside } from "@loomidev/core";
import type {
  DateRangeApplyDetail,
  DateRangeChangeDetail,
  DateRangeOpenChangeDetail,
  DateRangePreset,
  DateRangeValue
} from "./types.js";

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function formatDate(value: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return DATE_FORMATTER.format(parsed);
}

function createDefaultPresets(referenceDate = new Date()): DateRangePreset[] {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const yesterday = addDays(today, -1);
  const last7Start = addDays(today, -6);
  const last30Start = addDays(today, -29);
  const thisMonthStart = startOfMonth(today);
  const lastMonthStart = startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const lastMonthEnd = endOfMonth(lastMonthStart);

  return [
    { id: "today", label: "Today", startDate: toIsoDate(today), endDate: toIsoDate(today) },
    { id: "yesterday", label: "Yesterday", startDate: toIsoDate(yesterday), endDate: toIsoDate(yesterday) },
    { id: "last-7-days", label: "Last 7 days", startDate: toIsoDate(last7Start), endDate: toIsoDate(today) },
    { id: "last-30-days", label: "Last 30 days", startDate: toIsoDate(last30Start), endDate: toIsoDate(today) },
    { id: "this-month", label: "This month", startDate: toIsoDate(thisMonthStart), endDate: toIsoDate(today) },
    { id: "last-month", label: "Last month", startDate: toIsoDate(lastMonthStart), endDate: toIsoDate(lastMonthEnd) }
  ];
}

@customElement("loomi-date-range-picker")
export class LoomiDateRangePicker extends LoomiElement {
  static properties = {
    ...LoomiElement.properties,
    presets: { attribute: false },
    open: { type: Boolean, reflect: true },
    startDate: { attribute: "start-date", reflect: true },
    endDate: { attribute: "end-date", reflect: true },
    compareStartDate: { attribute: "compare-start-date" },
    compareEndDate: { attribute: "compare-end-date" },
    presetId: { attribute: "preset-id" },
    label: {},
    placeholder: {},
    min: {},
    max: {},
    comparison: { type: Boolean, reflect: true },
    showPresets: { attribute: "show-presets", type: Boolean, reflect: true }
  };

  static override styles = loomiStyles(css`
    :host {
      --loomi-date-border: var(--loomi-surface-border, #d9dee3);
      --loomi-date-muted: var(--loomi-text-muted, #62717d);
      --loomi-date-surface: var(--loomi-surface, #ffffff);
      --loomi-date-surface-active: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
      --loomi-date-surface-hover: var(--loomi-surface-hover, #f9fbfc);
      --loomi-date-text: var(--loomi-text, #172026);
      --loomi-date-text-secondary: var(--loomi-text-secondary, #33424f);
      --loomi-date-accent: var(--loomi-primary-600, var(--_loomi-primary-600-default, #2563eb));
      --loomi-date-accent-strong: var(--loomi-primary-700, var(--_loomi-primary-700-default, #174ea6));
      display: inline-block;
      color: var(--loomi-date-text);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      position: relative;
    }

    .field {
      display: grid;
      gap: 6px;
    }

    label {
      color: var(--loomi-date-text-secondary);
      font-size: 13px;
      font-weight: 700;
    }

    .trigger {
      min-width: 280px;
      min-height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid var(--loomi-date-border);
      border-radius: 6px;
      background: var(--loomi-date-surface);
      color: inherit;
      padding: 0 10px;
      font: inherit;
      cursor: pointer;
    }

    .trigger-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chevron {
      color: var(--loomi-date-muted);
      font-size: 12px;
    }

    .popover {
      position: absolute;
      z-index: 100;
      top: calc(100% + 8px);
      right: 0;
      width: min(640px, calc(100vw - 32px));
      overflow: hidden;
      border: 1px solid var(--loomi-date-border);
      border-radius: 8px;
      background: var(--loomi-date-surface);
      box-shadow: 0 18px 50px rgb(15 23 42 / 0.16);
    }

    .content {
      display: grid;
      grid-template-columns: 180px minmax(0, 1fr);
    }

    :host(:not([show-presets])) .content {
      grid-template-columns: 1fr;
    }

    .presets {
      display: grid;
      align-content: start;
      gap: 4px;
      border-right: 1px solid var(--loomi-date-border);
      padding: 8px;
    }

    .preset,
    .footer button {
      min-height: 34px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      padding: 0 10px;
      text-align: left;
      font: inherit;
      cursor: pointer;
    }

    .preset:hover,
    .preset[aria-pressed="true"] {
      background: var(--loomi-date-surface-active);
      color: var(--loomi-date-accent-strong);
    }

    .ranges {
      display: grid;
      gap: 16px;
      padding: 16px;
    }

    .range-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .input-field {
      display: grid;
      gap: 6px;
    }

    .input-field span,
    .compare-toggle {
      color: var(--loomi-date-muted);
      font-size: 13px;
      font-weight: 600;
    }

    input[type="date"] {
      min-height: 36px;
      border: 1px solid var(--loomi-date-border);
      border-radius: 6px;
      background: var(--loomi-date-surface);
      color: inherit;
      padding: 0 10px;
      font: inherit;
    }

    .compare-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
    }

    .footer {
      display: flex;
      justify-content: end;
      gap: 8px;
      border-top: 1px solid var(--loomi-date-border);
      padding: 12px;
    }

    .footer button {
      border-color: var(--loomi-date-border);
      text-align: center;
    }

    .footer .apply {
      border-color: var(--loomi-date-accent);
      background: var(--loomi-date-accent);
      color: #ffffff;
    }

    @media (max-width: 640px) {
      .popover {
        left: 0;
        right: auto;
      }

      .content,
      .range-grid {
        grid-template-columns: 1fr;
      }

      .presets {
        border-right: 0;
        border-bottom: 1px solid var(--loomi-date-border);
      }
    }
  `);

  presets: DateRangePreset[] = createDefaultPresets();
  open = false;
  startDate = "";
  endDate = "";
  compareStartDate = "";
  compareEndDate = "";
  presetId = "custom";
  label = "Date range";
  placeholder = "Select date range";
  min = "";
  max = "";
  comparison = false;
  showPresets = true;
  private cleanupOutside?: () => void;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.handleDocumentKeydown);

    if (!this.startDate || !this.endDate) {
      const defaultPreset = this.presets.find((preset) => preset.id === "last-30-days") ?? this.presets[0];
      if (defaultPreset) {
        this.applyPresetValue(defaultPreset, false);
      }
    }
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleDocumentKeydown);
    this.cleanupOutside?.();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="field">
        <label>${this.label}</label>
        <button class="trigger" type="button" aria-expanded=${this.open ? "true" : "false"} @click=${this.toggleOpen}>
          <span class="trigger-text">${this.getDisplayValue()}</span>
          <span class="chevron">${this.open ? "Close" : "Open"}</span>
        </button>
      </div>
      ${this.open ? this.renderPopover() : nothing}
    `;
  }

  private renderPopover() {
    return html`
      <section class="popover" @click=${(event: Event) => event.stopPropagation()}>
        <div class="content">
          ${this.showPresets ? this.renderPresets() : nothing}
          <div class="ranges">
            ${this.renderRangeFields("Primary range", "startDate", "endDate")}
            <label class="compare-toggle">
              <input type="checkbox" .checked=${this.comparison} @change=${this.handleComparisonToggle} />
              <span>Compare to another range</span>
            </label>
            ${this.comparison ? this.renderRangeFields("Comparison range", "compareStartDate", "compareEndDate") : nothing}
          </div>
        </div>
        <div class="footer">
          <button type="button" @click=${this.closePicker}>Cancel</button>
          <button class="apply" type="button" @click=${this.applyRange}>Apply</button>
        </div>
      </section>
    `;
  }

  private renderPresets() {
    return html`
      <nav class="presets" aria-label="Date range presets">
        ${this.presets.map((preset) => {
          const pressed = this.presetId === preset.id;
          return html`
            <button
              class="preset"
              type="button"
              aria-pressed=${pressed ? "true" : "false"}
              @click=${() => this.handlePresetClick(preset)}
            >
              ${preset.label}
            </button>
          `;
        })}
      </nav>
    `;
  }

  private renderRangeFields(label: string, startProperty: "startDate" | "compareStartDate", endProperty: "endDate" | "compareEndDate") {
    return html`
      <section class="input-field">
        <span>${label}</span>
        <div class="range-grid">
          <label class="input-field">
            <span>Start</span>
            <input
              type="date"
              .value=${this[startProperty]}
              min=${this.min || nothing}
              max=${this.max || nothing}
              @input=${(event: Event) => this.handleDateInput(event, startProperty)}
            />
          </label>
          <label class="input-field">
            <span>End</span>
            <input
              type="date"
              .value=${this[endProperty]}
              min=${this.min || nothing}
              max=${this.max || nothing}
              @input=${(event: Event) => this.handleDateInput(event, endProperty)}
            />
          </label>
        </div>
      </section>
    `;
  }

  private toggleOpen = (event: Event) => {
    event.stopPropagation();
    this.open = !this.open;
    this.syncOutsideClick();
    this.dispatchOpenChange();
  };

  private closePicker = () => {
    this.open = false;
    this.syncOutsideClick();
    this.dispatchOpenChange();
  };

  private applyRange = () => {
    this.normalizeRange();
    this.dispatchDateEvent<DateRangeApplyDetail>("loomi-date-range-apply", {
      value: this.getValue(),
      presetId: this.presetId
    });
    this.closePicker();
  };

  private handlePresetClick(preset: DateRangePreset) {
    this.applyPresetValue(preset, true);
  }

  private handleDateInput(event: Event, property: "startDate" | "endDate" | "compareStartDate" | "compareEndDate") {
    this[property] = (event.target as HTMLInputElement).value;
    this.presetId = "custom";
    this.normalizeRange();
    this.dispatchChange();
  }

  private handleComparisonToggle = (event: Event) => {
    this.comparison = (event.target as HTMLInputElement).checked;

    if (!this.comparison) {
      this.compareStartDate = "";
      this.compareEndDate = "";
    } else if (!this.compareStartDate || !this.compareEndDate) {
      this.setDefaultComparisonRange();
    }

    this.dispatchChange();
  };

  private handleDocumentKeydown = (event: KeyboardEvent) => {
    if (!this.open || event.key !== "Escape") {
      return;
    }

    this.closePicker();
  };

  private syncOutsideClick() {
    this.cleanupOutside?.();
    this.cleanupOutside = this.open ? onClickOutside(this, () => this.closePicker()) : undefined;
  }

  private applyPresetValue(preset: DateRangePreset, emitChange: boolean) {
    this.startDate = preset.startDate;
    this.endDate = preset.endDate;
    this.presetId = preset.id;

    if (preset.compareStartDate && preset.compareEndDate) {
      this.comparison = true;
      this.compareStartDate = preset.compareStartDate;
      this.compareEndDate = preset.compareEndDate;
    }

    if (emitChange) {
      this.dispatchChange();
    }
  }

  private normalizeRange() {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      const previousStart = this.startDate;
      this.startDate = this.endDate;
      this.endDate = previousStart;
    }

    if (this.compareStartDate && this.compareEndDate && this.compareStartDate > this.compareEndDate) {
      const previousStart = this.compareStartDate;
      this.compareStartDate = this.compareEndDate;
      this.compareEndDate = previousStart;
    }
  }

  private setDefaultComparisonRange() {
    if (!this.startDate || !this.endDate) {
      return;
    }

    const start = new Date(`${this.startDate}T00:00:00`);
    const end = new Date(`${this.endDate}T00:00:00`);
    const durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
    const comparisonEnd = addDays(start, -1);
    const comparisonStart = addDays(comparisonEnd, -durationDays + 1);

    this.compareStartDate = toIsoDate(comparisonStart);
    this.compareEndDate = toIsoDate(comparisonEnd);
  }

  private dispatchChange() {
    this.dispatchDateEvent<DateRangeChangeDetail>("loomi-date-range-change", {
      value: this.getValue(),
      presetId: this.presetId
    });
  }

  private dispatchOpenChange() {
    this.dispatchDateEvent<DateRangeOpenChangeDetail>("loomi-date-range-open-change", { open: this.open });
  }

  private dispatchDateEvent<TDetail>(name: string, detail: TDetail) {
    this.dispatchEvent(
      new CustomEvent<TDetail>(name, {
        bubbles: true,
        composed: true,
        detail
      })
    );
  }

  private getValue(): DateRangeValue {
    const value: DateRangeValue = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    if (this.comparison && this.compareStartDate && this.compareEndDate) {
      value.compareStartDate = this.compareStartDate;
      value.compareEndDate = this.compareEndDate;
    }

    return value;
  }

  private getDisplayValue() {
    if (!this.startDate || !this.endDate) {
      return this.placeholder;
    }

    const primary = `${formatDate(this.startDate)} - ${formatDate(this.endDate)}`;

    if (!this.comparison || !this.compareStartDate || !this.compareEndDate) {
      return primary;
    }

    return `${primary} compared with ${formatDate(this.compareStartDate)} - ${formatDate(this.compareEndDate)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-date-range-picker": LoomiDateRangePicker;
  }
}
