import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiT, onClickOutside, themeStyles } from "@loomidev/core";

export type LoomiAutocompleteSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiAutocompleteVariant = "default" | "minimal";

export interface LoomiAutocompleteItem {
  label: string;
  value?: string;
  description?: string;
  image?: string;
}

const DEFAULT_PLACEHOLDER = "Search...";
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

@customElement("loomi-autocomplete")
export class LoomiAutocomplete extends LoomiElement {
  static override styles = [
    themeStyles,
    css`
      :host {
        display: block;
        margin-bottom: 1rem;
        --loomi-control-height: 2.75rem;
        --loomi-control-pad-x: 1rem;
        --loomi-control-font-size: 1rem;
      }
      :host([hidden]) { display: none; }
      .loomi-ac { position: relative; width: 100%; }
      .size-tiny { --loomi-control-height: 2rem; --loomi-control-pad-x: 0.625rem; --loomi-control-font-size: 0.75rem; font-size: var(--loomi-control-font-size); }
      .size-small { --loomi-control-height: 2.25rem; --loomi-control-pad-x: 0.75rem; --loomi-control-font-size: 0.875rem; font-size: var(--loomi-control-font-size); }
      .size-regular { --loomi-control-height: 2.5rem; --loomi-control-pad-x: 0.875rem; --loomi-control-font-size: 0.875rem; font-size: var(--loomi-control-font-size); }
      .size-medium { --loomi-control-height: 2.75rem; --loomi-control-pad-x: 1rem; --loomi-control-font-size: 1rem; font-size: var(--loomi-control-font-size); }
      .size-big { --loomi-control-height: 3rem; --loomi-control-pad-x: 1.25rem; --loomi-control-font-size: 1.125rem; font-size: var(--loomi-control-font-size); }
      .loomi-field {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: var(--loomi-control-height);
        border: 2px solid var(--loomi-surface-border);
        border-radius: 0.5rem;
        background: var(--loomi-surface);
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .loomi-field:focus-within,
      .open .loomi-field {
        border-color: var(--loomi-primary-600);
        box-shadow: 0 0 0 3px var(--loomi-primary-100);
      }
      .no-focus-ring .loomi-field:focus-within,
      .no-focus-ring.open .loomi-field {
        box-shadow: none;
      }
      :host([invalid]) .loomi-field { border-color: var(--loomi-error-400); }
      :host([invalid]) .loomi-field:focus-within { border-color: var(--loomi-error-500); }
      :host([disabled]) .loomi-field {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--loomi-surface-muted);
      }
      .loomi-field.variant-minimal {
        border: 0;
        border-bottom: 2px solid var(--loomi-surface-border);
        background: transparent;
        border-radius: 0;
      }
      .loomi-field.variant-minimal:focus-within,
      .open .loomi-field.variant-minimal {
        box-shadow: none;
        border-bottom-color: var(--loomi-primary-600);
      }
      :host([invalid]) .loomi-field.variant-minimal { border-bottom-color: var(--loomi-error-400); }
      :host([invalid]) .loomi-field.variant-minimal:focus-within { border-bottom-color: var(--loomi-error-500); }
      :host([disabled]) .loomi-field.variant-minimal { background: transparent; }
      input {
        flex: 1 1 auto;
        width: 100%;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--loomi-text);
        font: inherit;
        font-size: var(--loomi-control-font-size);
        padding: 0 var(--loomi-control-pad-x);
      }
      input::placeholder { color: var(--loomi-text-faint); }
      input:disabled { cursor: not-allowed; }
      .loomi-label {
        position: absolute;
        left: var(--loomi-control-pad-x);
        top: 50%;
        transform: translateY(-50%);
        transform-origin: left center;
        pointer-events: none;
        color: var(--loomi-text-faint);
        background: var(--loomi-surface);
        padding: 0 0.25rem;
        transition: all 0.15s ease;
      }
      input:focus + .loomi-label,
      input:not(:placeholder-shown) + .loomi-label,
      .open .loomi-label {
        top: 0;
        transform: translateY(-50%) scale(0.85);
        color: var(--loomi-primary-600);
      }
      :host([invalid]) input:focus + .loomi-label,
      :host([invalid]) input:not(:placeholder-shown) + .loomi-label {
        color: var(--loomi-error-500);
      }
      .loomi-req { color: var(--loomi-error-500); margin-left: 0.15rem; }
      .loomi-panel {
        position: absolute;
        z-index: var(--loomi-autocomplete-panel-z-index, 500);
        top: calc(100% + 0.35rem);
        left: 0;
        right: 0;
        max-height: 14rem;
        overflow: auto;
        border: 1px solid var(--loomi-surface-border);
        border-radius: 0.5rem;
        background: var(--loomi-surface);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
        padding: 0.25rem;
      }
      .loomi-option {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        border-radius: 0.375rem;
        color: var(--loomi-text);
        cursor: pointer;
        padding: 0.5rem 0.6rem;
      }
      .loomi-option:hover,
      .loomi-option.active { background: var(--loomi-surface-hover); }
      .loomi-option img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 9999px;
        object-fit: cover;
        flex: none;
      }
      .loomi-option-copy { min-width: 0; display: grid; gap: 0.05rem; }
      .loomi-option-label { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .loomi-option-desc { color: var(--loomi-text-faint); font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .loomi-empty { color: var(--loomi-text-faint); padding: 0.75rem; text-align: center; font-size: 0.875rem; }
    `,
  ];
  static formAssociated = true;

