import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiStyles, loomiT, randomSuffix } from "@loomidev/core";
import { showLoomiNotification } from "@loomidev/notification";
import { componentStyles } from "./generated/styles.css.js";
const DEFAULT_ERROR_MESSAGE = "Verification code is invalid";

const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`;

export type LoomiPinVariant = "default" | "minimal";

/**
 * `<loomi-pin>` — a verification-code (PIN) input of N boxes. Form-associated: submits
 * the joined PIN under `name`.
 *
 * @fires verify - `detail: { pin, code }` when the last box is filled.
 */
@customElement("loomi-pin")
export class LoomiPin extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();
  /** Falls back to a stable per-instance id when `name` is blank, so a `loomi-notification` toast (see `showError`) re-renders in place across repeated validation failures instead of stacking. */
  private readonly instanceId = randomSuffix();

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property({ type: Number, attribute: "total-digits" }) totalDigits = 4;
  @property() size: "small" | "big" = "small";
  @property() variant: LoomiPinVariant = "default";
  @property({ type: Boolean, reflect: true }) separator = false;
  @property({ type: Boolean, attribute: "hide-digits" }) hideDigits = false;
  @property({ type: Boolean }) mask = false;
  @property({ attribute: "error-message" }) errorMessage = DEFAULT_ERROR_MESSAGE;
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property() locale = "";
  @property({ type: Boolean, reflect: true }) invalid = false;
  /** Show a spinner in place of the (empty) status slot while an async check is in flight. */
  @property({ type: Boolean, reflect: true }) validating = false;
  /** Show a green checkmark once an async check has passed. */
  @property({ type: Boolean, reflect: true }) valid = false;

  @state() private digits: string[] = [];
  @queryAll("input") private boxes!: NodeListOf<HTMLInputElement>;

  override connectedCallback(): void {
    super.connectedCallback();
    this.digits = Array(this.totalDigits).fill("");
  }

  /** The current PIN. */
  get pin(): string {
    return this.digits.join("");
  }

  /** @deprecated Use `pin` instead. */
  get code(): string {
    return this.pin;
  }

  /** Clear all boxes and focus the first. */
  clear(): void {
    this.digits = Array(this.totalDigits).fill("");
    this.internals.setFormValue("");
    this.resetValidationState();
    this.updateComplete.then(() => this.boxes[0]?.focus());
  }

  /** Show a spinner in the status slot while an async validation call is in flight. */
  startValidating(): void {
    this.invalid = false;
    this.valid = false;
    this.validating = true;
  }

  /** Show a green checkmark in the status slot once an async validation call passed. */
  showSuccess(): void {
    this.invalid = false;
    this.validating = false;
    this.valid = true;
  }

  /**
   * Show the error state: every box border turns red (regardless of `error-message`) and,
   * on the valid→invalid transition, `error-message` (or `message`, if passed) surfaces —
   * inline below the boxes when `show-error-inline` is set, otherwise as a
   * `loomi-notification` toast. Pass `message` to override `error-message` for this call.
   */
  showError(message?: string): void {
    if (message !== undefined) this.errorMessage = message;
    const wasInvalid = this.invalid;
    this.validating = false;
    this.valid = false;
    this.invalid = true;
    if (!wasInvalid && !this.showErrorInline && this.errorMessage) {
      showLoomiNotification(this.label, this.resolvedErrorMessage(), "error", undefined, `loomi-pin-validation-${this.name || this.instanceId}`);
    }
  }

  private resetValidationState(): void {
    this.invalid = false;
    this.valid = false;
    this.validating = false;
  }

  private resolvedErrorMessage(): string {
    return loomiDefaultText(this.errorMessage, DEFAULT_ERROR_MESSAGE, "pin.errorMessage", this.locale);
  }

  private commit(): void {
    this.internals.setFormValue(this.pin);
    if (this.pin.length === this.totalDigits) {
      this.dispatchEvent(new CustomEvent("verify", { bubbles: true, composed: true, detail: { pin: this.pin, code: this.pin } }));
    }
  }

  private get masked(): boolean {
    return this.mask || this.hideDigits;
  }

  private get separatorIndex(): number {
    return Math.floor(this.totalDigits / 2);
  }

  private renderBox(i: number): TemplateResult {
    const value = this.digits[i] ?? "";
    return html`<span class="loomi-box-wrap">
      <input
        class="loomi-box variant-${this.variant} ${this.masked && value ? "is-masked" : ""}"
        type="text"
        inputmode="numeric"
        maxlength="1"
        aria-label=${loomiT("pin.digitLabel", { number: i + 1 }, this.locale)}
        aria-invalid=${this.invalid ? "true" : "false"}
        ?disabled=${this.validating}
        .value=${value}
        @input=${(e: Event) => this.onInput(i, e)}
        @keydown=${(e: KeyboardEvent) => this.onKeydown(i, e)}
      />
      ${this.masked && value ? html`<span class="loomi-dot" aria-hidden="true"></span>` : nothing}
    </span>`;
  }

  private onInput(i: number, e: Event): void {
    const input = e.target as HTMLInputElement;
    const ch = input.value.replace(/\D/g, "").slice(-1);
    const next = [...this.digits];
    next[i] = ch;
    this.digits = next;
    if (this.invalid || this.valid || this.validating) this.resetValidationState();
    if (ch && i < this.totalDigits - 1) this.boxes[i + 1]?.focus();
    this.commit();
  }

  private onKeydown(i: number, e: KeyboardEvent): void {
    if (e.key === "Backspace" && !this.digits[i] && i > 0) this.boxes[i - 1]?.focus();
  }

  private onPaste(e: ClipboardEvent): void {
    e.preventDefault();
    const text = (e.clipboardData?.getData("text") ?? "").replace(/\D/g, "").slice(0, this.totalDigits);
    if (!text) return;
    const next = Array(this.totalDigits).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    this.digits = next;
    this.commit();
    this.updateComplete.then(() => this.boxes[Math.min(text.length, this.totalDigits - 1)]?.focus());
  }

  private renderStatus(): TemplateResult | typeof nothing {
    if (this.validating) {
      return html`<span class="loomi-status is-validating" role="status" aria-label=${loomiT("pin.validating", {}, this.locale)}>
        <svg class="loomi-status-icon loomi-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25"></circle>
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
        </svg>
      </span>`;
    }
    if (this.valid) {
      return html`<span class="loomi-status is-valid" role="status" aria-label=${loomiT("pin.valid", {}, this.locale)}>
        <svg class="loomi-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${CHECK}</svg>
      </span>`;
    }
    return nothing;
  }

  override render(): TemplateResult {
    const showError = this.invalid && this.showErrorInline && this.errorMessage;
    return html`<div class="loomi-pin size-${this.size}" @paste=${(e: ClipboardEvent) => this.onPaste(e)}>
      ${Array.from({ length: this.totalDigits }, (_, i) => html`
        ${this.renderBox(i)}
        ${this.separator && this.totalDigits > 1 && i === this.separatorIndex - 1 ? html`<span class="loomi-separator" aria-hidden="true">-</span>` : nothing}
      `)}
      ${this.renderStatus()}
    </div>
    ${showError ? html`<p class="loomi-error">${this.resolvedErrorMessage()}</p>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-pin": LoomiPin;
  }
}
