import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import {
  LoomiElement,
  accentVars,
  controlSizeStyles,
  fieldStyles,
  loomiT,
  themeStyles,
  type LoomiColor,
} from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTagInputSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiTagInputMode = "inside" | "below";
export type LoomiTagInputVariant = "default" | "minimal";
export type LoomiTagInputShade = "faint" | "dark" | "light";
export interface LoomiTagInputAutocompleteItem {
  label: string;
  value?: string;
  description?: string;
  image?: string;
}

const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

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
  static override styles = [themeStyles, controlSizeStyles, fieldStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() locale = "";
  @property() placeholder = "";
  @property() value = "";
  @property() size: LoomiTagInputSize = "medium";
  @property() variant: LoomiTagInputVariant = "default";
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
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute })
  showFocusRing = true;
  @property({ type: Array, attribute: "autocomplete-data" }) autocompleteData: Array<
    Record<string, unknown>
  > = [];
  @property({ attribute: "autocomplete-label-key" }) autocompleteLabelKey = "label";
  @property({ attribute: "autocomplete-value-key" }) autocompleteValueKey = "value";
  @property({ attribute: "autocomplete-description-key" }) autocompleteDescriptionKey =
    "description";
  @property({ attribute: "autocomplete-image-key" }) autocompleteImageKey = "image";

  @state() private draft = "";
  @state() private tagValues: string[] = [];
  @state() private autocompleteOpen = false;
  @state() private autocompleteActiveIndex = -1;

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
    const message = empty
      ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale)
      : "";
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
    this.autocompleteOpen = false;
    this.setTags([...this.tagValues, tag], true);
  }

  private get autocompleteOptions(): LoomiTagInputAutocompleteItem[] {
    const q = this.draft.trim().toLowerCase();
    if (!q) return [];
    return this.autocompleteData
      .map((row) => ({
        label: String(row[this.autocompleteLabelKey] ?? ""),
        value: String(row[this.autocompleteValueKey] ?? row[this.autocompleteLabelKey] ?? ""),
        description: this.autocompleteDescriptionKey
          ? String(row[this.autocompleteDescriptionKey] ?? "")
          : "",
        image: this.autocompleteImageKey ? String(row[this.autocompleteImageKey] ?? "") : "",
      }))
      .filter((item) => item.label && !this.tagValues.includes(item.value || item.label))
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) || (item.value ?? "").toLowerCase().includes(q),
      );
  }

  private chooseAutocomplete(item: LoomiTagInputAutocompleteItem): void {
    if (this.disabled || this.readonly) return;
    this.draft = "";
    this.autocompleteOpen = false;
    this.setTags([...this.tagValues, item.value || item.label], true);
    this.dispatchEvent(
      new CustomEvent("loomi-autocomplete-select", {
        bubbles: true,
        composed: true,
        detail: { item },
      }),
    );
  }

  private removeTag(index: number): void {
    if (this.disabled || this.readonly) return;
    this.setTags(
      this.tagValues.filter((_, i) => i !== index),
      true,
    );
    this.focus();
  }

  private onInput = (e: Event): void => {
    this.draft = (e.target as HTMLInputElement).value;
    const options = this.autocompleteOptions;
    this.autocompleteOpen = options.length > 0;
    this.autocompleteActiveIndex = options.length ? 0 : -1;
    this.emit("input");
  };

  private onKeydown = (e: KeyboardEvent): void => {
    const options = this.autocompleteOptions;
    if (this.autocompleteOpen && options.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.autocompleteActiveIndex = (this.autocompleteActiveIndex + 1) % options.length;
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.autocompleteActiveIndex =
          (this.autocompleteActiveIndex - 1 + options.length) % options.length;
        return;
      }
      if (e.key === "Escape") {
        this.autocompleteOpen = false;
        return;
      }
      if (e.key === "Enter" && options[this.autocompleteActiveIndex]) {
        e.preventDefault();
        this.chooseAutocomplete(options[this.autocompleteActiveIndex]);
        return;
      }
    }

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
      ${
        this.disabled || this.readonly
          ? nothing
          : html`<button
            type="button"
            class="loomi-tag-remove"
            aria-label=${loomiT("common.remove", {}, this.locale)}
            @click=${() => this.removeTag(index)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${X}</svg>
          </button>`
      }
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

  private renderAutocomplete(): TemplateResult | typeof nothing {
    const options = this.autocompleteOptions;
    if (!this.autocompleteOpen || !options.length) return nothing;
    return html`<div class="loomi-autocomplete-panel" role="listbox">
      ${options.map(
        (item, index) => html`<div
        class="loomi-autocomplete-option ${index === this.autocompleteActiveIndex ? "active" : ""}"
        role="option"
        aria-selected=${index === this.autocompleteActiveIndex ? "true" : "false"}
        @mouseenter=${() => (this.autocompleteActiveIndex = index)}
        @mousedown=${(event: Event) => event.preventDefault()}
        @click=${() => this.chooseAutocomplete(item)}
      >
        ${item.image ? html`<img src=${item.image} alt="" />` : nothing}
        <span class="loomi-autocomplete-copy">
          <span class="loomi-autocomplete-label">${item.label}</span>
          ${item.description ? html`<span class="loomi-autocomplete-desc">${item.description}</span>` : nothing}
        </span>
      </div>`,
      )}
    </div>`;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const placeholderAttr = hasLabel ? " " : this.placeholder || " ";
    const belowMode = this.mode === "below";
    const showError = this.invalid && this.showErrorInline && this.errorMessage;
    const fieldClasses = [
      "loomi-field",
      `size-${this.size}`,
      `variant-${this.variant}`,
      belowMode ? "mode-below" : "mode-inside",
      this.tagValues.length > 0 ? "has-tags" : "",
      this.draft ? "has-draft" : "",
      this.showFocusRing ? "" : "no-focus-ring",
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
      ${this.renderAutocomplete()}
      ${belowMode ? this.renderTags() : nothing}
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

export interface LoomiTagInputAutocompleteSelectDetail {
  item: LoomiTagInputAutocompleteItem;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tag-input": LoomiTagInput;
  }

  interface HTMLElementEventMap {
    "loomi-autocomplete-select": CustomEvent<LoomiTagInputAutocompleteSelectDetail>;
  }
}
