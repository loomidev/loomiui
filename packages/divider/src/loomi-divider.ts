import { html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiDividerOrientation = "horizontal" | "vertical";
export type LoomiDividerAlign = "start" | "center" | "end";
export type LoomiDividerVariant = "solid" | "dashed" | "dotted";

/**
 * `<loomi-divider>` — a content divider that can separate sections horizontally
 * or vertically, with optional text/content centered in the rule.
 *
 * @slot - Optional divider content.
 */
@customElement("loomi-divider")
export class LoomiDivider extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true }) orientation: LoomiDividerOrientation = "horizontal";
  @property() align: LoomiDividerAlign = "center";
  @property() variant: LoomiDividerVariant = "solid";
  @property() label = "";
  @property() color: LoomiColor = "gray" as LoomiColor;
  @property() thickness = "1px";
  @property() spacing = "0.75rem";

  @state() private hasSlottedContent = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncSlottedContent();
  }

  private syncSlottedContent = (): void => {
    this.hasSlottedContent = Array.from(this.childNodes).some((node) => {
      if (node.nodeType === 3) return !!node.textContent?.trim();
      return true;
    });
  };

  private get hasContent(): boolean {
    return !!this.label || this.hasSlottedContent;
  }

  private get dividerStyle(): string {
    return [
      accentVars(this.color),
      `--_loomi-divider-thickness:${this.thickness}`,
      `--_loomi-divider-spacing:${this.spacing}`,
      "",
    ].join(";");
  }

  override render(): TemplateResult {
    const orientation = this.orientation === "vertical" ? "vertical" : "horizontal";
    const align = this.align === "start" || this.align === "end" ? this.align : "center";
    const variant = this.variant === "dashed" || this.variant === "dotted" ? this.variant : "solid";

    return html`<div
      class="loomi-divider ${orientation} align-${align} ${variant} ${this.hasContent ? "with-content" : "empty"}"
      style=${this.dividerStyle}
      role="separator"
      aria-orientation=${orientation}
    >
      <span class="loomi-line" aria-hidden="true"></span>
      ${
        this.hasContent
          ? html`<span class="loomi-content"><slot @slotchange=${this.syncSlottedContent}>${this.label}</slot></span>
            <span class="loomi-line" aria-hidden="true"></span>`
          : html`<slot @slotchange=${this.syncSlottedContent}></slot>`
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-divider": LoomiDivider;
  }
}
