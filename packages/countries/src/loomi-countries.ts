import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { LoomiElement, controlSizeStyles, fieldStyles, loomiDefaultText, loomiT, onClickOutside, themeStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";
import { LOOMI_COUNTRIES, type LoomiCountryRecord } from "./generated/countries-data.js";

export type LoomiCountriesMode = "names" | "phone";
export type LoomiCountriesSize = "tiny" | "small" | "regular" | "medium" | "big";

const CHEVRON = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />`;
const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;
const DEFAULT_PLACEHOLDER = "Select a country";
const DEFAULT_EMPTY_PLACEHOLDER = "No countries found";

// Dashed-circle placeholder shown in `mode="phone"` before any country is chosen — kept
// the same footprint as a real flag so picking one doesn't shift the layout.
const NO_FLAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle cx="256" cy="256" r="240" fill="none" stroke="currentColor" stroke-width="20" stroke-dasharray="34 24"/></svg>`;

// Each generated flag's internal mask id is the placeholder "{{U}}" (see scripts/build-data.mjs)
// so two simultaneous instances of the same flag in one shadow root (the trigger and the
// highlighted row in an open panel) never collide over the same id.
function flagMarkup(flag: string, uid: string): string {
  return flag.replaceAll("{{U}}", uid);
}

// Same character-stripping technique as @loomidev/input's `numeric` mode — `type="tel"`
// has no built-in keyboard restriction, it just hints a numeric keypad on mobile, so
// letters still pass through untouched without this.
function sanitizePhoneNumber(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

// Same Alpine-style mask wildcards as @loomidev/input's `mask`: "9" any digit, "a" any
// letter, "*" any alphanumeric. Every other mask character is a literal inserted
// automatically. Kept identical so anyone who already knows <loomi-input>'s mask syntax
// can reuse it here — "a"/"*" are effectively inert since sanitizePhoneNumber() always
// strips the raw value to digits before a mask is applied.
const MASK_TOKEN_TESTS: Record<string, (char: string) => boolean> = {
  "9": (char) => /[0-9]/.test(char),
  a: (char) => /[A-Za-z]/.test(char),
  "*": () => true,
};

// True if any remaining raw character (from `startIndex` on) could still satisfy some
// token in `mask` — used below to avoid emitting a dangling trailing literal (e.g.
// formatting "241" against "(999) 999-9999" as "(241" rather than "(241) ").
function hasRemainingMaskInput(raw: string, startIndex: number, mask: string): boolean {
  const tokenTests = Array.from(new Set(mask.split("").map((char) => MASK_TOKEN_TESTS[char]).filter(Boolean)));
  return raw
    .slice(startIndex)
    .split("")
    .some((char) => tokenTests.some((tokenTest) => tokenTest(char)));
}

function applyPhoneMask(raw: string, mask: string): string {
  let result = "";
  let rawIndex = 0;

  for (const maskChar of mask) {
    const tokenTest = MASK_TOKEN_TESTS[maskChar];

    if (!tokenTest) {
      if (raw[rawIndex] === maskChar) rawIndex += 1;
      if (hasRemainingMaskInput(raw, rawIndex, mask)) result += maskChar;
      continue;
    }

    while (rawIndex < raw.length) {
      const rawChar = raw[rawIndex++];
      if (tokenTest(rawChar)) {
        result += rawChar;
        break;
      }
    }

    if (rawIndex >= raw.length) break;
  }

  return result;
}

function normalizePhoneValue(raw: string, mask: string): string {
  const digits = sanitizePhoneNumber(raw);
  return mask ? applyPhoneMask(digits, mask) : digits;
}

function resolveCountry(input: string): LoomiCountryRecord | undefined {
  const q = input.trim();
  if (!q) return undefined;
  const upper = q.toUpperCase();
  const byCode = LOOMI_COUNTRIES.find((c) => c.code === upper);
  if (byCode) return byCode;
  const lower = q.toLowerCase();
  const byName = LOOMI_COUNTRIES.find((c) => c.name.toLowerCase() === lower);
  if (byName) return byName;
  const dial = q.startsWith("+") ? q : `+${q.replace(/\D/g, "")}`;
  const byDialCode = LOOMI_COUNTRIES.filter((c) => c.dialCode === dial).sort((a, b) => a.priority - b.priority);
  return byDialCode[0];
}

/**
 * `<loomi-countries>` — a searchable country dropdown with flag icons next to each
 * name. Defaults to a full country list (`mode="names"`); set `mode="phone"` to show
 * just the selected country's flag + dial code beside a phone-number input instead.
 *
 * `selection` accepts a country name, ISO 3166-1 alpha-2 code, or dial code, and the
 * property reflects back to the resolved alpha-2 code once a match is found.
 *
 * Form-associated: submits the alpha-2 code under `name` in `names` mode, or
 * `<dial code><number>` in `phone` mode. The phone-mode number field always accepts
 * digits only, and auto-formats them using the selected country's typical national
 * number layout (e.g. picking Ghana formats "241234567" as `(241)234-567`) — set
 * `mask` (same Alpine-style `9`/`a`/`*` syntax as `<loomi-input>`'s `mask`) to override it.
 *
 * @csspart field - The bordered container (`phone` mode only).
 * @csspart trigger - The clickable trigger / flag button.
 * @csspart panel - The dropdown panel.
 * @csspart input - The phone number `<input>` (`phone` mode only).
 * @fires loomi-select - `detail: { code, name, dialCode }` when a country is chosen.
 * @fires change - Fired when the selection or phone number changes (composed).
 * @fires input - Fired while typing the phone number (composed, `phone` mode only).
 */
@customElement("loomi-countries")
export class LoomiCountries extends LoomiElement {
  static override styles = [themeStyles, controlSizeStyles, fieldStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property() mode: LoomiCountriesMode = "names";
  @property() label = "";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property() locale = "";
  @property() selection = "";
  /** The phone-mode number portion, excluding the dial code. */
  @property() value = "";
  /** Phone-mode-only formatting mask, e.g. `"(999) 999-9999"` — same syntax as `<loomi-input>`'s `mask`. Overrides the selected country's auto-detected mask; leave blank to use that default. */
  @property() mask = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() size: LoomiCountriesSize = "medium";
  @property({ attribute: "empty-placeholder" }) emptyPlaceholder = DEFAULT_EMPTY_PLACEHOLDER;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private open = false;
  @state() private search = "";
  @state() private selectedCode = "";
  /** Index of the keyboard-highlighted option within `this.filtered`, while open. */
  @state() private activeIndex = -1;

  @query(".loomi-search") private searchEl?: HTMLInputElement;
  @query(".loomi-trigger") private triggerEl?: HTMLButtonElement;
  @query(".loomi-flag-trigger") private flagTriggerEl?: HTMLButtonElement;
  @query(".loomi-phone-input") private phoneInputEl?: HTMLInputElement;

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

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("selection")) {
      this.selectedCode = resolveCountry(this.selection)?.code ?? "";
    }
    if (this.mode === "phone" && (changed.has("value") || changed.has("mask") || changed.has("selection"))) {
      this.value = normalizePhoneValue(this.value, this.effectiveMask);
    }
    this.internals.setFormValue(this.formValue);
    this.syncValidity();
  }

  /** An explicit `mask` always wins; otherwise fall back to the selected country's own
   * typical national-number format (empty for the ~20 territories with no known one). */
  private get effectiveMask(): string {
    return this.mask || this.selectedRecord?.mask || "";
  }

  private get formValue(): string {
    if (this.mode === "phone") {
      const dial = this.selectedRecord?.dialCode ?? "";
      return this.value ? `${dial}${this.value}` : "";
    }
    return this.selectedCode;
  }

  private get selectedRecord(): LoomiCountryRecord | undefined {
    return this.selectedCode ? LOOMI_COUNTRIES.find((c) => c.code === this.selectedCode) : undefined;
  }

  private get filtered(): readonly LoomiCountryRecord[] {
    if (!this.search) return LOOMI_COUNTRIES;
    const q = this.search.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");
    return LOOMI_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q ||
        (qDigits.length > 0 && c.dialCode.replace("+", "").startsWith(qDigits)),
    );
  }

  /** Clear the current selection (and phone number, in `phone` mode). */
  reset(): void {
    this.selection = "";
    this.selectedCode = "";
    this.value = "";
    this.emitChange();
  }

  private toggleOpen(): void {
    if (this.disabled || this.readonly) return;
    if (this.open) {
      this.close(true);
      return;
    }
    this.open = true;
    const selectedIndex = this.filtered.findIndex((c) => c.code === this.selectedCode);
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

  private choose(rec: LoomiCountryRecord): void {
    this.selectedCode = rec.code;
    this.selection = rec.code;
    this.close();
    this.dispatchEvent(
      new CustomEvent("loomi-select", {
        bubbles: true,
        composed: true,
        detail: { code: rec.code, name: rec.name, dialCode: rec.dialCode },
      }),
    );
    this.emitChange();
    if (this.mode === "phone") this.updateComplete.then(() => this.phoneInputEl?.focus());
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
    const empty =
      this.required &&
      !this.disabled &&
      !this.readonly &&
      (this.mode === "phone" ? this.value.trim() === "" : this.selectedCode === "");
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const path = this.mode === "phone" ? "validation.requiredField" : "validation.selectOption";
    const message = empty ? loomiT(path, {}, this.locale) : "";
    const anchor = this.mode === "phone" ? this.phoneInputEl : this.triggerEl ?? this.flagTriggerEl;
    if (anchor) this.internals.setValidity(validity, message, anchor);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private onPhoneInput = (e: Event): void => {
    const el = e.target as HTMLInputElement;
    const clean = normalizePhoneValue(el.value, this.effectiveMask);
    if (clean !== el.value) el.value = clean;
    this.value = el.value;
    if (this.invalid) this.validate();
    this.internals.setFormValue(this.formValue);
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

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
    return html`
      <div class="loomi-panel" part="panel" role="listbox">
        <div class="loomi-searchbox">
          <input
            class="loomi-search"
            type="text"
            placeholder=${loomiT("countries.searchPlaceholder", {}, this.locale)}
            .value=${this.search}
            @input=${(e: Event) => {
              this.search = (e.target as HTMLInputElement).value;
              this.activeIndex = this.filtered.length ? 0 : -1;
            }}
          />
        </div>
        <div class="loomi-list">
          ${opts.length
            ? opts.map((c, i) => {
                const sel = c.code === this.selectedCode;
                return html`<div
                  id="loomi-country-${i}"
                  class="loomi-option ${sel ? "selected" : ""} ${i === this.activeIndex ? "active" : ""}"
                  role="option"
                  aria-selected=${sel ? "true" : "false"}
                  @mouseenter=${() => (this.activeIndex = i)}
                  @click=${() => this.choose(c)}
                >
                  <span class="loomi-flag">${unsafeSVG(flagMarkup(c.flag, `opt-${i}`))}</span>
                  <span class="loomi-option-name">${c.name}</span>
                  ${this.mode === "phone" ? html`<span class="loomi-option-dial">${c.dialCode}</span>` : nothing}
                  ${sel
                    ? html`<svg class="loomi-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${CHECK}</svg>`
                    : nothing}
                </div>`;
              })
            : html`<div class="loomi-empty">${loomiDefaultText(this.emptyPlaceholder, DEFAULT_EMPTY_PLACEHOLDER, "countries.emptyPlaceholder", this.locale)}</div>`}
        </div>
      </div>
    `;
  }

  /** Whether the floating `label` should sit in its "risen" position. Only relevant in
   * `names` mode — `phone` mode floats the label via pure CSS (`:focus-within` /
   * `:placeholder-shown`) since its field contains a real text input to key off. */
  private get floatLabel(): boolean {
    if (!this.label || this.mode === "phone") return false;
    return this.open || !!this.selectedCode;
  }

  private renderNamesMode(): TemplateResult {
    const hasLabel = !!this.label;
    const hasSelection = !!this.selectedCode;
    const reserveLabelSpace = hasLabel && !hasSelection && !this.open;
    const rec = this.selectedRecord;
    const displayText = hasSelection && rec
      ? rec.name
      : reserveLabelSpace
        ? `${this.label}${this.required ? " *" : ""}`
        : loomiDefaultText(this.placeholder, DEFAULT_PLACEHOLDER, "countries.placeholder", this.locale);

    const activeId =
      this.open && this.activeIndex >= 0 && this.filtered[this.activeIndex] ? `loomi-country-${this.activeIndex}` : nothing;

    return html`
      <button
        type="button"
        class="loomi-trigger"
        part="trigger"
        aria-haspopup="listbox"
        aria-expanded=${this.open ? "true" : "false"}
        aria-activedescendant=${activeId}
        ?disabled=${this.disabled}
        @click=${() => this.toggleOpen()}
        @blur=${this.showValidation}
      >
        ${hasSelection && rec ? html`<span class="loomi-flag">${unsafeSVG(flagMarkup(rec.flag, "trigger"))}</span>` : nothing}
        <span class="loomi-value ${hasSelection ? "" : "placeholder"} ${reserveLabelSpace ? "sizer" : ""}">${displayText}</span>
        <svg class="loomi-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${CHEVRON}</svg>
      </button>
      ${hasLabel
        ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
        : nothing}
    `;
  }

  private renderPhoneMode(): TemplateResult {
    const hasLabel = !!this.label;
    const rec = this.selectedRecord;
    const phoneLabel = this.label || loomiT("countries.phoneNumberLabel", {}, this.locale);

    return html`
      <div class="loomi-phone-field" part="field">
        <button
          type="button"
          class="loomi-flag-trigger"
          part="trigger"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? "true" : "false"}
          aria-label=${loomiT("countries.selectCountryCode", {}, this.locale)}
          ?disabled=${this.disabled}
          @click=${() => this.toggleOpen()}
          @blur=${this.showValidation}
        >
          <span class="loomi-flag">${unsafeSVG(flagMarkup(rec ? rec.flag : NO_FLAG, "trigger"))}</span>
          <svg class="loomi-chevron-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${CHEVRON}</svg>
        </button>
        ${rec ? html`<span class="loomi-dial-code">${rec.dialCode}</span>` : nothing}
        <input
          class="loomi-phone-input"
          part="input"
          type="tel"
          inputmode="numeric"
          .value=${this.value}
          placeholder=${hasLabel ? " " : this.placeholder || " "}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-label=${phoneLabel}
          aria-invalid=${this.invalid ? "true" : "false"}
          @input=${this.onPhoneInput}
          @change=${() => this.emitChange()}
          @blur=${this.showValidation}
        />
      </div>
      ${hasLabel
        ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
        : nothing}
    `;
  }

  override render(): TemplateResult {
    const classes = `loomi-countries size-${this.size} mode-${this.mode} ${this.open ? "open" : ""} ${this.floatLabel ? "float" : ""}`;
    return html`
      <div class=${classes} @keydown=${this.onKeydown}>
        ${this.mode === "phone" ? this.renderPhoneMode() : this.renderNamesMode()}
        ${this.renderPanel()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-countries": LoomiCountries;
  }
}
