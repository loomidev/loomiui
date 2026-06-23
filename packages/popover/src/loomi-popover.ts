import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles, onClickOutside } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPopoverPosition = "top" | "bottom" | "left" | "right";

/**
 * `<loomi-popover>` — a floating rich-content panel opened on click or hover.
 *
 * @slot - Panel content (rich markup allowed).
 * @slot trigger - Custom trigger markup (overrides the `trigger` icon).
 */
@customElement("loomi-popover")
export class LoomiPopover extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() trigger = "information-circle";
  @property({ attribute: "trigger-on" }) triggerOn: "click" | "mouseover" = "click";
  @property() position: LoomiPopoverPosition = "bottom";
  @property() title = "";
  @property({ type: Number }) width = 280;

  @state() private open = false;
  private cleanup?: () => void;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  show(): void {
    if (this.open) return;
    this.open = true;
    if (this.triggerOn === "click") this.cleanup = onClickOutside(this, () => (this.open = false));
  }
  hide(): void {
    this.open = false;
    this.cleanup?.();
  }
  toggle(): void {
    this.open ? this.hide() : this.show();
  }

  override render(): TemplateResult {
    const path = getLoomiIcon(this.trigger.replace(/-icon$/, ""));
    return html`<button
      class="loomi-trigger"
      aria-haspopup="dialog"
      aria-expanded=${this.open ? "true" : "false"}
      @click=${this.triggerOn === "click" ? () => this.toggle() : nothing}
      @mouseenter=${this.triggerOn === "mouseover" ? () => this.show() : nothing}
      @mouseleave=${this.triggerOn === "mouseover" ? () => this.hide() : nothing}
    >
      <slot name="trigger">
        ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : "?"}
      </slot>
    </button>
    ${this.open
      ? html`<div class="loomi-panel pos-${this.position}" role="dialog" style="--loomi-pop-width:${this.width}px">
          ${this.title ? html`<div class="loomi-title">${this.title}</div>` : nothing}
          <div class="loomi-content"><slot></slot></div>
        </div>`
      : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-popover": LoomiPopover;
  }
}
