import { html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTooltipPlacement = "top" | "bottom" | "left" | "right";
export type LoomiTooltipShade = "dark" | "light";

/**
 * `<loomi-tooltip>` — shows a tooltip on hover/focus of its trigger content.
 *
 * @slot - The trigger element(s).
 * @slot content - Rich tooltip content (overrides the `content` attribute).
 */
@customElement("loomi-tooltip")
export class LoomiTooltip extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() content = "";
  @property() placement: LoomiTooltipPlacement = "top";
  @property({ reflect: true }) shade: LoomiTooltipShade = "dark";

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <span class="loomi-tip placement-${this.placement}" role="tooltip">
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
