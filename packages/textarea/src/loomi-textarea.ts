import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { themeStyles } from "@loomi/theme";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-textarea>` — a themeable multi-line text input with a floating label
 * and inline validation. Form-associated: its value submits with the form.
 *
 * @csspart field - The bordered container.
 * @csspart textarea - The native `<textarea>`.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 */
@customElement("loomi-textarea")
export class LoomiTextarea extends LitElement {
  static override styles = [themeStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();

  @property() name = "";
  @property() label = "";
  @property() placeholder = "";
  @property() value = "";
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @query("textarea") private textareaEl!: HTMLTextAreaElement;

  override willUpdate(): void {
    this.internals.setFormValue(this.value);
  }

  override focus(): void {
    this.textareaEl?.focus();
  }

  validate(): boolean {
    const empty = this.required && this.value.trim() === "";
    this.invalid = empty;
    return !empty;
  }

  private emit(type: "input" | "change"): void {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  private onInput = (e: Event): void => {
    this.value = (e.target as HTMLTextAreaElement).value;
    if (this.invalid) this.validate();
    this.emit("input");
  };

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const placeholderAttr = hasLabel ? " " : this.placeholder || " ";
    const showError = this.invalid && this.showErrorInline && this.errorMessage;

    return html`
      <div class="loomi-field" part="field">
        <textarea
          class="loomi-textarea"
          part="textarea"
          .value=${this.value}
          name=${this.name || nothing}
          rows=${this.rows}
          placeholder=${placeholderAttr}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-label=${hasLabel ? this.label : nothing}
          aria-invalid=${this.invalid ? "true" : "false"}
          @input=${this.onInput}
          @change=${() => this.emit("change")}
        ></textarea>
        ${hasLabel
          ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
          : nothing}
      </div>
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-textarea": LoomiTextarea;
  }
}
