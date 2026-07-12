import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

const CHEVRON = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />`;

/**
 * `<loomi-accordion-item>` — a single collapsible section. Use inside `<loomi-accordion>`.
 *
 * @slot - The collapsible body.
 * @slot title - Custom title content (overrides the `title` attribute).
 * @fires loomi-accordion-toggle - Fired when toggled (the parent uses it to coordinate).
 */
@customElement("loomi-accordion-item")
export class LoomiAccordionItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) open = false;
  @property() title = "";
  @property() color: LoomiColor | "" = "";
  @property({ type: Boolean, reflect: true, attribute: "no-padding" }) noPadding = false;
  /** Set by the parent: true => standalone card styling. */
  @property({ type: Boolean, reflect: true }) standalone = false;

  private toggle = (): void => {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent("loomi-accordion-toggle", { bubbles: true, composed: true }),
    );
  };

  override render(): TemplateResult {
    return html`<div class="loomi-shell" style=${this.color ? accentVars(this.color) : nothing}>
      <button class="loomi-head" aria-expanded=${this.open ? "true" : "false"} @click=${this.toggle}>
        <span class="loomi-title"><slot name="title">${this.title}</slot></span>
        <svg class="loomi-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${CHEVRON}</svg>
      </button>
      <div class="loomi-content">
        <div><div class="loomi-inner"><slot></slot></div></div>
      </div>
    </div>`;
  }
}

/**
 * `<loomi-accordion>` — groups `<loomi-accordion-item>` children. By default only one
 * item stays open at a time.
 *
 * @slot - `<loomi-accordion-item>` children.
 */
@customElement("loomi-accordion")
export class LoomiAccordion extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean }) grouped = true;
  @property({ type: Boolean, attribute: "can-open-multiple" }) canOpenMultiple = false;
  @property() color: LoomiColor | "" = "";

  private get items(): LoomiAccordionItem[] {
    return Array.from(this.querySelectorAll("loomi-accordion-item"));
  }

  private sync = (): void => {
    for (const item of this.items) {
      item.standalone = !this.grouped;
      if (!item.hasAttribute("color")) item.color = this.color;
    }
  };

  override firstUpdated(): void {
    this.sync();
  }
  override updated(): void {
    this.sync();
  }

  private onToggle = (e: Event): void => {
    const item = e.target as LoomiAccordionItem;
    if (item.open && !this.canOpenMultiple) {
      for (const other of this.items) if (other !== item) other.open = false;
    }
  };

  override render(): TemplateResult {
    return html`<div
      class="loomi-accordion ${this.grouped ? "grouped" : "ungrouped"}"
      @loomi-accordion-toggle=${this.onToggle}
    >
      <slot @slotchange=${this.sync}></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-accordion": LoomiAccordion;
    "loomi-accordion-item": LoomiAccordionItem;
  }

  interface HTMLElementEventMap {
    "loomi-accordion-toggle": CustomEvent<null>;
  }
}
