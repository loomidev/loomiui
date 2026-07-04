import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-listitem>` — a single stackable list row.
 * @slot - Row content.
 */
export class LoomiListitem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Boolean, attribute: "as-flex", reflect: true }) asFlex = false;

  override render(): TemplateResult {
    return html`<div class="loomi-li" role="listitem"><slot></slot></div>`;
  }
}

customElements.define("loomi-listitem", LoomiListitem);

/** Alias of `LoomiListitem` registered under `<loomi-listview-item>`. The Custom Elements
 * registry rejects registering one constructor under two tag names, so this subclass
 * exists purely to give the alias its own constructor identity. */
export class LoomiListviewItem extends LoomiListitem {}
customElements.define("loomi-listview-item", LoomiListviewItem);

declare global {
  interface HTMLElementTagNameMap {
    "loomi-listitem": LoomiListitem;
    "loomi-listview-item": LoomiListviewItem;
  }
}
