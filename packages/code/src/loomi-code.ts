import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";
import { loomiDefaultText, loomiStyles, loomiT } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";
const DEFAULT_ERROR_MESSAGE = "Verification code is invalid";

/**
 * `<loomi-code>` — a verification-code (PIN) input of N boxes. Form-associated: submits
 * the joined code under `name`.
 *
 * @fires verify - `detail: { code }` when the last box is filled.
 */
@customElement("loomi-code")
export class LoomiCode extends LitElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property({ type: Number, attribute: "total-digits" }) totalDigits = 4;
  @property() size: "small" | "big" = "small";
  @property({ type: Boolean }) mask = false;
  @property({ attribute: "error-message" }) errorMessage = DEFAULT_ERROR_MESSAGE;
  @property() locale = "";
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private digits: string[] = [];
  @queryAll("input") private boxes!: NodeListOf<HTMLInputElement>;

  override connectedCallback(): void {
    super.connectedCallback();
    this.digits = Array(this.totalDigits).fill("");
  }

  /** The current code. */
  get code(): string {
    return this.digits.join("");
  }

  /** Clear all boxes and focus the first. */
  clear(): void {
    this.digits = Array(this.totalDigits).fill("");
    this.internals.setFormValue("");
    this.invalid = false;
    this.updateComplete.then(() => this.boxes[0]?.focus());
  }

  /** Show the error state. */
  showError(): void {
    this.invalid = true;
  }

  private commit(): void {
    this.internals.setFormValue(this.code);
    if (this.code.length === this.totalDigits) {
      this.dispatchEvent(new CustomEvent("verify", { bubbles: true, composed: true, detail: { code: this.code } }));
    }
  }

  private onInput(i: number, e: Event): void {
    const input = e.target as HTMLInputElement;
    const ch = input.value.replace(/\D/g, "").slice(-1);
    const next = [...this.digits];
    next[i] = ch;
    this.digits = next;
    if (this.invalid) this.invalid = false;
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

  override render(): TemplateResult {
    return html`<div class="loomi-code size-${this.size}" @paste=${(e: ClipboardEvent) => this.onPaste(e)}>
      ${Array.from({ length: this.totalDigits }, (_, i) => html`<input
        class="loomi-box"
        type=${this.mask ? "password" : "text"}
        inputmode="numeric"
        maxlength="1"
        aria-label=${loomiT("code.digitLabel", { number: i + 1 }, this.locale)}
        .value=${this.digits[i] ?? ""}
        @input=${(e: Event) => this.onInput(i, e)}
        @keydown=${(e: KeyboardEvent) => this.onKeydown(i, e)}
      />`)}
    </div>
    ${this.invalid ? html`<p class="loomi-error">${loomiDefaultText(this.errorMessage, DEFAULT_ERROR_MESSAGE, "code.errorMessage", this.locale)}</p>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-code": LoomiCode;
  }
}
