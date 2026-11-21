import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, type LoomiSize, type LoomiSizeSupport } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/** The part of the canonical size scale a card supports. */
const CARD_SIZES = ["small", "regular"] as const satisfies readonly LoomiSize[];

/**
 * Lit's default `type: Boolean` converter treats ANY attribute presence — including the
 * literal string `"false"` — as `true` (`fromAttribute: (v) => v !== null`), so
 * `has-shadow="false"` written as plain HTML markup would silently do nothing. This
 * converter honors a literal `"false"` while keeping the usual presence-based
 * `toAttribute` semantics for default-true boolean properties.
 */
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-card>` — shadcn/ui-style card root. Compose with the `loomi-card-*` parts.
 *
 * @slot - Card sections (`loomi-card-header`, `loomi-card-content`, `loomi-card-footer`, …).
 */
@customElement("loomi-card")
export class LoomiCard extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Size names this component supports, from the canonical `LoomiSize` scale. */
  static readonly supportedSizes = { size: CARD_SIZES } satisfies LoomiSizeSupport;

  /** Section spacing: `small` | `regular`. */
  @property({ reflect: true }) size: LoomiSize = "regular";
  /**
   * Make the whole card a real link. Links inside the card still work on their own.
   * Absolute `http(s)` URLs open in a new tab unless `target` says otherwise.
   */
  @property() url = "";
  /** Link target for `url`. Defaults to `_blank` for absolute `http(s)` URLs, else the same tab. */
  @property() target = "";
  @property({ type: Boolean, attribute: "has-hover" }) hasHover = false;
  @property({ type: Boolean, attribute: "has-shadow", converter: booleanAttribute }) hasShadow =
    true;
  @property({ type: Boolean, attribute: "has-border", converter: booleanAttribute }) hasBorder =
    true;
  @property({ type: Boolean, reflect: true }) transparent = false;

  /** The effective link target: explicit `target`, else a new tab for absolute URLs. */
  get linkTarget(): string {
    return this.target || (/^https?:\/\//i.test(this.url) ? "_blank" : "");
  }

  override render(): TemplateResult {
    const cls = [
      "card",
      this.hasBorder ? "bordered" : "",
      this.hasShadow ? "shadow" : "",
      this.transparent ? "transparent" : "",
      this.url ? "clickable" : "",
      this.hasHover ? "hover" : "",
    ]
      .filter(Boolean)
      .join(" ");
    // A real anchor, so the card opens in a new tab, shows its URL and needs no script.
    // Links and buttons slotted inside keep their own behaviour: the browser activates the
    // innermost one, and the shadow boundary keeps the nesting valid.
    if (this.url) {
      const target = this.linkTarget;
      return html`<a
        class=${cls}
        part="link"
        href=${this.url}
        target=${target || nothing}
        rel=${target === "_blank" ? "noopener noreferrer" : nothing}
      ><slot></slot></a>`;
    }
    return html`<div class=${cls}><slot></slot></div>`;
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
