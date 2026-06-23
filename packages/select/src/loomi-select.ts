import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { themeStyles } from "@loomi/theme";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiSelectSize = "small" | "regular" | "medium" | "big";

interface LoomiOption {
  label: string;
  value: string;
  image?: string;
}

const CHEVRON = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />`;
const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;

/**
 * `<loomi-select>` — a themeable custom select. Supports a `data` array (or JSON),
 * manual `<option>` children, search, multiple selection and a floating label.
 * Form-associated: submits the selected value(s) (comma-joined when multiple).
 *
 * @slot - Manual options as light-DOM `<option value="...">Label</option>` elements.
 * @csspart trigger - The clickable trigger.
 * @csspart panel - The dropdown panel.
 * @fires select - `detail: { value, label, values }` when an item is chosen.
 * @fires change - Fired when the selection changes (composed).
 */
@customElement("loomi-select")
export class LoomiSelect extends LitElement {
  static override styles = [themeStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();

  @property() name = "";
  @property() placeholder = "Select One";
  @property() label = "";
  @property({ type: Array }) data: Array<Record<string, unknown>> = [];
  @property({ attribute: "label-key" }) labelKey = "label";
  @property({ attribute: "value-key" }) valueKey = "value";
  @property({ attribute: "image-key" }) imageKey = "";
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property({ type: Boolean }) searchable = false;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Number, attribute: "max-selectable" }) maxSelectable = -1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() size: LoomiSelectSize = "medium";
  @property({ attribute: "empty-placeholder" }) emptyPlaceholder = "No options available";
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private open = false;
  @state() private search = "";
  @state() private selected: string[] = [];
  @state() private initialized = false;
  /** Index of the keyboard-highlighted option within `this.filtered`, while open. */
  @state() private activeIndex = -1;

  @query(".loomi-search") private searchEl?: HTMLInputElement;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this.onDocClick, true);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDocClick, true);
  }

  override willUpdate(): void {
    if (!this.initialized && this.selectedValue) {
      this.selected = this.selectedValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      this.initialized = true;
    }
    this.internals.setFormValue(this.selected.join(","));
  }

  private onDocClick = (e: MouseEvent): void => {
    if (this.open && !e.composedPath().includes(this)) this.close();
  };

  /** Reset the selection. */
  reset(): void {
    this.selected = [];
    this.emitChange();
  }

  private get options(): LoomiOption[] {
    if (Array.isArray(this.data) && this.data.length) {
      return this.data.map((row) => ({
        label: String(row[this.labelKey] ?? ""),
        value: String(row[this.valueKey] ?? ""),
        image: this.imageKey ? (row[this.imageKey] as string) : undefined,
      }));
    }
    return Array.from(this.querySelectorAll("option")).map((o) => ({
      label: (o.textContent ?? "").trim(),
      value: o.getAttribute("value") ?? (o.textContent ?? "").trim(),
      image: o.dataset.image,
    }));
  }

  private get filtered(): LoomiOption[] {
    if (!this.search) return this.options;
    const q = this.search.toLowerCase();
    return this.options.filter((o) => o.label.toLowerCase().includes(q));
  }

  private labelFor(value: string): string {
    return this.options.find((o) => o.value === value)?.label ?? value;
  }

  private toggleOpen(): void {
    if (this.disabled || this.readonly) return;
    this.open = !this.open;
    if (this.open) {
      const firstSelected = this.filtered.findIndex((o) => this.selected.includes(o.value));
      this.activeIndex = firstSelected >= 0 ? firstSelected : this.filtered.length ? 0 : -1;
      if (this.searchable) this.updateComplete.then(() => this.searchEl?.focus());
    }
  }

  private close(): void {
    this.open = false;
    this.search = "";
    this.activeIndex = -1;
  }

  private emitChange(): void {
    this.internals.setFormValue(this.selected.join(","));
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private choose(opt: LoomiOption): void {
    if (this.multiple) {
      const has = this.selected.includes(opt.value);
      if (!has && this.maxSelectable > 0 && this.selected.length >= this.maxSelectable) {
        return;
      }
      this.selected = has
        ? this.selected.filter((v) => v !== opt.value)
        : [...this.selected, opt.value];
    } else {
      this.selected = [opt.value];
      this.close();
    }
    if (this.invalid) this.invalid = this.selected.length === 0;
    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: { value: opt.value, label: opt.label, values: [...this.selected] },
      }),
    );
    this.emitChange();
  }

  validate(): boolean {
    const empty = this.required && this.selected.length === 0;
    this.invalid = empty;
    return !empty;
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.close();
      return;
    }
    if (!this.open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.toggleOpen();
      }
      return;
    }
    const opts = this.filtered;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, opts.length - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        break;
      case "Home":
        e.preventDefault();
        this.activeIndex = 0;
        break;
      case "End":
        e.preventDefault();
        this.activeIndex = opts.length - 1;
        break;
      case "Enter":
      case " ":
        if (this.activeIndex >= 0 && opts[this.activeIndex]) {
          e.preventDefault();
          this.choose(opts[this.activeIndex]);
        }
        break;
    }
  };

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const hasSelection = this.selected.length > 0;
    const float = hasLabel && (this.open || hasSelection);
    const displayText = hasSelection
      ? this.selected.map((v) => this.labelFor(v)).join(", ")
      : hasLabel && !this.open
        ? ""
        : this.placeholder;
    const opts = this.filtered;

    const activeId =
      this.open && this.activeIndex >= 0 && opts[this.activeIndex] ? `loomi-opt-${this.activeIndex}` : nothing;

    return html`
      <div
        class="loomi-select size-${this.size} ${this.open ? "open" : ""} ${float ? "float" : ""}"
        @keydown=${this.onKeydown}
      >
        <button
          type="button"
          class="loomi-trigger"
          part="trigger"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? "true" : "false"}
          aria-activedescendant=${activeId}
          ?disabled=${this.disabled}
          @click=${this.toggleOpen}
        >
          <span class="loomi-value ${hasSelection ? "" : "placeholder"}">${displayText}</span>
          <svg class="loomi-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${CHEVRON}</svg>
        </button>
        ${hasLabel
          ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
          : nothing}
        ${this.open
          ? html`<div class="loomi-panel" part="panel" role="listbox" aria-multiselectable=${this.multiple ? "true" : nothing}>
              ${this.searchable && this.options.length
                ? html`<div class="loomi-searchbox">
                    <input
                      class="loomi-search"
                      type="text"
                      placeholder="Search…"
                      .value=${this.search}
                      @input=${(e: Event) => {
                        this.search = (e.target as HTMLInputElement).value;
                        this.activeIndex = this.filtered.length ? 0 : -1;
                      }}
                    />
                  </div>`
                : nothing}
              <div class="loomi-list">
                ${opts.length
                  ? opts.map((o, i) => {
                      const sel = this.selected.includes(o.value);
                      return html`<div
                        id="loomi-opt-${i}"
                        class="loomi-option ${sel ? "selected" : ""} ${i === this.activeIndex ? "active" : ""}"
                        role="option"
                        aria-selected=${sel ? "true" : "false"}
                        @mouseenter=${() => (this.activeIndex = i)}
                        @click=${() => this.choose(o)}
                      >
                        ${o.image ? html`<img src=${o.image} alt="" />` : nothing}
                        <span>${o.label}</span>
                        ${sel
                          ? html`<svg class="loomi-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${CHECK}</svg>`
                          : nothing}
                      </div>`;
                    })
                  : html`<div class="loomi-empty">${this.emptyPlaceholder}</div>`}
              </div>
            </div>`
          : nothing}
        <slot @slotchange=${() => this.requestUpdate()} hidden></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-select": LoomiSelect;
  }
}
