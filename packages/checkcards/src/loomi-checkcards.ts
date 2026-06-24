import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;

/**
 * `<loomi-checkcard>` — a single selectable card. Use inside `<loomi-checkcards>`.
 * @slot - Card body content.
 */
@customElement("loomi-checkcard")
export class LoomiCheckcard extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() value = "";
  @property() title = "";
  @property() icon = "";
  @property() avatar = "";
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean }) compact = false;
  @property() radius: "none" | "small" | "medium" | "full" = "medium";
  @property({ attribute: "align-items" }) alignItems: "top" | "center" = "top";

  private media(): TemplateResult | typeof nothing {
    if (this.avatar) {
      return this.avatar.length <= 3
        ? html`<span class="loomi-avatar">${this.avatar}</span>`
        : html`<img class="loomi-avatar" src=${this.avatar} alt="" />`;
    }
    if (this.icon && getLoomiIcon(this.icon)) {
      return html`<span class="loomi-media"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${getLoomiIcon(this.icon)}</svg></span>`;
    }
    return nothing;
  }

  override render(): TemplateResult {
    return html`<div
      class="loomi-card r-${this.radius} ${this.compact ? "compact" : ""} ${this.alignItems === "center" ? "center" : ""}"
      role="checkbox"
      aria-checked=${this.selected ? "true" : "false"}
      @click=${() => this.dispatchEvent(new CustomEvent("loomi-checkcard-click", { bubbles: true, composed: true, detail: { value: this.value } }))}
    >
      <svg class="loomi-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${CHECK}</svg>
      ${this.media()}
      <div class="loomi-body">
        ${this.title ? html`<div class="loomi-title">${this.title}</div>` : nothing}
        <div class="loomi-content"><slot></slot></div>
      </div>
    </div>`;
  }
}

/**
 * `<loomi-checkcards>` — selectable cards (a prettier checkbox/radio group).
 * Form-associated: submits selected values (comma-joined) under `name`.
 *
 * @slot - `<loomi-checkcard>` children.
 * @fires change - `detail: { values }` when the selection changes.
 */
@customElement("loomi-checkcards")
export class LoomiCheckcards extends LitElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property({ type: Number }) max = 1;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ attribute: "border-color" }) borderColor: LoomiColor | "" = "";
  @property({ type: Number, attribute: "border-width" }) borderWidth = 2;
  @property() radius: "none" | "small" | "medium" | "full" = "medium";
  @property({ type: Boolean }) compact = false;
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property({ type: Boolean, attribute: "auto-select-new" }) autoSelectNew = true;
  @property({ attribute: "align-items" }) alignItems: "top" | "center" = "top";

  private selected: string[] = [];
  private initialized = false;

  private get cards(): LoomiCheckcard[] {
    return Array.from(this.querySelectorAll("loomi-checkcard"));
  }

  override willUpdate(): void {
    if (!this.initialized) {
      this.selected = this.selectedValue ? this.selectedValue.split(",").map((s) => s.trim()).filter(Boolean) : [];
      this.initialized = true;
    }
    this.internals.setFormValue(this.selected.join(","));
  }

  private sync(): void {
    for (const card of this.cards) {
      card.selected = this.selected.includes(card.value);
      card.compact = this.compact;
      card.radius = this.radius;
      card.alignItems = this.alignItems;
    }
  }

  override firstUpdated(): void {
    this.sync();
  }

  private onCardClick = (e: Event): void => {
    const value = (e as CustomEvent).detail.value as string;
    const has = this.selected.includes(value);
    if (has) {
      this.selected = this.selected.filter((v) => v !== value);
    } else if (this.max === 1) {
      this.selected = [value];
    } else if (this.selected.length < this.max) {
      this.selected = [...this.selected, value];
    } else if (this.autoSelectNew) {
      this.selected = [...this.selected.slice(1), value];
    } else {
      return; // blocked
    }
    this.internals.setFormValue(this.selected.join(","));
    this.sync();
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { values: [...this.selected] } }));
  };

  override render(): TemplateResult {
    const accent = accentVars(this.borderColor || this.color);
    return html`<div class="loomi-cards" style=${accent + `--loomi-cc-border:${this.borderWidth}px`} @loomi-checkcard-click=${this.onCardClick}>
      <slot @slotchange=${() => this.sync()}></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-checkcards": LoomiCheckcards;
    "loomi-checkcard": LoomiCheckcard;
  }
}
