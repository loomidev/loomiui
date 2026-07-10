import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, themeStyles } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";

export type LoomiSideNavState = "expanded" | "icons" | "hidden";
export type LoomiSideNavCollapseMode = "icons" | "hidden";

const MENU = html`<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false";
  }
};

@customElement("loomi-side-nav-item")
export class LoomiSideNavItem extends LoomiElement {
  static override styles = [
    themeStyles,
    css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      .item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        min-height: 2.5rem;
        box-sizing: border-box;
        border: 0;
        border-radius: 0.375rem;
        background: transparent;
        color: var(--loomi-text-secondary, inherit);
        cursor: pointer;
        font: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.25;
        padding: 0 0.75rem;
        text-align: left;
        text-decoration: none;
      }
      .item:hover {
        background: var(--loomi-surface-hover);
        color: var(--loomi-text);
      }
      .item:focus-visible {
        outline: 2px solid var(--loomi-focus-ring-color, var(--loomi-primary-400, #60a5fa));
        outline-offset: 2px;
      }
      :host([active]) .item {
        background: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
        color: var(--loomi-primary-700, var(--_loomi-primary-700-default, #174ea6));
      }
      svg {
        width: 1.15rem;
        height: 1.15rem;
        flex: none;
      }
      .label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :host([compact]) .label {
        display: none;
      }
      :host([compact]) .item {
        justify-content: center;
        padding: 0;
      }
    `,
  ];

  @property() href = "";
  @property() icon = "";
  @property() label = "";
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  private renderIcon(): TemplateResult | typeof nothing {
    if (!this.icon) return nothing;
    const path = getLoomiIcon(this.icon);
    if (!path) return nothing;
    return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>`;
  }

  override render(): TemplateResult {
    const content = html`${this.renderIcon()}<span class="label"><slot>${this.label}</slot></span>`;
    return this.href
      ? html`<a class="item" href=${this.href} aria-current=${this.active ? "page" : nothing}>${content}</a>`
      : html`<button class="item" type="button" aria-current=${this.active ? "page" : nothing}>${content}</button>`;
  }
}

@customElement("loomi-side-nav")
export class LoomiSideNav extends LoomiElement {
  static override styles = [
    themeStyles,
    css`
      :host {
        display: block;
        width: var(--loomi-side-nav-current-width, var(--loomi-side-nav-width, 16rem));
        height: 100%;
        min-height: 0;
        overflow: hidden;
        transition:
          width 180ms cubic-bezier(0.4, 0, 0.2, 1),
          transform 180ms cubic-bezier(0.4, 0, 0.2, 1),
          opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      :host([hidden]) {
        display: none;
      }
      :host([state="icons"]) {
        --loomi-side-nav-current-width: var(--loomi-side-nav-icon-width, 4rem);
      }
      :host([state="hidden"]) {
        --loomi-side-nav-current-width: 0px;
        opacity: 0;
        transform: translateX(-100%);
        pointer-events: none;
      }
      .panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: var(--loomi-side-nav-width, 16rem);
        height: 100%;
        min-height: 0;
        box-sizing: border-box;
        border-right: 1px solid var(--loomi-surface-border);
        background: var(--loomi-surface);
        color: var(--loomi-text);
        padding: 0.75rem;
      }
      :host([state="icons"]) .panel {
        width: var(--loomi-side-nav-icon-width, 4rem);
        padding-inline: 0.5rem;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-height: 2.5rem;
      }
      .title {
        min-width: 0;
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.875rem;
        font-weight: 700;
      }
      :host([state="icons"]) .title {
        display: none;
      }
      .toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border: 0;
        border-radius: 0.375rem;
        background: transparent;
        color: var(--loomi-text-muted);
        cursor: pointer;
        padding: 0;
      }
      .toggle:hover {
        background: var(--loomi-surface-hover);
        color: var(--loomi-text);
      }
      .toggle:focus-visible {
        outline: 2px solid var(--loomi-focus-ring-color, var(--loomi-primary-400, #60a5fa));
        outline-offset: 2px;
      }
      .toggle svg {
        width: 1.2rem;
        height: 1.2rem;
      }
      nav {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        flex-direction: column;
        gap: 0.25rem;
        overflow: hidden auto;
      }
    `,
  ];

  @property({ reflect: true }) state: LoomiSideNavState = "expanded";
  @property({ attribute: "collapse-mode" }) collapseMode: LoomiSideNavCollapseMode = "icons";
  @property() label = "Navigation";
  @property({ type: Boolean, attribute: "show-toggle", converter: booleanAttribute }) showToggle = true;

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("state")) {
      this.syncItemState();
    }
  }

  expand(): void {
    this.state = "expanded";
  }

  collapse(): void {
    this.state = this.collapseMode;
  }

  hideNav(): void {
    this.state = "hidden";
  }

  showIcons(): void {
    this.state = "icons";
  }

  toggle(): void {
    this.state = this.state === "expanded" ? this.collapseMode : "expanded";
  }

  private syncItemState = (): void => {
    for (const item of this.querySelectorAll<LoomiSideNavItem>("loomi-side-nav-item")) {
      item.compact = this.state !== "expanded";
    }
  };

  override render(): TemplateResult {
    return html`
      <aside class="panel" aria-label=${this.label}>
        <div class="header">
          <span class="title">${this.label}</span>
          ${this.showToggle
            ? html`<button class="toggle" type="button" aria-label="Toggle navigation" @click=${this.toggle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${MENU}</svg>
              </button>`
            : nothing}
        </div>
        <nav><slot @slotchange=${this.syncItemState}></slot></nav>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-side-nav": LoomiSideNav;
    "loomi-side-nav-item": LoomiSideNavItem;
  }
}
