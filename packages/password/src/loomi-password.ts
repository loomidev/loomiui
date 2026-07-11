import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, controlSizeStyles, fieldStyles, loomiT, onClickOutside, randomSuffix, themeStyles } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPasswordSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiPasswordVariant = "default" | "minimal";
export type LoomiPasswordStrengthToken = "A" | "a" | "1" | "#";

type StrengthRequirement = {
  token: LoomiPasswordStrengthToken;
  label: string;
  met: boolean;
};

const STRENGTH_ORDER: LoomiPasswordStrengthToken[] = ["A", "a", "1", "#"];

/**
 * `<loomi-password>` — a form-associated password input with reveal, prefixes,
 * inline validation and neutral strength requirements.
 *
 * @slot prefix - Custom prefix content (overrides the `prefix`/`prefix-icon` attributes).
 * @csspart field - The bordered field container.
 * @csspart input - The native `<input>`.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 */
@customElement("loomi-password")
export class LoomiPassword extends LoomiElement {
  static override styles = [themeStyles, controlSizeStyles, fieldStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private readonly instanceId = randomSuffix();

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() locale = "";
  @property() placeholder = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property() size: LoomiPasswordSize = "medium";
  @property() variant: LoomiPasswordVariant = "default";
  @property() prefix = "";
  @property({ attribute: "prefix-options" }) prefixOptions = "";
  @property({ attribute: "prefix-value" }) prefixValue = "";
  @property({ attribute: "prefix-icon" }) prefixIcon = "";
  @property({ type: Boolean, attribute: "transparent-prefix" }) transparentPrefix = true;
  @property({ type: Boolean }) viewable = true;
  @property({ type: Boolean }) clearable = false;
  @property() strength = "";
  @property({ attribute: "strength-color" }) strengthColor = "";
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, attribute: "show-placeholder-always" }) showPlaceholderAlways = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private revealed = false;
  @state() private prefixOpen = false;

  @query("input") private inputEl!: HTMLInputElement;

  private cleanupClickOutside?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanupClickOutside = onClickOutside(this, () => {
      if (this.prefixOpen) this.prefixOpen = false;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupClickOutside?.();
  }

  override willUpdate(_changed: PropertyValues<this>): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
  }

  override focus(): void {
    this.inputEl?.focus();
  }

  clear(): void {
    this.value = "";
    this.internals.setFormValue("");
    this.emit("input");
    this.emit("change");
    this.focus();
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
    const empty = this.required && !this.disabled && !this.readonly && this.value.trim() === "";
    const weak = !empty && !this.disabled && !this.readonly && this.strengthRequirements().some((requirement) => !requirement.met);
    const wasInvalid = this.invalid;
    this.invalid = (empty || weak) && showInvalid;
    const validity = empty ? { valueMissing: true } : weak ? { customError: true } : {};
    const message = empty
      ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale)
      : weak
        ? this.errorMessage || "Password does not meet the strength requirements."
        : "";
    if (this.inputEl) this.internals.setValidity(validity, message, this.inputEl);
    else this.internals.setValidity(validity, message);

    if (this.invalid && !wasInvalid && !this.showErrorInline && message) {
      // Lazy import — see @loomidev/input's syncValidity for the rationale.
      void import("@loomidev/notification").then(({ showLoomiNotification }) =>
        showLoomiNotification(this.label, message, "error", undefined, `loomi-password-validation-${this.name || this.instanceId}`));
    }

    return !empty && !weak;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private emit(type: "input" | "change"): void {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  private onInput = (e: Event): void => {
    this.value = (e.target as HTMLInputElement).value;
    if (this.invalid) this.validate();
    this.emit("input");
  };

  private onChange = (): void => {
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
        if (Array.isArray(parsed)) return parsed.map((option) => String(option).trim()).filter(Boolean);
      } catch {
        // Fall through to simple delimited parsing.
      }
    }

    return trimmed
      .split(/[|,]/)
      .map((option) => option.trim())
      .filter(Boolean);
  }

  private selectedPrefix(options: string[]): string {
    return this.prefixValue || this.prefix || options[0] || "";
  }

  private togglePrefixOpen(): void {
    if (this.disabled || this.readonly) return;
    this.prefixOpen = !this.prefixOpen;
  }

  private choosePrefix(value: string): void {
    this.prefixValue = value;
    this.prefix = value;
    this.prefixOpen = false;
    this.dispatchEvent(new CustomEvent("loomi-prefix-change", { detail: { value }, bubbles: true, composed: true }));
  }

  private onPrefixTriggerKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") this.prefixOpen = false;
  };

  private renderPrefixDropdown(options: string[]): TemplateResult {
    const value = this.selectedPrefix(options);
    return html`<span class="loomi-affix-dropdown ${this.prefixOpen ? "open" : ""}">
      <button
        type="button"
        class="loomi-affix-trigger"
        aria-haspopup="listbox"
        aria-expanded=${this.prefixOpen ? "true" : "false"}
        aria-label="prefix"
        ?disabled=${this.disabled || this.readonly}
        @click=${() => this.togglePrefixOpen()}
        @keydown=${this.onPrefixTriggerKeydown}
      >
        <span class="loomi-affix-value">${value}</span>
        ${this.renderIcon("chevron-down", "loomi-affix-chevron")}
      </button>
      ${this.prefixOpen
        ? html`<div class="loomi-affix-panel" role="listbox">
            ${options.map(
              (option) => html`<div
                class="loomi-affix-option ${option === value ? "selected" : ""}"
                role="option"
                aria-selected=${option === value ? "true" : "false"}
                @click=${() => this.choosePrefix(option)}
              >
                <span>${option}</span>
                ${option === value ? this.renderIcon("check", "loomi-affix-check") : nothing}
              </div>`,
            )}
          </div>`
        : nothing}
    </span>`;
  }

  private renderPrefix(): TemplateResult | typeof nothing {
    const options = this.parseOptions(this.prefixOptions);
    const hasPrefix = this.prefix || this.prefixIcon || options.length > 0;
    if (!hasPrefix) return nothing;
    const cls = `loomi-prefix${this.transparentPrefix ? "" : " loomi-affix-solid"}`;
    return html`<span class=${cls}>
      <slot name="prefix">${options.length > 0 ? this.renderPrefixDropdown(options) : this.prefixIcon ? this.renderIcon(this.prefixIcon) : this.prefix}</slot>
    </span>`;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    const showClear = this.clearable && this.value !== "" && !this.disabled && !this.readonly;
    const showReveal = this.viewable;
    if (!showClear && !showReveal) return nothing;

    return html`<span class="loomi-suffix">
      ${showClear
        ? html`<button type="button" class="loomi-iconbtn" aria-label=${loomiT("common.clear", {}, this.locale)} @click=${this.clear}>${this.renderIcon("x-circle")}</button>`
        : nothing}
      ${showReveal
        ? html`<button type="button" class="loomi-iconbtn" aria-label=${loomiT("input.togglePassword", {}, this.locale)} @click=${() => (this.revealed = !this.revealed)}>${this.renderIcon(this.revealed ? "eye-slash" : "eye")}</button>`
        : nothing}
    </span>`;
  }

  private strengthRequirements(): StrengthRequirement[] {
    const tokens = STRENGTH_ORDER.filter((token) => this.strength.includes(token));
    return tokens.map((token) => {
      if (token === "A") return { token, label: "One uppercase letter", met: /[A-Z]/.test(this.value) };
      if (token === "a") return { token, label: "One lowercase letter", met: /[a-z]/.test(this.value) };
      if (token === "1") return { token, label: "One number", met: /[0-9]/.test(this.value) };
      return { token, label: "One special character", met: /[^A-Za-z0-9]/.test(this.value) };
    });
  }

  private renderStrength(): TemplateResult | typeof nothing {
    const requirements = this.strengthRequirements();
    if (requirements.length === 0) return nothing;

    const style = this.strengthColor ? `--loomi-password-strength-color:${this.strengthColor}` : "";
    return html`<ul class="loomi-strength" aria-label="Password requirements" style=${style}>
      ${requirements.map(
        (requirement) => html`<li class="loomi-strength-item ${requirement.met ? "met" : ""}">
          <span class="loomi-strength-check">${this.renderIcon("check-circle")}</span>
          <span>${requirement.label}</span>
        </li>`,
      )}
    </ul>`;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const forceFloat = hasLabel && this.showPlaceholderAlways;
    const placeholderAttr = hasLabel && !this.showPlaceholderAlways ? " " : this.placeholder || " ";
    const showError = this.invalid && this.showErrorInline && this.errorMessage;

    return html`
      <div class="loomi-field size-${this.size} variant-${this.variant} ${forceFloat ? "force-float" : ""}" part="field">
        ${this.renderPrefix()}
        <span class="loomi-inputwrap">
          <input
            class="loomi-input"
            part="input"
            .value=${this.value}
            type=${this.revealed ? "text" : "password"}
            name=${this.name || nothing}
            placeholder=${placeholderAttr}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            aria-label=${hasLabel ? this.label : nothing}
            aria-invalid=${this.invalid ? "true" : "false"}
            @input=${this.onInput}
            @change=${this.onChange}
            @blur=${this.showValidation}
          />
          ${hasLabel ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>` : nothing}
        </span>
        ${this.renderSuffix()}
      </div>
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
      ${this.renderStrength()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-password": LoomiPassword;
  }
}
