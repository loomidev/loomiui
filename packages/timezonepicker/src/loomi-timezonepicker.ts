import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiStyles, loomiT, onClickOutside } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTimezonepickerSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiTimezonepickerVariant = "default" | "minimal";

export interface LoomiTimezoneRecord {
  /** Canonical IANA identifier, e.g. "America/New_York". */
  id: string;
  /** Last path segment of the id, underscores replaced with spaces, e.g. "New York". */
  city: string;
  /** Remaining leading path segments, e.g. "America" (or "Other" for bare ids like "UTC"). */
  region: string;
  /** Current offset from UTC in minutes (DST-aware, computed for "now"). */
  offsetMinutes: number;
  /** Formatted offset, e.g. "UTC+05:30". */
  offsetLabel: string;
  /** Current local time in that zone, formatted per `locale`. */
  time: string;
}

const CHEVRON = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />`;
const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;
const PIN = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />`;
const DEFAULT_PLACEHOLDER = "Select a timezone";
const DEFAULT_EMPTY_PLACEHOLDER = "No timezones found";

// A small hand-picked set covering every UTC offset, used only on engines without
// `Intl.supportedValuesOf` (e.g. Safari < 15.4) — modern evergreen browsers and Node 20+
// return the full ~400-zone IANA set instead.
const FALLBACK_ZONE_IDS = [
  "UTC", "Pacific/Midway", "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles",
  "America/Denver", "America/Chicago", "America/Mexico_City", "America/New_York",
  "America/Halifax", "America/St_Johns", "America/Sao_Paulo", "Atlantic/Azores",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Rome",
  "Africa/Lagos", "Africa/Cairo", "Europe/Moscow", "Asia/Dubai", "Asia/Kabul",
  "Asia/Karachi", "Asia/Kolkata", "Asia/Kathmandu", "Asia/Dhaka", "Asia/Bangkok",
  "Asia/Shanghai", "Asia/Singapore", "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney",
  "Pacific/Norfolk", "Pacific/Auckland", "Pacific/Kiritimati",
];

function allTimezoneIds(): string[] {
  try {
    const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
    if (typeof supportedValuesOf === "function") {
      const zones = supportedValuesOf("timeZone");
      if (zones.length) return zones;
    }
  } catch {
    /* fall through to the fallback list */
  }
  return FALLBACK_ZONE_IDS;
}

function splitZoneId(id: string): { city: string; region: string } {
  const parts = id.split("/");
  const city = (parts[parts.length - 1] ?? id).replace(/_/g, " ");
  const region = parts.length > 1 ? parts.slice(0, -1).join(" / ").replace(/_/g, " ") : "Other";
  return { city, region };
}

// Computes the zone's current UTC offset by reading its wall-clock time for `at`,
// re-interpreting those same numbers as UTC, and diffing from the real UTC instant —
// works for any offset granularity (including the 30/45-minute zones) and stays
// DST-correct since it's keyed off `at`, unlike a baked-in offset would be.
function offsetMinutesFor(id: string, at: Date): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: id,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(at)
      .reduce<Record<string, string>>((acc, part) => {
        if (part.type !== "literal") acc[part.type] = part.value;
        return acc;
      }, {});
    const asUTC = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour), Number(parts.minute), Number(parts.second),
    );
    const minutes = Math.round((asUTC - at.getTime()) / 60000);
    return minutes === 0 ? 0 : minutes; // normalize -0
  } catch {
    return 0;
  }
}

