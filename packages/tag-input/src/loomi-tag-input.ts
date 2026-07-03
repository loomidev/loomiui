import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { LoomiElement, accentVars, loomiT, themeStyles, type LoomiColor } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTagInputSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiTagInputMode = "inside" | "below";
export type LoomiTagInputShade = "faint" | "dark" | "light";

const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;

/**
 * `<loomi-tag-input>` — a form-associated tag entry control styled like
 * `<loomi-input>`. Press Enter to turn the current draft text into a removable
 * gray outline tag.
 *
 * @csspart field - The bordered field container.
 * @csspart input - The native draft `<input>`.
 * @csspart tags - The tag list.
 * @csspart tag - An individual tag chip.
 * @fires input - Fired when draft text changes or tags are added/removed.
 * @fires change - Fired when tags are added/removed.
 */
@customElement("loomi-tag-input")
export class LoomiTagInput extends LoomiElement {
  static override styles = [themeStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() locale = "";
  @property() placeholder = "";
  @property() value = "";
  @property() size: LoomiTagInputSize = "medium";
  @property() color: LoomiColor | string = "primary";
  @property() shade: LoomiTagInputShade = "light";
  @property({ reflect: true }) mode: LoomiTagInputMode = "inside";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: "suffix-icon" }) suffixIcon = "";
  @property() suffix = "";
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private draft = "";
  @state() private tagValues: string[] = [];

  @query("input") private inputEl!: HTMLInputElement;

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("value")) {
      const parsed = this.parseValue(this.value);
      if (!this.sameTags(parsed, this.tagValues)) {
        this.tagValues = parsed;
      }
    }

    const serialized = this.serializeTags(this.tagValues);
    if (this.value !== serialized) {
      this.value = serialized;
    }

    this.internals.setFormValue(serialized);
    this.syncValidity();
  }

  override focus(): void {
    this.inputEl?.focus();
  }

  get tags(): string[] {
    return [...this.tagValues];
  }

  set tags(values: string[]) {
    this.setTags(values, false);
  }

  clear(): void {
    if (this.disabled || this.readonly) return;
    this.draft = "";
    this.setTags([], true);
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

  private parseValue(value: string): string[] {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private serializeTags(tags: string[]): string {
    return tags.join(",");
  }

  private sameTags(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((tag, index) => tag === b[index]);
  }

  private setTags(tags: string[], emitEvents: boolean): void {
    const next = tags.map((tag) => tag.trim()).filter(Boolean);
    if (this.sameTags(next, this.tagValues)) return;

    this.tagValues = next;
    this.value = this.serializeTags(next);
    this.internals.setFormValue(this.value);
    if (this.invalid) this.validate();
    if (emitEvents) {
      this.emit("input");
      this.emit("change");
    }
  }

  private syncValidity(showInvalid = this.validationVisible): boolean {
    const empty = this.required && !this.disabled && !this.readonly && this.tagValues.length === 0;
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale) : "";
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

  private commitDraft(): void {
    const tag = this.draft.trim().replace(/\s+/g, " ");
    if (!tag || this.disabled || this.readonly) return;

    this.draft = "";
    this.setTags([...this.tagValues, tag], true);
  }

  private removeTag(index: number): void {
    if (this.disabled || this.readonly) return;
    this.setTags(this.tagValues.filter((_, i) => i !== index), true);
    this.focus();
  }

  private onInput = (e: Event): void => {
    this.draft = (e.target as HTMLInputElement).value;
    this.emit("input");
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      this.commitDraft();
      return;
    }

    if (e.key === "Backspace" && this.draft === "" && this.tagValues.length > 0 && !this.readonly) {
      e.preventDefault();
      this.removeTag(this.tagValues.length - 1);
    }
  };

  private renderIcon(name: string, cls = "loomi-icon"): TemplateResult | typeof nothing {
    const path = getLoomiIcon(name);
    if (!path) return nothing;
    return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${path}</svg>`;
  }

  private renderTag(tag: string, index: number): TemplateResult {
    return html`<span class=${`loomi-tag ${this.shade}`} part="tag">
      <span class="loomi-tag-label">${tag}</span>
      ${this.disabled || this.readonly
        ? nothing
        : html`<button
            type="button"
            class="loomi-tag-remove"
            aria-label=${loomiT("common.remove", {}, this.locale)}
            @click=${() => this.removeTag(index)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${X}</svg>
          </button>`}
    </span>`;
  }

  private renderTags(): TemplateResult | typeof nothing {
    if (this.tagValues.length === 0) return nothing;
    return html`<div class="loomi-tags" part="tags">${this.tagValues.map((tag, index) => this.renderTag(tag, index))}</div>`;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    const hasSuffix = this.suffix || this.suffixIcon;
    if (!hasSuffix) return nothing;
    return html`<span class="loomi-suffix">
      <slot name="suffix">${this.suffixIcon ? this.renderIcon(this.suffixIcon) : this.suffix}</slot>
    </span>`;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const placeholderAttr = hasLabel ? " " : this.placeholder || " ";
    const belowMode = this.mode === "below";
    const showError = this.invalid && this.showErrorInline && this.errorMessage;
    const fieldClasses = [
      "loomi-field",
      `size-${this.size}`,
      belowMode ? "mode-below" : "mode-inside",
      this.tagValues.length > 0 ? "has-tags" : "",
      this.draft ? "has-draft" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const labelEl = hasLabel
      ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
      : nothing;

    return html`
      <div class=${fieldClasses} part="field" style=${accentVars(this.color)} @click=${() => this.focus()}>
        ${belowMode ? nothing : labelEl}
        ${belowMode ? nothing : this.renderTags()}
        <span class="loomi-inputwrap">
          <input
            class="loomi-input"
            part="input"
            .value=${live(this.draft)}
            name=${this.name || nothing}
            placeholder=${placeholderAttr}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            aria-label=${hasLabel ? this.label : nothing}
            aria-invalid=${this.invalid ? "true" : "false"}
            @input=${this.onInput}
            @keydown=${this.onKeydown}
            @blur=${this.showValidation}
          />
          ${belowMode ? labelEl : nothing}
        </span>
        ${this.renderSuffix()}
      </div>
      ${belowMode ? this.renderTags() : nothing}
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tag-input": LoomiTagInput;
  }
}
