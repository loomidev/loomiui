import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LoomiElement, loomiT, themeStyles } from "@loomidev/core";
import type Quill from "quill";
import { componentStyles, quillStyles } from "./generated/styles.css.js";

/**
 * `<loomi-text-editor>` — a themeable rich-text editor with a floating label and
 * inline validation, powered by Quill (bold/italic/lists/links). `value` holds HTML.
 * Form-associated: its value submits with the form.
 *
 * @csspart field - The bordered container.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 */
@customElement("loomi-text-editor")
export class LoomiTextEditor extends LoomiElement {
  static override styles = [themeStyles, componentStyles, quillStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private quill?: Quill;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() locale = "";
  @property() placeholder = "";
  @property() value = "";
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @query(".loomi-quill-root") private quillRootEl!: HTMLElement;

  override willUpdate(changed: Map<string, unknown>): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
    if (this.quill && (changed.has("disabled") || changed.has("readonly"))) {
      this.quill.enable(!this.disabled && !this.readonly);
    }
  }

  override firstUpdated(): void {
    this.initQuill();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.quill = undefined;
  }

  private async initQuill(): Promise<void> {
    if (!this.quillRootEl) return;
    const { default: QuillEditor } = await import("quill");
    if (!this.quillRootEl) return;
    this.quill = new QuillEditor(this.quillRootEl, {
      theme: "snow",
      placeholder: this.placeholder,
      readOnly: this.disabled || this.readonly,
    });
    if (this.value) this.quill.clipboard.dangerouslyPasteHTML(this.value);
    this.quill.root.style.minHeight = `${this.rows * 1.5}em`;
    this.quill.on("text-change", () => {
      this.value = this.quill!.getSemanticHTML();
      if (this.invalid) this.validate();
      this.emit("input");
    });
    this.quill.on("selection-change", (range) => {
      if (!range) {
        this.showValidation();
        this.emit("change");
      }
    });
  }

  override focus(): void {
    this.quill?.focus();
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
    const text = this.quill?.getText() ?? "";
    const empty = this.required && !this.disabled && !this.readonly && text.trim() === "";
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale) : "";
    if (this.quillRootEl) this.internals.setValidity(validity, message, this.quillRootEl);
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

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const showError = this.invalid && this.showErrorInline && this.errorMessage;

    return html`
      ${hasLabel
        ? html`<label class="loomi-label loomi-label-static"
            >${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label
          >`
        : nothing}
      <div class="loomi-field loomi-field-quill" part="field">
        <div class="loomi-quill-root"></div>
      </div>
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-text-editor": LoomiTextEditor;
  }
}
