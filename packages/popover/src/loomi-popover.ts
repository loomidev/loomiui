import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, onClickOutside, deepActiveElement } from "@loomidev/core";
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
  /** Focus to restore on close, captured only when it was inside this component. */
  private previouslyFocused: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.onKeyDown);
    this.addEventListener("focusout", this.onFocusOut);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
    this.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("focusout", this.onFocusOut);
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

  /** True while focus is somewhere inside the trigger or the open panel. */
  private get focusIsInside(): boolean {
    const active = deepActiveElement();
    return !!active && (this.contains(active) || (this.renderRoot as ShadowRoot).contains(active));
  }

  show(): void {
    if (this.open || this.disabled) return;
    this.previouslyFocused = this.focusIsInside ? (deepActiveElement() as HTMLElement) : null;
    this.setOpen(true);
    if (this.triggerOn === "click") this.cleanup = onClickOutside(this, () => this.hide());
  }
  hide(): void {
    const restoreFocus = this.focusIsInside;
    this.setOpen(false);
    this.cleanup?.();
    if (restoreFocus) this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }
  toggle(): void {
    this.open ? this.hide() : this.show();
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.open) {
      e.stopPropagation();
      this.hide();
    }
  };

  /**
   * Non-modal dialog (no `aria-modal`, arbitrary rich content) — Tab isn't trapped like
   * `loomi-modal`'s dialog, it's allowed to move focus out normally, which closes the
   * panel rather than leaving it open with focus already gone.
   */
  private onFocusOut = (e: FocusEvent): void => {
    if (!this.open) return;
    const next = e.relatedTarget as Node | null;
    if (next && (this.contains(next) || (this.renderRoot as ShadowRoot).contains(next))) return;
    this.hide();
  };

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

export interface LoomiPopoverToggleDetail {
  open: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-popover": LoomiPopover;
  }

  interface HTMLElementEventMap {
    "loomi-toggle": CustomEvent<LoomiPopoverToggleDetail>;
  }
}
