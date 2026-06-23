import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTooltipPosition = "top" | "bottom" | "left" | "right";

/**
 * `<loomi-tooltip>` — shows a tooltip on hover/focus of its trigger content.
 *
 * @slot - The trigger element(s).
 * @slot content - Rich tooltip content (overrides the `content` attribute).
 */
@customElement("loomi-tooltip")
export class LoomiTooltip extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() content = "";
  @property() position: LoomiTooltipPosition = "top";

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <span class="loomi-tip pos-${this.position}" role="tooltip">
        <slot name="content">${this.content}</slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tooltip": LoomiTooltip;
  }
}
