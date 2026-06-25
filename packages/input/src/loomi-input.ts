import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { themeStyles } from "@loomi/theme";
import { getLoomiIcon } from "./icons.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiInputType = "text" | "email" | "password" | "search" | "tel" | "url";
export type LoomiInputSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiInputDynamicMask =
  | ""
  | "creditcard"
  | "credit-card"
  | ((input: string) => string);

const MASK_TOKEN_TESTS: Record<string, (char: string) => boolean> = {
  "9": (char) => /[0-9]/.test(char),
  a: (char) => /[A-Za-z]/.test(char),
  "*": () => true,
};

const CREDIT_CARD_MASK = "9999 9999 9999 9999";
const AMEX_CARD_MASK = "9999 999999 99999";

/**
 * `<loomi-input>` — a themeable text input with a floating label, text/icon
 * prefixes & suffixes, password reveal, clearable field, numeric filtering and
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
export class LoomiInput extends LitElement {
  static override styles = [themeStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property() type: LoomiInputType = "text";
  @property() label = "";
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
  @property() prefix = "";
  @property() suffix = "";
  @property({ attribute: "prefix-icon" }) prefixIcon = "";
  @property({ attribute: "suffix-icon" }) suffixIcon = "";
  @property({ type: Boolean, attribute: "transparent-prefix" }) transparentPrefix = true;
  @property({ type: Boolean, attribute: "transparent-suffix" }) transparentSuffix = true;
  @property({ type: Boolean }) viewable = false;
  @property({ type: Boolean }) clearable = false;
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, attribute: "show-placeholder-always" }) showPlaceholderAlways = false;

  @property({ type: Boolean, reflect: true }) invalid = false;
  @state() private revealed = false;

  @query("input") private inputEl!: HTMLInputElement;

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

  /** Validate required state; toggles `invalid`. Returns true when valid. */
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
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? this.errorMessage || "Please fill out this field." : "";
    if (this.inputEl) this.internals.setValidity(validity, message, this.inputEl);
    else this.internals.setValidity(validity, message);
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
    const tokenTests = Array.from(new Set(mask.split("").map((char) => MASK_TOKEN_TESTS[char]).filter(Boolean)));
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

  private renderPrefix(): TemplateResult | typeof nothing {
    const hasPrefix = this.prefix || this.prefixIcon;
    if (!hasPrefix) return nothing;
    const cls = `loomi-prefix${this.transparentPrefix ? "" : " loomi-affix-solid"}`;
    return html`<span class=${cls}>
      <slot name="prefix">${this.prefixIcon ? this.renderIcon(this.prefixIcon) : this.prefix}</slot>
    </span>`;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    const isPassword = this.type === "password";
    const showReveal = isPassword && this.viewable;
    const showClear = this.clearable && this.value !== "" && !this.disabled && !this.readonly;
    const hasSuffix = this.suffix || this.suffixIcon || showReveal || showClear;
    if (!hasSuffix) return nothing;
    const cls = `loomi-suffix${this.transparentSuffix ? "" : " loomi-affix-solid"}`;
    return html`<span class=${cls}>
      ${showClear
        ? html`<button type="button" class="loomi-iconbtn" aria-label="Clear" @click=${this.clear}>${this.renderIcon("x-circle")}</button>`
        : nothing}
      ${showReveal
        ? html`<button type="button" class="loomi-iconbtn" aria-label="Toggle password visibility" @click=${() => (this.revealed = !this.revealed)}>${this.renderIcon(this.revealed ? "eye-slash" : "eye")}</button>`
        : nothing}
      <slot name="suffix">${this.suffixIcon ? this.renderIcon(this.suffixIcon) : this.suffix}</slot>
    </span>`;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const forceFloat = hasLabel && this.showPlaceholderAlways;
    const placeholderAttr =
      hasLabel && !this.showPlaceholderAlways ? " " : this.placeholder || " ";
    const effType = this.type === "password" && this.revealed ? "text" : this.type;
    const showError = this.invalid && this.showErrorInline && this.errorMessage;

    return html`
      <div class="loomi-field size-${this.size} ${forceFloat ? "force-float" : ""}" part="field">
        ${this.renderPrefix()}
        <span class="loomi-inputwrap">
          <input
            class="loomi-input"
            part="input"
            .value=${this.value}
            type=${effType}
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
          ${hasLabel
            ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
            : nothing}
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
}