  private internals = this.attachInternals();
  private cleanup?: () => void;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property() value = "";
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property() locale = "";
  @property() size: LoomiAutocompleteSize = "medium";
  @property() variant: LoomiAutocompleteVariant = "default";
  @property({ type: Array }) data: Array<Record<string, unknown>> = [];
  @property({ attribute: "label-key" }) labelKey = "label";
  @property({ attribute: "value-key" }) valueKey = "value";
  @property({ attribute: "description-key" }) descriptionKey = "description";
  @property({ attribute: "image-key" }) imageKey = "image";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute }) showFocusRing = true;

  @state() private open = false;
  @state() private activeIndex = -1;
  @query("input") private inputEl?: HTMLInputElement;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("selectedValue") && this.value !== this.selectedValue) {
      this.value = this.selectedValue;
    }
    this.internals.setFormValue(this.value);
    this.invalid = this.required && !this.value.trim();
  }

  override focus(): void {
    this.inputEl?.focus();
  }

  private get options(): LoomiAutocompleteItem[] {
    return this.data.map((row) => ({
      label: String(row[this.labelKey] ?? ""),
      value: String(row[this.valueKey] ?? row[this.labelKey] ?? ""),
      description: this.descriptionKey ? String(row[this.descriptionKey] ?? "") : "",
      image: this.imageKey ? String(row[this.imageKey] ?? "") : "",
    })).filter((item) => item.label);
  }

  private get filtered(): LoomiAutocompleteItem[] {
    const q = this.value.trim().toLowerCase();
    return q ? this.options.filter((item) => item.label.toLowerCase().includes(q) || (item.value ?? "").toLowerCase().includes(q)) : this.options;
  }

  private show(): void {
    if (this.disabled || this.readonly) return;
    this.open = true;
    this.activeIndex = this.filtered.length ? 0 : -1;
    this.cleanup = onClickOutside(this, () => this.hide());
  }

  private hide(): void {
    this.open = false;
    this.activeIndex = -1;
    this.cleanup?.();
    this.cleanup = undefined;
  }

  private choose(item: LoomiAutocompleteItem): void {
    this.value = item.value || item.label;
    this.hide();
    this.dispatchEvent(new CustomEvent("select", { bubbles: true, composed: true, detail: { item, value: this.value, label: item.label } }));
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    this.show();
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.open && (event.key === "ArrowDown" || event.key === "Enter")) {
      this.show();
      return;
    }
    const options = this.filtered;
    if (event.key === "Escape") this.hide();
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.activeIndex = options.length ? (this.activeIndex + 1) % options.length : -1;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.activeIndex = options.length ? (this.activeIndex - 1 + options.length) % options.length : -1;
    } else if (event.key === "Enter" && this.activeIndex >= 0 && options[this.activeIndex]) {
      event.preventDefault();
      this.choose(options[this.activeIndex]);
    }
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const placeholder = hasLabel ? " " : loomiDefaultText(this.placeholder, DEFAULT_PLACEHOLDER, "autocomplete.placeholder", this.locale);
    const options = this.filtered;
    return html`<div class="loomi-ac size-${this.size} ${this.open ? "open" : ""} ${this.showFocusRing ? "" : "no-focus-ring"}">
      <div class="loomi-field variant-${this.variant}">
        <input
          .value=${this.value}
          name=${this.name || nothing}
          placeholder=${placeholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-autocomplete="list"
          aria-expanded=${this.open ? "true" : "false"}
          aria-label=${hasLabel ? this.label : nothing}
          @focus=${this.show}
          @input=${this.onInput}
          @keydown=${this.onKeydown}
        />
        ${hasLabel ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>` : nothing}
      </div>
      ${this.open ? html`<div class="loomi-panel" role="listbox">
        ${options.length
          ? options.map((item, index) => html`<div
              class="loomi-option ${index === this.activeIndex ? "active" : ""}"
              role="option"
              aria-selected=${index === this.activeIndex ? "true" : "false"}
              @mouseenter=${() => (this.activeIndex = index)}
              @mousedown=${(event: Event) => event.preventDefault()}
              @click=${() => this.choose(item)}
            >
              ${item.image ? html`<img src=${item.image} alt="" />` : nothing}
              <span class="loomi-option-copy">
                <span class="loomi-option-label">${item.label}</span>
                ${item.description ? html`<span class="loomi-option-desc">${item.description}</span>` : nothing}
              </span>
            </div>`)
          : html`<div class="loomi-empty">${loomiT("select.emptyPlaceholder", {}, this.locale)}</div>`}
      </div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-autocomplete": LoomiAutocomplete;
  }
}
