import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, onClickOutside } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPopoverPlacement = "top" | "bottom" | "left" | "right";

/**
 * `<loomi-popover>` — a floating rich-content panel opened on click or hover.
 *
 * @slot - Panel content (rich markup allowed).
 * @slot trigger - Custom trigger markup (overrides the `trigger` icon).
 * @fires loomi-toggle - `detail: { open }` whenever the panel opens or closes.
 */
@customElement("loomi-popover")
export class LoomiPopover extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() trigger = "information-circle";
  @property({ attribute: "trigger-on" }) triggerOn: "click" | "mouseover" = "click";
  @property() placement: LoomiPopoverPlacement = "bottom";
  @property() title = "";
  @property({ type: Number }) width = 280;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private open = false;
  private cleanup?: () => void;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  /** Whether the panel is currently open. */
  get isOpen(): boolean {
    return this.open;
  }

  private setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    this.dispatchEvent(new CustomEvent("loomi-toggle", { bubbles: true, composed: true, detail: { open } }));
  }

  show(): void {
    if (this.open || this.disabled) return;
    this.setOpen(true);
    if (this.triggerOn === "click") this.cleanup = onClickOutside(this, () => this.setOpen(false));
  }
  hide(): void {
    this.setOpen(false);
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
      ?disabled=${this.disabled}
      @click=${this.triggerOn === "click" && !this.disabled ? () => this.toggle() : nothing}
      @mouseenter=${this.triggerOn === "mouseover" && !this.disabled ? () => this.show() : nothing}
      @mouseleave=${this.triggerOn === "mouseover" ? () => this.hide() : nothing}
    >
      <slot name="trigger">
        ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : "?"}
      </slot>
    </button>
    ${this.open
      ? html`<div class="loomi-panel placement-${this.placement}" role="dialog" style="--loomi-pop-width:${this.width}px">
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
