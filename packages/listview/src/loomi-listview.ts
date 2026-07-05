import { html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-listview-item>` — a single list row. Use inside `<loomi-listview>`.
 * @slot - Row content.
 */
@customElement("loomi-listview-item")
export class LoomiListviewItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Boolean, attribute: "as-flex", reflect: true }) asFlex = false;

  override render(): TemplateResult {
    return html`<div class="loomi-li" role="listitem"><slot></slot></div>`;
  }
}

/**
 * `<loomi-listview>` — a divided list of `<loomi-listview-item>` rows.
 * @slot - `<loomi-listview-item>` children.
 */
@customElement("loomi-listview")
export class LoomiListview extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) transparent = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  private sync = (): void => {
    this.querySelectorAll("loomi-listview-item").forEach((item) => {
      (item as LoomiListviewItem).compact = this.compact;
    });
  };

  override firstUpdated(): void {
    this.sync();
  }

  override render(): TemplateResult {
    return html`<div class="loomi-listview" role="list"><slot @slotchange=${this.sync}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-listview-item": LoomiListviewItem;
    "loomi-listview": LoomiListview;
  }
}
