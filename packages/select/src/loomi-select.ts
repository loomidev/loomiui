import { html, nothing, svg, type PropertyValues, type TemplateResult, isServer } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import {
  LoomiElement,
  controlSizeStyles,
  fieldStyles,
  loomiDefaultText,
  loomiT,
  anchorFloatingPanel,
  onClickOutside,
  themeStyles,
  type LoomiFloatingPanelHandle,
  type LoomiFieldLabelPosition,
  LOOMI_CONTROL_SIZES,
  resolveLoomiSize,
  type LoomiSize,
  type LoomiSizeSupport,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiSelectVariant = "default" | "minimal";

interface LoomiOption {
  label: string;
  value: string;
  image?: string;
}

const CHEVRON = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />`;
const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;
const DEFAULT_PLACEHOLDER = "Select One";
const DEFAULT_EMPTY_PLACEHOLDER = "No options available";
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-select>` — a themeable custom select. Supports a `data` array (or JSON),
 * manual `<option>` children, search, multiple selection and a floating label.
 * Form-associated: submits the selected value(s) (comma-joined when multiple).
 *
 * @slot - Manual options as light-DOM `<option value="...">Label</option>` elements.
 * @csspart trigger - The clickable trigger.
 * @csspart panel - The dropdown panel.
 * @fires loomi-select - `detail: { value, label, values }` when an item is chosen.
 * @fires change - Fired when the selection changes (composed).
 */
@customElement("loomi-select")
export class LoomiSelect extends LoomiElement {
  static override styles = [themeStyles, controlSizeStyles, fieldStyles, componentStyles];

  /** Size names this component supports, from the canonical `LoomiSize` scale — shared by every form control. */
  static readonly supportedSizes = { size: LOOMI_CONTROL_SIZES } satisfies LoomiSizeSupport;
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private initialSelectedValue = "";

  @property({ reflect: true }) name = "";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property() label = "";
  /**
   * Accessible name for a select with no visible `label`, forwarded to the trigger
   * button and the options listbox. Ignored when `label` is set, which names both.
   */
  @property({ attribute: "aria-label" }) accessibilityLabel = "";
  @property({ attribute: "label-position", reflect: true })
  labelPosition: LoomiFieldLabelPosition = "default";
  @property() locale = "";
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
  /** Size preset: `tiny` | `small` | `regular` | `medium` | `big`. Equal names give equal heights across every form control and `<loomi-button>`. */
  @property() size: LoomiSize = "regular";
  @property() variant: LoomiSelectVariant = "default";
  @property({ attribute: "empty-placeholder" }) emptyPlaceholder = DEFAULT_EMPTY_PLACEHOLDER;
  @property({ attribute: "empty-action-label" }) emptyActionLabel = "";
  @property({ attribute: "empty-action-url" }) emptyActionUrl = "";
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute })
  showFocusRing = true;

  @state() private open = false;
  @state() private search = "";
  @state() private selected: string[] = [];
  /** Index of the keyboard-highlighted option within `this.filtered`, while open. */
  @state() private activeIndex = -1;

  @query(".loomi-search") private searchEl?: HTMLInputElement;
  @query(".loomi-trigger") private triggerEl?: HTMLButtonElement;
  @query(".loomi-panel") private panelEl?: HTMLElement;

  private cleanupClickOutside?: () => void;
  private floating?: LoomiFloatingPanelHandle;

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialSelectedValue = this.selectedValue;
    super.connectedCallback();
    this.cleanupClickOutside = onClickOutside(this, () => {
      if (this.open) this.close(true);
    });
  }

  formResetCallback(): void {
    this.selectedValue = this.initialSelectedValue;
    this.selected = this.parseSelectedValue();
    this.open = false;
    this.search = "";
    this.activeIndex = -1;
    this.validationVisible = false;
    this.invalid = false;
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupClickOutside?.();
    this.stopRepositioning();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (!this.open) {
      if (changed.has("open")) this.stopRepositioning();
      return;
    }
    const panel = this.panelEl;
    const trigger = this.triggerEl;
    if (!panel || !trigger) return;
    // The panel lives in the top layer, so an ancestor with `overflow` — a modal, a card,
    // a table's scroll wrapper — neither clips it nor grows a scrollbar to make room.
    // Re-placed on every open-state render: filtering changes the panel's height, which
    // can decide whether it fits below the trigger.
    if (this.floating) this.floating.reposition();
    else this.floating = anchorFloatingPanel(trigger, panel);
  }

  private stopRepositioning(): void {
    this.floating?.release();
    this.floating = undefined;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // Re-sync `selected` from `selectedValue` on first render AND whenever it's set
    // again afterwards (e.g. swapping which record a select reflects) — but never when
    // `selected` itself just changed from a user pick, since that doesn't touch
    // `selectedValue` at all.
    // Also on `data`: the options often arrive after `selectedValue` does, and
    // whether an empty value counts as a selection depends on them.
    if (changed.has("selectedValue") || changed.has("data")) {
      this.selected = this.parseSelectedValue();
    }
    this.internals.setFormValue(this.selected.join(","));
    this.syncValidity();
  }

  /** Reset the selection. */
  reset(): void {
    this.selected = [];
    this.emitChange();
  }

  /**
   * Turns `selectedValue` into the list of chosen option values.
   *
   * An empty string is deliberately not treated as "nothing selected" out of
   * hand. A filter whose unfiltered choice is `value=""` — "All categories",
   * "Any status" — is a real selection, and discarding it left those controls
   * showing the placeholder instead of the option the caller had chosen.
   *
   * So an empty value counts when, and only when, the options actually offer
   * one. With no such option there is nothing it could refer to, and it means
   * what it used to: no selection.
   */
  private parseSelectedValue(): string[] {
    if (this.selectedValue === "") {
      return this.options.some((option) => option.value === "") ? [""] : [];
    }

    return this.selectedValue
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value !== "");
  }

  private get options(): LoomiOption[] {
    if (Array.isArray(this.data) && this.data.length) {
      return this.data.map((row) => ({
        label: String(row[this.labelKey] ?? ""),
        value: String(row[this.valueKey] ?? ""),
        image: this.imageKey ? (row[this.imageKey] as string) : undefined,
      }));
    }
    // Light DOM is not readable during server rendering; hydration fills this in.
    if (isServer) return [];
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
    if (this.open) {
      this.close(true);
      return;
    }
    this.open = !this.open;
    if (this.open) {
      const firstSelected = this.filtered.findIndex((o) => this.selected.includes(o.value));
      this.activeIndex = firstSelected >= 0 ? firstSelected : this.filtered.length ? 0 : -1;
      if (this.searchable) this.updateComplete.then(() => this.searchEl?.focus());
    }
  }

  private close(showValidation = false): void {
    this.open = false;
    this.search = "";
    this.activeIndex = -1;
    if (showValidation) this.showValidation();
  }

  private emitChange(): void {
    this.internals.setFormValue(this.selected.join(","));
    this.syncValidity();
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
    this.dispatchEvent(
      new CustomEvent("loomi-select", {
        bubbles: true,
        composed: true,
        detail: { value: opt.value, label: opt.label, values: [...this.selected] },
      }),
    );
    this.emitChange();
  }

  private onEmptyAction(): void {
    this.dispatchEvent(
      new CustomEvent("loomi-empty-action", {
        bubbles: true,
        composed: true,
        detail: { url: this.emptyActionUrl },
      }),
    );
    if (this.emptyActionUrl) location.href = this.emptyActionUrl;
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
    const empty = this.required && !this.disabled && !this.readonly && this.selected.length === 0;
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? loomiT("validation.selectOption", {}, this.locale) : "";
    if (this.triggerEl) this.internals.setValidity(validity, message, this.triggerEl);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.close(true);
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
    const reserveLabelSpace = hasLabel && !hasSelection && !this.open;
    const displayText = hasSelection
      ? this.selected.map((v) => this.labelFor(v)).join(", ")
      : reserveLabelSpace
        ? `${this.label}${this.required ? " *" : ""}`
        : loomiDefaultText(
            this.placeholder,
            DEFAULT_PLACEHOLDER,
            "select.placeholder",
            this.locale,
          );
    const opts = this.filtered;

    // The trigger is an APG select-only combobox: its content (the value span) is read as
    // the combobox's value, not its name, so the name comes from the label alone — also
    // pointing at the value span would read the value twice. With no label, use the
    // forwarded aria-label; with neither, fall back to the value span so the visible
    // placeholder still names it. The listbox takes the same name.
    //
    // The listbox is the option list itself, not the panel: the search box and the
    // empty-state CTA aren't valid listbox children. With no options there is no listbox
    // (an empty one is invalid too), so the expanded trigger's required aria-controls
    // points at the panel holding the empty state instead. When `searchable` moves focus
    // into the search box, it carries aria-activedescendant too, so the highlighted
    // option is still announced while filtering.
    const ariaLabel = !hasLabel && this.accessibilityLabel ? this.accessibilityLabel : nothing;
    const labelledBy = hasLabel ? "loomi-label" : ariaLabel === nothing ? "loomi-value" : nothing;

    const activeId =
      this.open && this.activeIndex >= 0 && opts[this.activeIndex]
        ? `loomi-opt-${this.activeIndex}`
        : nothing;

    return html`
      <div
        class="loomi-select size-${resolveLoomiSize(this.size, LOOMI_CONTROL_SIZES)} variant-${this.variant} ${this.open ? "open" : ""} ${float ? "float" : ""} ${this.showFocusRing ? "" : "no-focus-ring"}"
        @keydown=${this.onKeydown}
      >
        <button
          type="button"
          class="loomi-trigger"
          part="trigger"
          role="combobox"
          aria-haspopup="listbox"
          aria-controls=${this.open ? (opts.length ? "loomi-listbox" : "loomi-panel") : nothing}
          aria-labelledby=${labelledBy}
          aria-label=${ariaLabel}
          aria-expanded=${this.open ? "true" : "false"}
          aria-activedescendant=${activeId}
          ?disabled=${this.disabled}
          @click=${this.toggleOpen}
          @blur=${this.showValidation}
        >
          <span id="loomi-value" class="loomi-value ${hasSelection ? "" : "placeholder"} ${reserveLabelSpace ? "sizer" : ""}">${displayText}</span>
          <svg class="loomi-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${CHEVRON}</svg>
        </button>
        ${
          hasLabel
            ? html`<label id="loomi-label" class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
            : nothing
        }
        ${
          this.open
            ? html`<div id="loomi-panel" class="loomi-panel" part="panel" popover="manual">
              ${
                this.searchable && this.options.length
                  ? html`<div class="loomi-searchbox">
                    <input
                      class="loomi-search"
                      type="text"
                      aria-controls=${opts.length ? "loomi-listbox" : nothing}
                      aria-activedescendant=${activeId}
                      aria-autocomplete="list"
                      placeholder=${loomiT("select.searchPlaceholder", {}, this.locale)}
                      .value=${this.search}
                      @input=${(e: Event) => {
                        this.search = (e.target as HTMLInputElement).value;
                        this.activeIndex = this.filtered.length ? 0 : -1;
                      }}
                    />
                  </div>`
                  : nothing
              }
              <div
                class="loomi-list"
                id=${opts.length ? "loomi-listbox" : nothing}
                role=${opts.length ? "listbox" : nothing}
                aria-labelledby=${opts.length ? labelledBy : nothing}
                aria-label=${opts.length ? ariaLabel : nothing}
                aria-multiselectable=${opts.length && this.multiple ? "true" : nothing}
              >
                ${
                  opts.length
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
                        ${
                          sel
                            ? html`<svg class="loomi-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${CHECK}</svg>`
                            : nothing
                        }
                      </div>`;
                      })
                    : html`<div class="loomi-empty">
                      <span>${loomiDefaultText(this.emptyPlaceholder, DEFAULT_EMPTY_PLACEHOLDER, "select.emptyPlaceholder", this.locale)}</span>
                      ${
                        this.emptyActionLabel
                          ? html`<button type="button" class="loomi-empty-action" @click=${this.onEmptyAction}>${this.emptyActionLabel}</button>`
                          : nothing
                      }
                    </div>`
                }
              </div>
            </div>`
            : nothing
        }
        <slot @slotchange=${() => this.requestUpdate()} hidden></slot>
      </div>
    `;
  }
}

export interface LoomiSelectSelectDetail {
  value: string;
  label: string;
  values: string[];
}

export interface LoomiSelectEmptyActionDetail {
  url: string;
}

/** Event map for `<loomi-select>`. `loomi-select` and `loomi-empty-action` are
 * dispatched by several loomi components with different detail shapes, so they
 * are typed per package instead of globally on `HTMLElementEventMap`. */
export interface LoomiSelectEventMap {
  "loomi-select": CustomEvent<LoomiSelectSelectDetail>;
  "loomi-empty-action": CustomEvent<LoomiSelectEmptyActionDetail>;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-select": LoomiSelect;
  }
}
