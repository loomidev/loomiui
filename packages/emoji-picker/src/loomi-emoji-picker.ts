import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiDefaultText,
  loomiStyles,
  loomiT,
  onClickOutside,
} from "@loomidev/core";
import type { LoomiPopover } from "@loomidev/popover";
import "@loomidev/popover";
import { componentStyles } from "./generated/styles.css.js";
import { GENERATED_EMOJIS } from "./emoji-data.gen.js";

const PANEL_WIDTH_PX: Record<LoomiEmojiPickerSize, number> = {
  small: 320,
  regular: 352,
  medium: 352,
  big: 400,
};

export type LoomiEmojiPickerSize = "small" | "regular" | "medium" | "big";
export type LoomiEmojiCategory =
  | "all"
  | "smileys"
  | "people"
  | "nature"
  | "food"
  | "activity"
  | "travel"
  | "objects"
  | "symbols"
  | "flags"
  | string;

export interface LoomiEmojiItem {
  emoji: string;
  name: string;
  value: string;
  category: LoomiEmojiCategory;
  keywords: string[];
  /** The 5 skin-tone variants of `emoji`, light -> dark, when it supports them. */
  skins?: readonly string[];
}

const DEFAULT_PLACEHOLDER = "Pick an emoji";
const DEFAULT_EMPTY_TEXT = "No emoji found";
const DEFAULT_SEARCH_PLACEHOLDER = "Search emoji";

const CATEGORY_ICONS: Record<string, string> = {
  all: "⌕",
  smileys: "😀",
  people: "👋",
  nature: "🌿",
  food: "🍕",
  activity: "⚽",
  travel: "✈️",
  objects: "💡",
  symbols: "❤️",
  flags: "🏳️",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  smileys: "Smileys",
  people: "People",
  nature: "Nature",
  food: "Food and drink",
  activity: "Activities",
  travel: "Travel and places",
  objects: "Objects",
  symbols: "Symbols",
  flags: "Flags",
};

const DEFAULT_EMOJIS: LoomiEmojiItem[] = GENERATED_EMOJIS.map(
  ([emoji, name, category, keywords, skins]) => ({
    emoji,
    name,
    value: emoji,
    category,
    keywords: [...keywords],
    skins,
  }),
);

/** Index 0 is "no tone" (the base emoji); 1-5 index into an item's `skins`, light -> dark. */
const SKIN_TONE_HAND = ["✋", "✋🏻", "✋🏼", "✋🏽", "✋🏾", "✋🏿"] as const;
const SKIN_TONE_LABEL_KEYS = [
  "emojiPicker.skinToneDefault",
  "emojiPicker.skinToneLight",
  "emojiPicker.skinToneMediumLight",
  "emojiPicker.skinToneMedium",
  "emojiPicker.skinToneMediumDark",
  "emojiPicker.skinToneDark",
] as const;
const SKIN_TONE_STORAGE_KEY = "loomi-emoji-picker:skin-tone";

function readStoredSkinTone(): number {
  try {
    const stored = Number(localStorage.getItem(SKIN_TONE_STORAGE_KEY));
    return Number.isInteger(stored) && stored >= 0 && stored < SKIN_TONE_HAND.length ? stored : 0;
  } catch {
    return 0;
  }
}

function persistSkinTone(tone: number): void {
  try {
    localStorage.setItem(SKIN_TONE_STORAGE_KEY, String(tone));
  } catch {
    // Ignore storage access errors.
  }
}

function keywordsFrom(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value ?? "")
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Lit's default `type: Boolean` converter treats ANY attribute presence — including
 * the literal string `"false"` — as `true` (`fromAttribute: (v) => v !== null`), so
 * `show-text="false"` written as plain HTML markup silently does nothing. This
 * converter fixes `fromAttribute` to honor a literal `"false"` while keeping the
 * usual presence-based `toAttribute` semantics for default-true boolean properties.
 */
const literalFalseBooleanConverter = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

function normalizeDataItem(row: Record<string, unknown>): LoomiEmojiItem | null {
  const emoji = String(row.emoji ?? row.icon ?? row.value ?? "").trim();
  if (!emoji) return null;
  const name = String(row.name ?? row.label ?? emoji).trim() || emoji;
  return {
    emoji,
    name,
    value: String(row.value ?? emoji),
    category: String(row.category ?? "custom") || "custom",
    keywords: keywordsFrom(row.keywords),
  };
}

/**
 * `<loomi-emoji-picker>` — searchable emoji picker with categories, keyboard support
 * and native form association.
 *
 * @fires loomi-emoji-select - `detail: { value, emoji, name, category, item }`
 * @fires change - `detail: { value, emoji, item }`
 */
