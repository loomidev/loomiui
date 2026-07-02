import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiCardSize = "default" | "sm";

/**
 * `<loomi-card>` — shadcn/ui-style card root. Compose with the `loomi-card-*` parts.
 *
 * @slot - Card sections (`loomi-card-header`, `loomi-card-content`, `loomi-card-footer`, …).
 */
@customElement("loomi-card")
export class LoomiCard extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true }) size: LoomiCardSize = "default";
  @property() url = "";
  @property({ type: Boolean, attribute: "has-hover" }) hasHover = false;

  private onClick = (): void => {
    if (!this.url) return;
    if (/^https?:\/\//.test(this.url)) window.open(this.url, "_blank");
    else if (/\)$/.test(this.url)) new Function(this.url)();
    else location.href = this.url;
  };

  private onKeydown = (event: KeyboardEvent): void => {
    if (!this.url) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.onClick();
    }
  };

  override render(): TemplateResult {
    const cls = ["card", this.url ? "clickable" : "", this.hasHover ? "hover" : ""]
      .filter(Boolean)
      .join(" ");
    return html`<div
      class=${cls}
      role=${this.url ? "link" : nothing}
      tabindex=${this.url ? "0" : nothing}
      @click=${this.url ? this.onClick : nothing}
      @keydown=${this.url ? this.onKeydown : nothing}
    ><slot></slot></div>`;
  }
}

/**
 * `<loomi-card-header>` — title, description, and optional action region.
 *
 * @slot - `loomi-card-title`, `loomi-card-description`, and/or `loomi-card-action`.
 */
@customElement("loomi-card-header")
export class LoomiCardHeader extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  override render(): TemplateResult {
    return html`<div class="header" data-slot="card-header"><slot></slot></div>`;
  }
}

/**
 * `<loomi-card-title>` — card heading.
 *
 * @slot - Title text.
 */
@customElement("loomi-card-title")
export class LoomiCardTitle extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  override render(): TemplateResult {
    return html`<div class="title" data-slot="card-title"><slot></slot></div>`;
  }
}

/**
 * `<loomi-card-description>` — helper text under the title.
 *
 * @slot - Description text.
 */
@customElement("loomi-card-description")
export class LoomiCardDescription extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  override render(): TemplateResult {
    return html`<div class="description" data-slot="card-description"><slot></slot></div>`;
  }
}

/**
 * `<loomi-card-action>` — top-right header action (button, badge, link, …).
 *
 * @slot - Action content.
 */
@customElement("loomi-card-action")
export class LoomiCardAction extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  override render(): TemplateResult {
    return html`<div class="action" data-slot="card-action"><slot></slot></div>`;
  }
}

/**
 * `<loomi-card-content>` — main card body.
 *
 * @slot - Card content.
 */
@customElement("loomi-card-content")
export class LoomiCardContent extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  override render(): TemplateResult {
    return html`<div class="content" data-slot="card-content"><slot></slot></div>`;
  }
}

/**
 * `<loomi-card-footer>` — actions and secondary content at the bottom.
 *
 * @slot - Footer content.
 */
@customElement("loomi-card-footer")
export class LoomiCardFooter extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  override render(): TemplateResult {
    return html`<div class="footer" data-slot="card-footer"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-card": LoomiCard;
    "loomi-card-header": LoomiCardHeader;
    "loomi-card-title": LoomiCardTitle;
    "loomi-card-description": LoomiCardDescription;
    "loomi-card-action": LoomiCardAction;
    "loomi-card-content": LoomiCardContent;
    "loomi-card-footer": LoomiCardFooter;
  }
}
