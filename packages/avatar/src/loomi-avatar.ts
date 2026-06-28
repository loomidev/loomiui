import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, cssColor, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiAvatarSize =
  | "tiny" | "small" | "medium" | "regular" | "big" | "huge" | "omg";

/**
 * `<loomi-avatar>` — a rounded image or initials avatar with optional status dot.
 * Wrap several in `<loomi-avatars>` to stack them.
 */
@customElement("loomi-avatar")
export class LoomiAvatar extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() image = "";
  @property() alt = "avatar";
  @property() label = "";
  @property({ reflect: true }) size: LoomiAvatarSize = "regular";
  @property({ type: Boolean }) dotted = false;
  @property({ attribute: "dot-color" }) dotColor: LoomiColor = "green" as LoomiColor;
  @property({ attribute: "dot-position" }) dotPosition: "top" | "bottom" = "bottom";
  @property({ attribute: "bg-color" }) bgColor: LoomiColor = "gray" as LoomiColor;
  @property({ type: Boolean, attribute: "show-ring" }) showRing = true;

  override render(): TemplateResult {
    const useImage = this.image && this.image.length > 3;
    const inner = useImage
      ? html`<img src=${this.image} alt=${this.alt} />`
      : html`<span class="loomi-label">${this.label || this.image || "?"}</span>`;
    return html`<span
      class="loomi-av size-${this.size} ${this.showRing ? "ring" : ""}"
      style=${accentVars(this.bgColor)}
    >
      ${inner}
      ${this.dotted
        ? html`<span class="loomi-dot ${this.dotPosition}" style="background:${cssColor(this.dotColor, 500)}"></span>`
        : nothing}
    </span>`;
  }
}

/**
 * `<loomi-avatars>` — a group/stack of `<loomi-avatar>` children, with an optional
 * "+N" bubble.
 *
 * @slot - `<loomi-avatar>` children.
 */
@customElement("loomi-avatars")
export class LoomiAvatars extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) stacked = false;
  @property({ type: Boolean }) dotted = false;
  @property({ attribute: "dot-color" }) dotColor: LoomiColor = "green" as LoomiColor;
  @property({ attribute: "dot-position" }) dotPosition: "top" | "bottom" = "bottom";
  @property({ type: Number }) plus = 0;
  @property({ reflect: true }) size: LoomiAvatarSize = "regular";

  private syncChildren = (): void => {
    if (this.plus > 0) this.stacked = true;
    const hasGroupDotColor = this.hasAttribute("dot-color") || this.dotColor !== "green";
    const hasGroupDotPosition = this.hasAttribute("dot-position") || this.dotPosition !== "bottom";

    this.querySelectorAll("loomi-avatar").forEach((avatar) => {
      avatar.setAttribute("size", this.size);
      if (this.dotted) avatar.setAttribute("dotted", "");
      if (hasGroupDotColor && !avatar.hasAttribute("dot-color")) {
        avatar.setAttribute("dot-color", this.dotColor);
      }
      if (hasGroupDotPosition && !avatar.hasAttribute("dot-position")) {
        avatar.setAttribute("dot-position", this.dotPosition);
      }
    });
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncChildren();
  }

  override updated(): void {
    this.syncChildren();
  }

  override render(): TemplateResult {
    return html`<span class="loomi-row size-${this.size}">
      <slot @slotchange=${this.syncChildren}></slot>
      ${this.plus > 0
        ? html`<span class="loomi-plus" part="plus">+${this.plus}</span>`
        : nothing}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-avatar": LoomiAvatar;
    "loomi-avatars": LoomiAvatars;
  }
}