function formatOffsetLabel(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const abs = Math.abs(offsetMinutes);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

function currentTimeFor(id: string, locale: string, at: Date): string {
  try {
    return new Intl.DateTimeFormat(locale || undefined, { timeZone: id, hour: "numeric", minute: "2-digit" }).format(at);
  } catch {
    return "";
  }
}

function buildZoneRecords(locale: string): LoomiTimezoneRecord[] {
  const now = new Date();
  const records = allTimezoneIds().map((id) => {
    const { city, region } = splitZoneId(id);
    const offsetMinutes = offsetMinutesFor(id, now);
    return {
      id,
      city,
      region,
      offsetMinutes,
      offsetLabel: formatOffsetLabel(offsetMinutes),
      time: currentTimeFor(id, locale, now),
    };
  });
  records.sort((a, b) => a.offsetMinutes - b.offsetMinutes || a.city.localeCompare(b.city));
  return records;
}

function browserZoneId(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

/**
 * `<loomi-timezonepicker>` — a searchable dropdown over the full IANA timezone
 * database (`Intl.supportedValuesOf("timeZone")`), each row showing its current local
 * time and live UTC offset (DST-aware, recomputed — not a baked-in value).
 *
 * `selection` accepts a canonical IANA id (e.g. `"Africa/Accra"`) or a bare city name
 * (e.g. `"Accra"`), case-insensitively.
 *
 * Form-associated: submits the IANA id under `name`.
 *
 * @csspart trigger - The clickable trigger.
 * @csspart panel - The dropdown panel.
 * @fires select - `detail: { id, city, region, offsetLabel }` when a zone is chosen.
 * @fires change - Fired when the selection changes (composed).
 */
@customElement("loomi-timezonepicker")
export class LoomiTimezonepicker extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property() locale = "";
  @property() selection = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() size: LoomiTimezonepickerSize = "medium";
  @property() variant: LoomiTimezonepickerVariant = "default";
  @property({ attribute: "empty-placeholder" }) emptyPlaceholder = DEFAULT_EMPTY_PLACEHOLDER;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private open = false;
  @state() private search = "";
  @state() private selectedId = "";
  /** Index of the keyboard-highlighted option within `this.filtered`, while open. */
  @state() private activeIndex = -1;

  @query(".loomi-search") private searchEl?: HTMLInputElement;
  @query(".loomi-trigger") private triggerEl?: HTMLButtonElement;

  private recordsCache: { locale: string; at: number; records: LoomiTimezoneRecord[] } | null = null;

  private cleanupClickOutside?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanupClickOutside = onClickOutside(this, () => {
      if (this.open) this.close(true);
    });
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupClickOutside?.();
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("selection")) {
      this.selectedId = this.resolveZone(this.selection)?.id ?? "";
    }
    this.internals.setFormValue(this.formValue);
    this.syncValidity();
  }

  /** Pre-built zone list (id, city, region, live offset, live local time) — recomputed
   * at most once a minute (or on a locale change) so offsets stay fresh without a timer. */
  private get records(): LoomiTimezoneRecord[] {
    const now = Date.now();
    if (!this.recordsCache || this.recordsCache.locale !== this.locale || now - this.recordsCache.at > 60_000) {
      this.recordsCache = { locale: this.locale, at: now, records: buildZoneRecords(this.locale) };
    }
    return this.recordsCache.records;
  }

  private resolveZone(raw: string): LoomiTimezoneRecord | undefined {
    const q = raw.trim();
    if (!q) return undefined;
    const lower = q.toLowerCase();
    return this.records.find((z) => z.id.toLowerCase() === lower) ?? this.records.find((z) => z.city.toLowerCase() === lower);
  }

  private get formValue(): string {
    return this.selectedId;
  }

  private get selectedRecord(): LoomiTimezoneRecord | undefined {
    return this.selectedId ? this.records.find((z) => z.id === this.selectedId) : undefined;
  }

  private get browserZone(): LoomiTimezoneRecord | undefined {
    const id = browserZoneId();
    return id ? this.records.find((z) => z.id === id) : undefined;
  }

  private get filtered(): readonly LoomiTimezoneRecord[] {
    if (!this.search) return this.records;
    const q = this.search.trim().toLowerCase();
    return this.records.filter(
      (z) =>
        z.city.toLowerCase().includes(q) ||
        z.region.toLowerCase().includes(q) ||
        z.id.toLowerCase().includes(q) ||
        z.offsetLabel.toLowerCase().includes(q),
    );
  }

  /** Clear the current selection. */
  reset(): void {
    this.selection = "";
    this.selectedId = "";
    this.emitChange();
  }

  private toggleOpen(): void {
    if (this.disabled || this.readonly) return;
    if (this.open) {
      this.close(true);
      return;
    }
    this.open = true;
    const selectedIndex = this.filtered.findIndex((z) => z.id === this.selectedId);
    this.activeIndex = selectedIndex >= 0 ? selectedIndex : this.filtered.length ? 0 : -1;
    this.updateComplete.then(() => this.searchEl?.focus());
  }

  private close(showValidation = false): void {
    this.open = false;
    this.search = "";
    this.activeIndex = -1;
    if (showValidation) this.showValidation();
  }

  private emitChange(): void {
    this.internals.setFormValue(this.formValue);
    this.syncValidity();
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private choose(rec: LoomiTimezoneRecord): void {
    this.selectedId = rec.id;
    this.selection = rec.id;
    this.close();
    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: { id: rec.id, city: rec.city, region: rec.region, offsetLabel: rec.offsetLabel },
      }),
    );
    this.emitChange();
  }

  private useMyTimezone(): void {
    const rec = this.browserZone;
    if (rec) this.choose(rec);
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
    const empty = this.required && !this.disabled && !this.readonly && this.selectedId === "";
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? loomiT("validation.selectOption", {}, this.locale) : "";
    if (this.triggerEl) this.internals.setValidity(validity, message, this.triggerEl);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.close(true);
      return;
    }
    if (!this.open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.toggleOpen();
      }
      return;
    }
    const opts = this.filtered;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, opts.length - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        break;
      case "Home":
        e.preventDefault();
        this.activeIndex = 0;
        break;
      case "End":
        e.preventDefault();
        this.activeIndex = opts.length - 1;
        break;
      case "Enter":
      case " ":
        if (this.activeIndex >= 0 && opts[this.activeIndex]) {
          e.preventDefault();
          this.choose(opts[this.activeIndex]);
        }
        break;
    }
  };

  private renderPanel(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    const opts = this.filtered;
    const myZone = this.browserZone;
    return html`
      <div class="loomi-panel" part="panel" role="listbox">
        <div class="loomi-searchbox">
          <input
            class="loomi-search"
            type="text"
            placeholder=${loomiT("timezonepicker.searchPlaceholder", {}, this.locale)}
            .value=${this.search}
            @input=${(e: Event) => {
              this.search = (e.target as HTMLInputElement).value;
              this.activeIndex = this.filtered.length ? 0 : -1;
            }}
          />
        </div>
        ${myZone
          ? html`<button type="button" class="loomi-detect" @click=${() => this.useMyTimezone()}>
              <svg class="loomi-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PIN}</svg>
              <span class="loomi-detect-label">${loomiT("timezonepicker.detectLabel", {}, this.locale)}</span>
              <span class="loomi-detect-zone">${myZone.city} (${myZone.offsetLabel})</span>
            </button>`
          : nothing}
        <div class="loomi-list">
          ${opts.length
            ? opts.map((z, i) => {
                const sel = z.id === this.selectedId;
                return html`<div
                  id="loomi-timezone-${i}"
                  class="loomi-option ${sel ? "selected" : ""} ${i === this.activeIndex ? "active" : ""}"
                  role="option"
                  aria-selected=${sel ? "true" : "false"}
                  @mouseenter=${() => (this.activeIndex = i)}
                  @click=${() => this.choose(z)}
                >
                  <span class="loomi-option-text">
                    <span class="loomi-option-city">${z.city}</span>
                    <span class="loomi-option-region">${z.region}</span>
                  </span>
                  <span class="loomi-option-meta">
                    <span class="loomi-option-time">${z.time}</span>
                    <span class="loomi-option-offset">${z.offsetLabel}</span>
                  </span>
                  ${sel
                    ? html`<svg class="loomi-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${CHECK}</svg>`
                    : nothing}
                </div>`;
              })
            : html`<div class="loomi-empty">${loomiDefaultText(this.emptyPlaceholder, DEFAULT_EMPTY_PLACEHOLDER, "timezonepicker.emptyPlaceholder", this.locale)}</div>`}
        </div>
      </div>
    `;
  }

  private get floatLabel(): boolean {
    if (!this.label) return false;
    return this.open || !!this.selectedId;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const hasSelection = !!this.selectedId;
    const reserveLabelSpace = hasLabel && !hasSelection && !this.open;
    const rec = this.selectedRecord;
    const displayText = hasSelection && rec
      ? `${rec.city} (${rec.offsetLabel})`
      : reserveLabelSpace
        ? `${this.label}${this.required ? " *" : ""}`
        : loomiDefaultText(this.placeholder, DEFAULT_PLACEHOLDER, "timezonepicker.placeholder", this.locale);

    const activeId =
      this.open && this.activeIndex >= 0 && this.filtered[this.activeIndex] ? `loomi-timezone-${this.activeIndex}` : nothing;

    const classes = `loomi-timezonepicker size-${this.size} ${this.open ? "open" : ""} ${this.floatLabel ? "float" : ""}`;
    return html`
      <div class=${classes} @keydown=${this.onKeydown}>
        <button
          type="button"
          class="loomi-trigger variant-${this.variant}"
          part="trigger"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? "true" : "false"}
          aria-activedescendant=${activeId}
          ?disabled=${this.disabled}
          @click=${() => this.toggleOpen()}
          @blur=${this.showValidation}
        >
          <span class="loomi-value ${hasSelection ? "" : "placeholder"} ${reserveLabelSpace ? "sizer" : ""}">${displayText}</span>
          <svg class="loomi-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${CHEVRON}</svg>
        </button>
        ${hasLabel
          ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
          : nothing}
        ${this.renderPanel()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timezonepicker": LoomiTimezonepicker;
  }
}
