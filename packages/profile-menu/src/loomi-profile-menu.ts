import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LoomiElement, loomiStyles, type LoomiColor } from "@loomidev/core";
import type { LoomiAvatarSize } from "@loomidev/avatar";
import type { LoomiDropmenu } from "@loomidev/dropmenu";
import { getLoomiIcon } from "@loomidev/icons";
import "@loomidev/avatar/loomi-avatar.js";
import "@loomidev/card/loomi-card.js";
import "@loomidev/dropmenu/loomi-dropmenu.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiProfileMenuPlacement = "auto" | "left" | "right";
export type LoomiProfileMenuAvatarPosition = "left" | "right";

const CHEVRON_DOWN = getLoomiIcon("chevron-down");

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * `<loomi-profile-menu>` — a profile card trigger that opens a Loomi dropdown menu.
 *
 * Place `<loomi-dropmenu-item>` children inside for the menu actions. The trigger uses
 * `<loomi-card>` for its shell and `<loomi-avatar>` for image, status dot, pulse dot,
 * and verification badge behavior.
 *
 * @slot - `<loomi-dropmenu-item>` children.
 */
@customElement("loomi-profile-menu")
export class LoomiProfileMenu extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property() description = "";
  @property() avatar = "";
  @property({ attribute: "avatar-label" }) avatarLabel = "";
  @property({ attribute: "avatar-alt" }) avatarAlt = "";
  @property({ attribute: "avatar-size" }) avatarSize: LoomiAvatarSize = "regular";
  @property({ attribute: "avatar-bg-color" }) avatarBgColor: LoomiColor = "gray" as LoomiColor;
  @property({ attribute: "avatar-position", reflect: true })
  avatarPosition: LoomiProfileMenuAvatarPosition = "left";
  @property({ type: Boolean }) dotted = false;
  @property({ type: Boolean, attribute: "pulse-dot" }) pulseDot = false;
  @property({ attribute: "dot-color" }) dotColor: LoomiColor = "success" as LoomiColor;
  @property({ attribute: "dot-position" }) dotPosition: "top" | "bottom" = "bottom";
  @property({ type: Boolean }) verified = false;
  @property({ type: Boolean, attribute: "has-hover", reflect: true }) hasHover = false;
  @property({ type: Boolean }) transparent = false;
  @property({ attribute: "trigger-label" }) triggerLabel = "";
  @property() placement: LoomiProfileMenuPlacement = "right";
  @property({ type: Boolean }) divided = false;
  @property({ type: Boolean }) scrollable = false;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;

  @query("loomi-dropmenu") private dropmenuEl?: LoomiDropmenu;

  private get resolvedAvatarLabel(): string {
    return this.avatarLabel || initials(this.name) || "?";
  }

  private get resolvedAvatarAlt(): string {
    return this.avatarAlt || (this.name ? `${this.name} avatar` : "Profile avatar");
  }

  private get resolvedTriggerLabel(): string {
    return this.triggerLabel || (this.name ? `Open ${this.name} menu` : "Open profile menu");
  }

  private moveMenuItems(): void {
    const dropmenu = this.dropmenuEl;
    if (!dropmenu) return;

    const items = Array.from(this.children).filter(
      (child) => child.localName === "loomi-dropmenu-item",
    );
    for (const item of items) dropmenu.appendChild(item);
    if (items.length) dropmenu.requestUpdate();
  }

  override firstUpdated(): void {
    this.moveMenuItems();
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("name") || changed.has("avatarLabel")) {
      this.moveMenuItems();
    }
  }

  private renderChevron(): TemplateResult | typeof nothing {
    if (!CHEVRON_DOWN) return nothing;
    return html`<svg class="loomi-pm-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      ${CHEVRON_DOWN}
    </svg>`;
  }

  override render(): TemplateResult {
    return html`
      <loomi-dropmenu
        class="loomi-pm-dropmenu"
        .placement=${this.placement}
        .divided=${this.divided}
        .scrollable=${this.scrollable}
        .height=${this.height}
        .hideAfterClick=${this.hideAfterClick}
      >
        <loomi-card
          slot="trigger"
          size="sm"
          has-shadow="false"
          has-border="false"
          ?transparent=${this.transparent}
          style="--loomi-card-spacing:0"
        >
          <loomi-card-content>
            <span class="loomi-pm-trigger" aria-label=${this.resolvedTriggerLabel}>
              <loomi-avatar
                .image=${this.avatar}
                .label=${this.resolvedAvatarLabel}
                .alt=${this.resolvedAvatarAlt}
                .size=${this.avatarSize}
                .bgColor=${this.avatarBgColor}
                .dotted=${this.dotted}
                .pulseDot=${this.pulseDot}
                .dotColor=${this.dotColor}
                .dotPosition=${this.dotPosition}
                .verified=${this.verified}
              ></loomi-avatar>
              <span class="loomi-pm-copy">
                <span class="loomi-pm-name">${this.name}</span>
                ${this.description ? html`<span class="loomi-pm-description">${this.description}</span>` : nothing}
              </span>
              ${this.renderChevron()}
            </span>
          </loomi-card-content>
        </loomi-card>
        <slot class="loomi-pm-staging" @slotchange=${this.moveMenuItems}></slot>
      </loomi-dropmenu>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-profile-menu": LoomiProfileMenu;
  }
}
