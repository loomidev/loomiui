import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  LoomiElement,
  fieldStyles,
  findMentionTrigger,
  loomiT,
  onClickOutside,
  themeStyles,
  type LoomiFieldLabelPosition,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export interface LoomiMentionItem {
  label: string;
  value?: string;
  description?: string;
  image?: string;
}

export type LoomiTextareaVariant = "default" | "minimal";
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-textarea>` — a themeable multi-line text input with a floating label
 * and inline validation. Form-associated: its value submits with the form.
 *
 * Set `mention-triggers` (e.g. `["@", "#", "/"]`) and `mentionData` (a map of
 * trigger -> `LoomiMentionItem[]`) to enable an inline mention/autocomplete picker
 * that opens as the user types a trigger character.
 *
 * @csspart field - The bordered container.
 * @csspart textarea - The native `<textarea>`.
 * @csspart mention-panel - The mention picker dropdown.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 * @fires loomi-mention-search - `detail: { trigger, query }` as the user types after a trigger char.
 * @fires loomi-mention-select - `detail: { trigger, item }` when a mention item is chosen.
 */
@customElement("loomi-textarea")
export class LoomiTextarea extends LoomiElement {
  static override styles = [themeStyles, fieldStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private cleanupMentionOutside?: () => void;

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property({ attribute: "label-position", reflect: true })
  labelPosition: LoomiFieldLabelPosition = "default";
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
  @property({ type: Boolean, attribute: "show-focus-ring", converter: booleanAttribute })
  showFocusRing = true;
  @property() variant: LoomiTextareaVariant = "default";
  /** Characters that open the mention picker, e.g. `["@", "#", "/"]`. Empty disables it. */
  @property({ type: Array, attribute: "mention-triggers" }) mentionTriggers: string[] = [];
  /** Items per trigger character, e.g. `{ "@": [{ label: "Jane" }] }`. */
  @property({ type: Object, attribute: "mention-data" }) mentionData: Record<
    string,
    LoomiMentionItem[]
  > = {};

  @state() private mentionOpen = false;
  @state() private mentionTrigger = "";
  @state() private mentionStart = -1;
  @state() private mentionQuery = "";
  @state() private mentionActiveIndex = -1;
  @state() private mentionPos = { top: 0, left: 0 };

  @query("textarea") private textareaEl!: HTMLTextAreaElement;
  @query(".loomi-mention-mirror") private mirrorEl?: HTMLDivElement;

  override willUpdate(): void {
    this.internals.setFormValue(this.value);
    this.syncValidity();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupMentionOutside?.();
  }

  override focus(): void {
    this.textareaEl?.focus();
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
    const empty = this.required && !this.disabled && !this.readonly && this.value.trim() === "";
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty
      ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale)
      : "";
    if (this.textareaEl) this.internals.setValidity(validity, message, this.textareaEl);
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

  private get mentionItems(): LoomiMentionItem[] {
    const items = this.mentionData[this.mentionTrigger] ?? [];
    if (!this.mentionQuery) return items;
    const q = this.mentionQuery.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }

  private detectMention(caret: number): void {
    if (!this.mentionTriggers.length) return;
    const match = findMentionTrigger(this.value, caret, this.mentionTriggers);
    if (!match) {
      this.closeMention();
      return;
    }
    this.mentionTrigger = match.trigger;
    this.mentionStart = match.start;
    this.mentionQuery = match.query;
    this.mentionActiveIndex = 0;
    if (!this.mentionOpen) {
      this.mentionOpen = true;
      const cleanupOutside = onClickOutside(this, () => this.closeMention());
      const onScroll = () => this.closeMention();
      window.addEventListener("scroll", onScroll, { capture: true, passive: true });
      this.cleanupMentionOutside = () => {
        cleanupOutside();
        window.removeEventListener("scroll", onScroll, { capture: true });
      };
    }
    this.dispatchEvent(
      new CustomEvent("loomi-mention-search", {
        bubbles: true,
        composed: true,
        detail: { trigger: match.trigger, query: match.query },
      }),
    );
    void this.updateComplete.then(() => this.positionMentionPanel());
  }

  private closeMention(): void {
    if (!this.mentionOpen) return;
    this.mentionOpen = false;
    this.mentionStart = -1;
    this.mentionQuery = "";
    this.mentionActiveIndex = -1;
    this.cleanupMentionOutside?.();
    this.cleanupMentionOutside = undefined;
  }

  private positionMentionPanel(): void {
    if (!this.mentionOpen || !this.mirrorEl || !this.textareaEl) return;
    const caret = this.mentionStart + this.mentionTrigger.length + this.mentionQuery.length;
    const mirror = this.mirrorEl;
    mirror.textContent = this.value.slice(0, caret);
    const marker = document.createElement("span");
    marker.textContent = this.value.slice(caret) || ".";
    mirror.appendChild(marker);
    const taRect = this.textareaEl.getBoundingClientRect();
    const lineHeight = parseFloat(getComputedStyle(this.textareaEl).lineHeight) || 20;
    const top = taRect.top + marker.offsetTop - this.textareaEl.scrollTop + lineHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth || 800;
    const rawLeft = taRect.left + marker.offsetLeft - this.textareaEl.scrollLeft;
    const left = Math.min(rawLeft, Math.max(0, vw - 220));
    mirror.textContent = "";
    this.mentionPos = { top, left };
  }

  private chooseMention(item: LoomiMentionItem): void {
    const trigger = this.mentionTrigger;
    const start = this.mentionStart;
    const caret = start + trigger.length + this.mentionQuery.length;
    const insertText = `${trigger}${item.label} `;
    this.value = this.value.slice(0, start) + insertText + this.value.slice(caret);
    const newCaret = start + insertText.length;
    this.closeMention();
    this.dispatchEvent(
      new CustomEvent("loomi-mention-select", {
        bubbles: true,
        composed: true,
        detail: { trigger, item },
      }),
    );
    this.emit("input");
    void this.updateComplete.then(() => {
      this.textareaEl.focus();
      this.textareaEl.setSelectionRange(newCaret, newCaret);
    });
  }

  private onInput = (e: Event): void => {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    if (this.invalid) this.validate();
    if (this.mentionTriggers.length) this.detectMention(target.selectionStart);
    this.emit("input");
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (!this.mentionOpen) return;
    const items = this.mentionItems;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this.closeMention();
        break;
      case "ArrowDown":
        e.preventDefault();
        this.mentionActiveIndex = items.length ? (this.mentionActiveIndex + 1) % items.length : -1;
        break;
      case "ArrowUp":
        e.preventDefault();
        this.mentionActiveIndex = items.length
          ? (this.mentionActiveIndex - 1 + items.length) % items.length
          : -1;
        break;
      case "Enter":
      case "Tab":
        if (this.mentionActiveIndex >= 0 && items[this.mentionActiveIndex]) {
          e.preventDefault();
          this.chooseMention(items[this.mentionActiveIndex]);
        }
        break;
    }
  };

  private onKeyup = (e: KeyboardEvent): void => {
    if (!this.mentionTriggers.length) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
      this.detectMention((e.target as HTMLTextAreaElement).selectionStart);
    }
  };

  private renderMentionPanel(): TemplateResult {
    const items = this.mentionItems;
    return html`
      <div
        class="loomi-mention-panel"
        part="mention-panel"
        role="listbox"
        style="top:${this.mentionPos.top}px;left:${this.mentionPos.left}px"
      >
        ${
          items.length
            ? items.map(
                (item, i) => html`
                <div
                  class="loomi-mention-item ${i === this.mentionActiveIndex ? "active" : ""}"
                  role="option"
                  aria-selected=${i === this.mentionActiveIndex ? "true" : "false"}
                  @mousedown=${(e: Event) => e.preventDefault()}
                  @mouseenter=${() => (this.mentionActiveIndex = i)}
                  @click=${() => this.chooseMention(item)}
                >
                  ${item.image ? html`<img src=${item.image} alt="" />` : nothing}
                  <span class="loomi-mention-label">${item.label}</span>
                  ${item.description ? html`<span class="loomi-mention-desc">${item.description}</span>` : nothing}
                </div>
              `,
              )
            : html`<div class="loomi-mention-empty">${loomiT("mention.emptyPlaceholder", {}, this.locale)}</div>`
        }
      </div>
    `;
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const placeholderAttr = hasLabel ? " " : this.placeholder || " ";
    const showError = this.invalid && this.showErrorInline && this.errorMessage;

    return html`
      <div class="loomi-field variant-${this.variant} ${this.showFocusRing ? "" : "no-focus-ring"}" part="field">
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
          @keydown=${this.onKeydown}
          @keyup=${this.onKeyup}
          @click=${() => this.detectMention(this.textareaEl.selectionStart)}
          @change=${() => this.emit("change")}
          @blur=${this.showValidation}
        ></textarea>
        ${
          hasLabel
            ? html`<label class="loomi-label">${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label>`
            : nothing
        }
        ${this.mentionTriggers.length ? html`<div class="loomi-textarea loomi-mention-mirror" aria-hidden="true"></div>` : nothing}
        ${this.mentionOpen ? this.renderMentionPanel() : nothing}
      </div>
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

export interface LoomiTextareaMentionSearchDetail {
  trigger: string;
  query: string;
}

export interface LoomiTextareaMentionSelectDetail {
  trigger: string;
  item: LoomiMentionItem;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-textarea": LoomiTextarea;
  }

  interface HTMLElementEventMap {
    "loomi-mention-search": CustomEvent<LoomiTextareaMentionSearchDetail>;
    "loomi-mention-select": CustomEvent<LoomiTextareaMentionSelectDetail>;
  }
}