@customElement("loomi-emoji-picker")
export class LoomiEmojiPicker extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;

  @property({ reflect: true }) name = "";
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property() label = "";
  @property() placeholder = DEFAULT_PLACEHOLDER;
  @property({ attribute: "empty-text" }) emptyText = DEFAULT_EMPTY_TEXT;
  @property() locale = "";
  @property() size: LoomiEmojiPickerSize = "medium";
  @property({ type: Array }) data: Array<Record<string, unknown>> = [];
  @property() emojis = "";
  @property({ type: Boolean, reflect: true }) inline = false;
  @property({ type: Boolean, converter: literalFalseBooleanConverter }) searchable = true;
  @property({
    type: Boolean,
    attribute: "show-categories",
    converter: literalFalseBooleanConverter,
  })
  showCategories = true;
  @property({ type: Boolean, attribute: "show-text", converter: literalFalseBooleanConverter })
  showText = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private open = false;
  @state() private search = "";
  @state() private category: LoomiEmojiCategory = "all";
  @state() private activeIndex = 0;
  @state() private skinTone = readStoredSkinTone();
  @state() private toneMenuOpen = false;

  @query(".loomi-search") private searchEl?: HTMLInputElement;
  @query("loomi-popover") private popoverEl?: LoomiPopover;
  @query(".loomi-tone-picker") private toneMenuEl?: HTMLElement;

  private toneMenuCleanup?: () => void;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.toneMenuCleanup?.();
    this.toneMenuCleanup = undefined;
  }

  override willUpdate(): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
  }

  get value(): string {
    return this.selectedValue;
  }

  get selection(): LoomiEmojiItem | null {
    return this.selectedItem;
  }

  reset(): void {
    this.selectedValue = "";
    this.emitChange(null);
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

  private get allItems(): LoomiEmojiItem[] {
    if (Array.isArray(this.data) && this.data.length) {
      return this.data
        .map(normalizeDataItem)
        .filter((item): item is LoomiEmojiItem => Boolean(item));
    }
    if (this.emojis.trim()) {
      return this.emojis
        .split(/[\s,]+/)
        .map((emoji) => emoji.trim())
        .filter(Boolean)
        .map((emoji) => ({ emoji, name: emoji, value: emoji, category: "custom", keywords: [] }));
    }
    return DEFAULT_EMOJIS;
  }

  private get categories(): LoomiEmojiCategory[] {
    return ["all", ...Array.from(new Set(this.allItems.map((item) => item.category)))];
  }

  private get visibleItems(): LoomiEmojiItem[] {
    const query = this.search.trim().toLowerCase();
    return this.allItems.filter((item) => {
      const categoryMatches = this.category === "all" || item.category === this.category;
      if (!categoryMatches) return false;
      if (!query) return true;
      const haystack = [item.emoji, item.name, item.value, item.category, ...item.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  private get selectedItem(): LoomiEmojiItem | null {
    if (!this.selectedValue) return null;
    const match = this.allItems.find(
      (item) =>
        item.value === this.selectedValue ||
        item.emoji === this.selectedValue ||
        item.skins?.includes(this.selectedValue),
    );
    if (match) {
      // A toned variant isn't `match`'s own emoji/value - keep its name but show the
      // exact glyph the user picked.
      return match.emoji === this.selectedValue || match.value === this.selectedValue
        ? match
        : { ...match, emoji: this.selectedValue, value: this.selectedValue };
    }
    return {
      emoji: this.selectedValue,
      name: this.selectedValue,
      value: this.selectedValue,
      category: "custom",
      keywords: [],
    };
  }

  private get supportsSkinTones(): boolean {
    return this.allItems.some((item) => item.skins?.length);
  }

  private applyTone(item: LoomiEmojiItem): LoomiEmojiItem {
    const toned = this.skinTone > 0 ? item.skins?.[this.skinTone - 1] : undefined;
    return toned ? { ...item, emoji: toned, value: toned } : item;
  }

  private syncValidity(showInvalid = this.validationVisible): boolean {
    const valueMissing = this.required && !this.disabled && !this.readonly && !this.selectedValue;
    this.invalid = valueMissing && showInvalid;
    this.internals.setValidity(
      valueMissing ? { valueMissing: true } : {},
      valueMissing ? loomiT("validation.requiredField", {}, this.locale) : "",
    );
    return !valueMissing;
  }

  private onPopoverToggle(event: CustomEvent<{ open: boolean }>): void {
    this.open = event.detail.open;
    if (this.open) {
      this.clampActive();
      if (this.searchable) this.updateComplete.then(() => this.searchEl?.focus());
    } else {
      this.search = "";
      this.closeToneMenu();
      this.validate();
    }
  }

  private toggleToneMenu(): void {
    if (this.toneMenuOpen) this.closeToneMenu();
    else this.openToneMenu();
  }

  private openToneMenu(): void {
    if (this.toneMenuOpen) return;
    this.toneMenuOpen = true;
    this.updateComplete.then(() => {
      if (this.toneMenuEl)
        this.toneMenuCleanup = onClickOutside(this.toneMenuEl, () => this.closeToneMenu());
    });
  }

  private closeToneMenu(): void {
    if (!this.toneMenuOpen) return;
    this.toneMenuOpen = false;
    this.toneMenuCleanup?.();
    this.toneMenuCleanup = undefined;
  }

  private chooseTone(tone: number): void {
    this.skinTone = tone;
    persistSkinTone(tone);
    this.closeToneMenu();
  }

  private onFocusOut(): void {
    if (!this.open) this.validate();
  }

  private clampActive(): void {
    const total = this.visibleItems.length;
    this.activeIndex = total ? Math.min(Math.max(this.activeIndex, 0), total - 1) : -1;
  }

  private setSearch(value: string): void {
    this.search = value;
    this.activeIndex = this.visibleItems.length ? 0 : -1;
  }

  private setCategory(category: LoomiEmojiCategory): void {
    this.category = category;
    this.search = "";
    this.activeIndex = this.visibleItems.length ? 0 : -1;
    if (this.searchable) this.updateComplete.then(() => this.searchEl?.focus());
  }

  private choose(item: LoomiEmojiItem): void {
    if (this.disabled || this.readonly) return;
    this.selectedValue = item.value;
    this.validationVisible = true;
    this.syncValidity(true);
    const detail = {
      value: item.value,
      emoji: item.emoji,
      name: item.name,
      category: item.category,
      item,
    };
    this.dispatchEvent(
      new CustomEvent("loomi-emoji-select", { bubbles: true, composed: true, detail }),
    );
    this.emitChange(item);
    if (!this.inline) this.popoverEl?.hide();
  }

  private emitChange(item: LoomiEmojiItem | null): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, emoji: item?.emoji ?? "", item },
      }),
    );
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.toneMenuOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.closeToneMenu();
      }
      return;
    }
    const isOpen = this.open || this.inline;
    if (!this.inline && !isOpen && event.key === "ArrowDown") {
      event.preventDefault();
      this.popoverEl?.show();
      return;
    }
    if (!isOpen) return;
    const items = this.visibleItems;
    if (!items.length && event.key !== "Escape") return;
    const move = (next: number) => {
      event.preventDefault();
      this.activeIndex = (next + items.length) % items.length;
    };
    if (event.key === "ArrowRight" || event.key === "ArrowDown") move(this.activeIndex + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") move(this.activeIndex - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[this.activeIndex >= 0 ? this.activeIndex : 0];
      if (item) this.choose(this.applyTone(item));
    } else if (event.key === "Escape" && !this.inline) {
      event.preventDefault();
      this.popoverEl?.hide();
    }
  }

  private categoryLabel(category: LoomiEmojiCategory): string {
    return CATEGORY_LABELS[category] ?? category.replace(/[-_]/g, " ");
  }

  private renderPanelBody(): TemplateResult {
    const items = this.visibleItems;
    const activeId = this.activeIndex >= 0 ? `loomi-emoji-${this.activeIndex}` : "";
    const searchPlaceholder = loomiDefaultText(
      DEFAULT_SEARCH_PLACEHOLDER,
      DEFAULT_SEARCH_PLACEHOLDER,
      "emojiPicker.searchPlaceholder",
      this.locale,
    );
    return html`${
      this.searchable
        ? html`<div class="loomi-search-row">
            <input
              class="loomi-search"
              type="search"
              autocomplete="off"
              spellcheck="false"
              aria-label=${searchPlaceholder}
              aria-activedescendant=${activeId || nothing}
              placeholder=${searchPlaceholder}
              .value=${this.search}
              @input=${(event: Event) => this.setSearch((event.target as HTMLInputElement).value)}
            />
            ${this.supportsSkinTones ? this.renderTonePicker() : nothing}
          </div>`
        : nothing
    }
      ${
        this.showCategories
          ? html`<div class="loomi-categories" aria-label="Emoji categories">
            ${this.categories.map(
              (category) => html`<button
              class="loomi-category ${this.category === category ? "active" : ""}"
              type="button"
              title=${this.categoryLabel(category)}
              aria-label=${this.categoryLabel(category)}
              aria-pressed=${this.category === category ? "true" : "false"}
              @click=${() => this.setCategory(category)}
            >${CATEGORY_ICONS[category] ?? "•"}</button>`,
            )}
          </div>`
          : nothing
      }
      ${
        items.length
          ? html`<div
            class="loomi-grid"
            role="listbox"
            aria-activedescendant=${!this.searchable ? activeId || nothing : nothing}
            aria-label=${loomiT("emojiPicker.dialog", {}, this.locale)}
          >
            ${items.map((item, index) => {
              const display = this.applyTone(item);
              const family = item.skins
                ? [item.value, item.emoji, ...item.skins]
                : [item.value, item.emoji];
              const selected = family.includes(this.selectedValue);
              return html`<button
                id=${`loomi-emoji-${index}`}
                class="loomi-option ${index === this.activeIndex ? "active" : ""} ${selected ? "selected" : ""}"
                type="button"
                role="option"
                aria-label=${item.name}
                aria-selected=${selected ? "true" : "false"}
                title=${item.name}
                @mouseenter=${() => (this.activeIndex = index)}
                @click=${() => this.choose(display)}
              >${display.emoji}</button>`;
            })}
          </div>`
          : html`<div class="loomi-empty">${loomiDefaultText(this.emptyText, DEFAULT_EMPTY_TEXT, "emojiPicker.emptyText", this.locale)}</div>`
      }`;
  }

  private renderTonePicker(): TemplateResult {
    const toneLabel = (tone: number) => loomiT(SKIN_TONE_LABEL_KEYS[tone], {}, this.locale);
    return html`<div class="loomi-tone-picker">
      <button
        type="button"
        class="loomi-tone-trigger"
        aria-label=${loomiT("emojiPicker.skinTone", {}, this.locale)}
        aria-haspopup="true"
        aria-expanded=${this.toneMenuOpen ? "true" : "false"}
        title=${loomiT("emojiPicker.skinTone", {}, this.locale)}
        @click=${() => this.toggleToneMenu()}
      >${SKIN_TONE_HAND[this.skinTone]}</button>
      ${
        this.toneMenuOpen
          ? html`<div class="loomi-tone-menu" role="menu" aria-label=${loomiT("emojiPicker.skinTone", {}, this.locale)}>
            ${SKIN_TONE_HAND.map(
              (hand, tone) => html`<button
              type="button"
              role="menuitemradio"
              class="loomi-tone-option ${this.skinTone === tone ? "active" : ""}"
              aria-checked=${this.skinTone === tone ? "true" : "false"}
              aria-label=${toneLabel(tone)}
              title=${toneLabel(tone)}
              @click=${() => this.chooseTone(tone)}
            >${hand}</button>`,
            )}
          </div>`
          : nothing
      }
    </div>`;
  }

  override render(): TemplateResult {
    const selected = this.selectedItem;
    const placeholder = loomiDefaultText(
      this.placeholder,
      DEFAULT_PLACEHOLDER,
      "emojiPicker.placeholder",
      this.locale,
    );
    const triggerLabel = selected?.name ?? placeholder;

    return html`<div
      class="loomi-emoji-picker size-${this.size} ${this.inline ? "inline" : ""}"
      @keydown=${this.onKeydown}
      @focusout=${this.onFocusOut}
    >
      ${this.label ? html`<span class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req"> *</span>` : nothing}</span>` : nothing}
      ${
        this.inline
          ? html`<div class="loomi-emoji-panel" part="panel">${this.renderPanelBody()}</div>`
          : html`<loomi-popover
            class="loomi-emoji-popover"
            position="bottom"
            .width=${PANEL_WIDTH_PX[this.size]}
            .disabled=${this.disabled || this.readonly}
            @loomi-toggle=${this.onPopoverToggle}
          >
            <span
              slot="trigger"
              class="loomi-emoji-trigger ${this.showText ? "with-text" : ""}"
              aria-label=${triggerLabel}
            >
              <span aria-hidden="true">${selected?.emoji ?? "☺"}</span>
              ${
                this.showText
                  ? html`<span class="loomi-value ${selected ? "" : "placeholder"}" aria-hidden="true">${triggerLabel}</span>`
                  : nothing
              }
            </span>
            ${this.open ? this.renderPanelBody() : nothing}
          </loomi-popover>`
      }
      ${this.invalid ? html`<div class="loomi-error">${loomiT("validation.requiredField", {}, this.locale)}</div>` : nothing}
    </div>`;
  }
}

export interface LoomiEmojiSelectDetail {
  value: string;
  emoji: string;
  name: string;
  category: LoomiEmojiCategory;
  item: LoomiEmojiItem;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-emoji-picker": LoomiEmojiPicker;
  }

  interface HTMLElementEventMap {
    "loomi-emoji-select": CustomEvent<LoomiEmojiSelectDetail>;
  }
}
