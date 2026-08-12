import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  LoomiElement,
  controlSizeStyles,
  fieldStyles,
  loomiT,
  randomSuffix,
  themeStyles,
  type LoomiFieldLabelPosition,
} from "@loomidev/core";
import "@loomidev/popover";
import { getLoomiIcon } from "./icons.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiInputType = "text" | "email" | "password" | "search" | "tel" | "url";
export type LoomiInputSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiInputVariant = "default" | "minimal";
export type LoomiInputDynamicMask = "" | "creditcard" | "credit-card" | ((input: string) => string);

const MASK_TOKEN_TESTS: Record<string, (char: string) => boolean> = {
  "9": (char) => /[0-9]/.test(char),
  a: (char) => /[A-Za-z]/.test(char),
  "*": () => true,
};

const CREDIT_CARD_MASK = "9999 9999 9999 9999";
const AMEX_CARD_MASK = "9999 999999 99999";
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-input>` — a themeable text input with a floating label, text/icon
 * prefixes & suffixes, contextual hints, clearable field, numeric filtering and
 * inline validation. Form-associated: its value submits with the surrounding form.
 *
 * @slot prefix - Custom prefix content (overrides the `prefix`/`prefix-icon` attributes).
 * @slot suffix - Custom suffix content.
 * @csspart field - The bordered field container.
 * @csspart input - The native `<input>`.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 */
@customElement("loomi-input")
export class LoomiInput extends LoomiElement {
  static override styles = [themeStyles, controlSizeStyles, fieldStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private initialValue = "";
  /** Falls back to a stable per-instance id when `name` is blank, so a `loomi-notification` toast (see `syncValidity`) re-renders in place across repeated validation failures instead of stacking. */
  private readonly instanceId = randomSuffix();

  @property({ reflect: true }) name = "";
  @property() type: LoomiInputType = "text";
  @property() label = "";
  @property({ attribute: "label-position", reflect: true })
  labelPosition: LoomiFieldLabelPosition = "default";
  @property() locale = "";
  @property() placeholder = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean }) numeric = false;
  @property({ type: Boolean, attribute: "with-dots" }) withDots = true;
  @property() mask = "";
  @property({ attribute: "dynamic-mask" }) dynamicMask: LoomiInputDynamicMask = "";
  @property() min = "";
  @property() max = "";
  @property() size: LoomiInputSize = "medium";
  @property() variant: LoomiInputVariant = "default";
  @property() prefix = "";
  @property() suffix = "";
  @property({ attribute: "prefix-options" }) prefixOptions = "";
  @property({ attribute: "suffix-options" }) suffixOptions = "";
  @property({ attribute: "prefix-value" }) prefixValue = "";
  @property({ attribute: "suffix-value" }) suffixValue = "";
  @property({ attribute: "prefix-icon" }) prefixIcon = "";
  @property({ attribute: "suffix-icon" }) suffixIcon = "";
  @property({ type: Boolean, attribute: "transparent-prefix" }) transparentPrefix = true;
  @property({ type: Boolean, attribute: "transparent-suffix" }) transparentSuffix = true;
  @property({ type: Boolean }) viewable = false;
  @property({ type: Boolean }) clearable = false;
  @property() hint = "";
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, attribute: "show-placeholder-always" }) showPlaceholderAlways = false;
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute })
  showFocusRing = true;

  @property({ type: Boolean, reflect: true }) invalid = false;

  @query("input") private inputEl!: HTMLInputElement;

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialValue = this.value;
    super.connectedCallback();
  }

  formResetCallback(): void {
    this.value = this.initialValue;
    this.validationVisible = false;
    this.invalid = false;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (
      changed.has("value") ||
      changed.has("numeric") ||
      changed.has("withDots") ||
      changed.has("mask") ||
      changed.has("dynamicMask")
    ) {
      this.value = this.normalizeValue(this.value);
    }

    this.internals.setFormValue(this.value);
    this.syncValidity();
  }

  /** Focus the underlying input. */
  override focus(): void {
    this.inputEl?.focus();
  }

  /** Clear the field. */
  clear(): void {
    this.value = "";
    this.internals.setFormValue("");
    this.emit("input");
    this.emit("change");
    this.focus();
  }

  /**
   * Run the required-field check right now, independent of blur. Sets the reflected
   * `invalid` attribute to match — which drives the red field border in CSS regardless of
   * whether `error-message` is set — and, when it just became invalid, surfaces
   * `error-message` (if any): inline below the field when `show-error-inline` is set,
   * otherwise as a `loomi-notification` toast. Returns `true` when the field passes (or
   * isn't `required`), `false` otherwise. Call this yourself before a manual submit or API
   * call; a `blur` on the field already triggers the same check automatically.
   */
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
    const empty = this.required && !this.disabled && !this.readonly && this.value.trim() === "";
    const wasInvalid = this.invalid;
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty
      ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale)
      : "";
    if (this.inputEl) this.internals.setValidity(validity, message, this.inputEl);
    else this.internals.setValidity(validity, message);

    // Inline display (`.loomi-error`, in render()) only covers `show-error-inline`. When
    // it's off, surface the same message as a toast instead of silently dropping it — only
    // on the valid→invalid transition, so re-validating while already invalid (e.g. typing
    // into an empty required field) doesn't spam a new toast on every keystroke.
    if (this.invalid && !wasInvalid && !this.showErrorInline && this.errorMessage) {
      // Lazy import: apps that render errors inline (or never fail validation) don't load the toast system.
      void import("@loomidev/notification").then(({ showLoomiNotification }) =>
        showLoomiNotification(
          this.label,
          this.errorMessage,
          "error",
          undefined,
          `loomi-input-validation-${this.name || this.instanceId}`,
        ),
      );
    }
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private emit(type: "input" | "change"): void {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  private sanitizeNumeric(raw: string): string {
    if (!this.numeric) return raw;
    let v = raw.replace(this.withDots ? /[^0-9.]/g : /[^0-9]/g, "");
    if (this.withDots) {
      const i = v.indexOf(".");
      if (i !== -1) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, "");
    }
    return v;
  }

  private normalizeValue(raw: string): string {
    const clean = this.sanitizeNumeric(raw);
    const mask = this.resolveMask(clean);
    return mask ? this.applyMask(clean, mask) : clean;
  }

  private resolveMask(input: string): string {
    if (typeof this.dynamicMask === "function") return this.dynamicMask(input);

    if (this.isCreditCardMask(this.dynamicMask) || this.isCreditCardMask(this.mask)) {
      const digits = input.replace(/\D/g, "");
      return digits.startsWith("34") || digits.startsWith("37") ? AMEX_CARD_MASK : CREDIT_CARD_MASK;
    }

    return this.mask;
  }

  private isCreditCardMask(mask: LoomiInputDynamicMask | string): boolean {
    return typeof mask === "string" && (mask === "creditcard" || mask === "credit-card");
  }

  private applyMask(raw: string, mask: string): string {
    let result = "";
    let rawIndex = 0;

    for (const maskChar of mask) {
      const tokenTest = MASK_TOKEN_TESTS[maskChar];

      if (!tokenTest) {
        if (raw[rawIndex] === maskChar) rawIndex += 1;
        if (this.hasRemainingTokenInput(raw, rawIndex, mask)) result += maskChar;
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

  private hasRemainingTokenInput(raw: string, startIndex: number, mask: string): boolean {
    const tokenTests = Array.from(
      new Set(
        mask
          .split("")
          .map((char) => MASK_TOKEN_TESTS[char])
          .filter(Boolean),
      ),
    );
    return raw
      .slice(startIndex)
      .split("")
      .some((char) => tokenTests.some((tokenTest) => tokenTest(char)));
  }

  private onInput = (e: Event): void => {
    const el = e.target as HTMLInputElement;
    const clean = this.normalizeValue(el.value);
    if (clean !== el.value) el.value = clean;
    this.value = el.value;
    if (this.invalid) this.validate();
    this.emit("input");
  };

  private onChange = (): void => {
    if (this.numeric && this.value !== "") {
      let n = parseFloat(this.value);
      if (!Number.isNaN(n)) {
        if (this.min !== "" && n < parseFloat(this.min)) n = parseFloat(this.min);
        if (this.max !== "" && n > parseFloat(this.max)) n = parseFloat(this.max);
        this.value = String(n);
      }
    }
    this.emit("change");
  };

  private renderIcon(name: string, cls = "loomi-icon"): TemplateResult | typeof nothing {
    const path = getLoomiIcon(name);
    if (!path) return nothing;
    return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${path}</svg>`;
  }

  private parseOptions(options: string): string[] {
    const trimmed = options.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed))
          return parsed.map((option) => String(option).trim()).filter(Boolean);
      } catch {
        // Fall through to simple delimited parsing.
      }
    }

    return trimmed
      .split(/[|,]/)
      .map((option) => option.trim())
      .filter(Boolean);
  }

  private selectedAffix(kind: "prefix" | "suffix", options: string[]): string {
    const explicit = kind === "prefix" ? this.prefixValue : this.suffixValue;
    const text = kind === "prefix" ? this.prefix : this.suffix;
    return explicit || text || options[0] || "";
  }

  private onAffixChange(kind: "prefix" | "suffix", e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    if (kind === "prefix") {
      this.prefixValue = value;
      this.prefix = value;
    } else {
      this.suffixValue = value;
      this.suffix = value;
    }

    this.dispatchEvent(
      new CustomEvent(`loomi-${kind}-change`, {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderAffixSelect(kind: "prefix" | "suffix", options: string[]): TemplateResult {
    const value = this.selectedAffix(kind, options);
    return html`<select class="loomi-affix-select" .value=${value} aria-label=${kind} @change=${(e: Event) => this.onAffixChange(kind, e)}>
      ${options.map((option) => html`<option value=${option} ?selected=${option === value}>${option}</option>`)}
    </select>`;
  }

  private hintKey(): string {
    const value = this.hint.trim();
    return value.endsWith(".html") ? value.slice(0, -5) : value.replace(/^#/, "");
  }

  private escapeSelector(value: string): string {
    return globalThis.CSS?.escape ? globalThis.CSS.escape(value) : value.replace(/["\\]/g, "\\$&");
  }

  private hintSourceHtml(): string | undefined {
    const key = this.hintKey();
    if (!key) return undefined;
    const source = document.querySelector<HTMLElement>(`[data-hint="${this.escapeSelector(key)}"]`);
    return source?.innerHTML;
  }

  private renderHint(): TemplateResult | typeof nothing {
    if (!this.hint.trim()) return nothing;
    const helpIcon = this.renderIcon("help-circle");
    const sourceHtml = this.hintSourceHtml();

    return html`<loomi-popover class="loomi-hint-popover" placement="top" .width=${280}>
      <button type="button" slot="trigger" class="loomi-iconbtn" aria-label="Show hint">
        ${helpIcon === nothing ? this.renderIcon("information-circle") : helpIcon}
      </button>
      <span class="loomi-hint-content">${sourceHtml === undefined ? this.hint : unsafeHTML(sourceHtml)}</span>
    </loomi-popover>`;
  }

  private renderPrefix(): TemplateResult | typeof nothing {
    const options = this.parseOptions(this.prefixOptions);
    const hasPrefix = this.prefix || this.prefixIcon || options.length > 0;
    if (!hasPrefix) return nothing;
    const cls = `loomi-prefix${this.transparentPrefix ? "" : " loomi-affix-solid"}`;
    return html`<span class=${cls}>
      <slot name="prefix">${options.length > 0 ? this.renderAffixSelect("prefix", options) : this.prefixIcon ? this.renderIcon(this.prefixIcon) : this.prefix}</slot>
    </span>`;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    const options = this.parseOptions(this.suffixOptions);
    const showClear = this.clearable && this.value !== "" && !this.disabled && !this.readonly;
    const hasSuffix =
      this.suffix || this.suffixIcon || options.length > 0 || showClear || this.hint;
    if (!hasSuffix) return nothing;
    const cls = `loomi-suffix${this.transparentSuffix ? "" : " loomi-affix-solid"}`;
    return html`<span class=${cls}>
      ${
        showClear
          ? html`<button type="button" class="loomi-iconbtn" aria-label=${loomiT("common.clear", {}, this.locale)} @click=${this.clear}>${this.renderIcon("x-circle")}</button>`
          : nothing
      }
      <slot name="suffix">${options.length > 0 ? this.renderAffixSelect("suffix", options) : this.suffixIcon ? this.renderIcon(this.suffixIcon) : this.suffix}</slot>
      ${this.renderHint()}
    </span>`;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const forceFloat = hasLabel && this.showPlaceholderAlways;
    const placeholderAttr = hasLabel && !this.showPlaceholderAlways ? " " : this.placeholder || " ";
    const showError = this.invalid && this.showErrorInline && this.errorMessage;

    return html`
      <div class="loomi-field size-${this.size} variant-${this.variant} ${forceFloat ? "force-float" : ""} ${this.showFocusRing ? "" : "no-focus-ring"}" part="field">
        ${this.renderPrefix()}
        <span class="loomi-inputwrap">
          <input
            class="loomi-input"
            part="input"
            .value=${this.value}
            type=${this.type}
            name=${this.name || nothing}
            placeholder=${placeholderAttr}
            inputmode=${this.numeric ? "decimal" : nothing}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
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
        ${this.renderSuffix()}
      </div>
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-input": LoomiInput;
  }

  interface HTMLElementEventMap {
    // `loomi-prefix-change` is also dispatched by <loomi-password> — the inline
    // literal detail type must stay identical there for the two global
    // augmentations to merge.
    "loomi-prefix-change": CustomEvent<{ value: string }>;
    "loomi-suffix-change": CustomEvent<{ value: string }>;
  }
}
