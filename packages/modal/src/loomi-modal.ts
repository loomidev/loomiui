import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiModalType = "" | "info" | "error" | "warning" | "success";
export type LoomiModalSize = "tiny" | "small" | "medium" | "large" | "xl" | "omg";

const TYPE: Record<string, { color: LoomiColor; icon: string }> = {
  info: { color: "blue" as LoomiColor, icon: "information-circle" },
  error: { color: "red" as LoomiColor, icon: "exclamation-circle" },
  warning: { color: "orange" as LoomiColor, icon: "exclamation-triangle" },
  success: { color: "green" as LoomiColor, icon: "check-circle" },
};
const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Walks into nested shadow roots to find the actually-focused element. */
function deepActiveElement(): Element | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

const registry = new Map<string, LoomiModal>();
/** Open a modal by its `name`. */
export function showLoomiModal(name: string): void {
  registry.get(name)?.show();
}
/** Close a modal by its `name`. */
export function hideLoomiModal(name: string): void {
  registry.get(name)?.hide();
}

/**
 * `<loomi-modal>` — an overlay dialog. Open/close via `name` with `showLoomiModal()` /
 * `hideLoomiModal()`, or the instance `show()` / `hide()` methods.
 *
 * @slot - The modal body.
 * @fires ok - Primary button clicked. @fires cancel - Secondary button clicked. @fires close - Dismissed.
 */
@customElement("loomi-modal")
export class LoomiModal extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property() title = "";
  @property() type: LoomiModalType = "";
  @property() icon = "";
  @property() size: LoomiModalSize = "medium";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: "ok-button-label" }) okButtonLabel = "Okay";
  @property({ attribute: "cancel-button-label" }) cancelButtonLabel = "Cancel";
  @property({ type: Boolean, attribute: "show-action-buttons" }) showActionButtons = true;
  @property({ type: Boolean, attribute: "show-close-icon" }) showCloseIcon = false;
  @property({ type: Boolean, attribute: "backdrop-can-close" }) backdropCanClose = true;
  @property({ type: Boolean, attribute: "close-after-action" }) closeAfterAction = true;
  @property({ type: Boolean, attribute: "stretch-action-buttons" }) stretchActionButtons = false;
  @property({ attribute: "align-buttons" }) alignButtons: "left" | "center" | "right" = "right";
  @property({ attribute: "blur-size" }) blurSize: "none" | "small" | "medium" | "large" | "xl" | "omg" = "medium";

  /** The element focused before `show()` was called, restored when the modal closes. */
  private previouslyFocused: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.name) registry.set(this.name, this);
    document.addEventListener("keydown", this.onKey);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.name) registry.delete(this.name);
    document.removeEventListener("keydown", this.onKey);
  }

  show(): void {
    this.previouslyFocused = deepActiveElement() as HTMLElement | null;
    this.open = true;
    this.dispatchEvent(new Event("open", { bubbles: true, composed: true }));
    // Move focus into the dialog once it has rendered — first focusable element if
    // there is one (e.g. a footer button), else the dialog container itself.
    this.updateComplete.then(() => {
      const focusable = this.getFocusable();
      (focusable[0] ?? this.shadowRoot?.querySelector<HTMLElement>(".loomi-dialog"))?.focus();
    });
  }
  hide(): void {
    this.open = false;
    this.dispatchEvent(new Event("close", { bubbles: true, composed: true }));
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }

  /** Focusable elements in template order: close button, slotted body, footer buttons. */
  private getFocusable(): HTMLElement[] {
    const before = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(".loomi-close") ?? []);
    const light = Array.from(this.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const after = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(".loomi-footer button") ?? []);
    return [...before, ...light, ...after];
  }

  private onKey = (e: KeyboardEvent): void => {
    if (!this.open) return;
    if (e.key === "Escape") {
      if (this.backdropCanClose) this.hide();
      return;
    }
    if (e.key !== "Tab") return;
    // Trap focus inside the dialog while it's open.
    const focusable = this.getFocusable();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const current = deepActiveElement();
    const index = focusable.indexOf(current as HTMLElement);
    if (e.shiftKey) {
      if (index <= 0) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else if (index === -1 || index === focusable.length - 1) {
      e.preventDefault();
      focusable[0].focus();
    }
  };

  private onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget && this.backdropCanClose) this.hide();
  };

  private onOk = (): void => {
    this.dispatchEvent(new Event("ok", { bubbles: true, composed: true }));
    if (this.closeAfterAction) this.open = false;
  };
  private onCancel = (): void => {
    this.dispatchEvent(new Event("cancel", { bubbles: true, composed: true }));
    if (this.closeAfterAction) this.open = false;
  };

  override render(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    const t = this.type ? TYPE[this.type] : undefined;
    const iconName = this.icon || t?.icon || "";
    const path = iconName ? getLoomiIcon(iconName) : undefined;
    const accent = accentVars(t?.color ?? ("primary" as LoomiColor));
    const showOk = this.showActionButtons && this.okButtonLabel;
    const showCancel = this.showActionButtons && this.cancelButtonLabel;

    return html`<div class="loomi-backdrop blur-${this.blurSize}" @click=${this.onBackdrop}>
      <div class="loomi-dialog size-${this.size}" role="dialog" aria-modal="true" aria-label=${this.title || "Dialog"} tabindex="-1" style=${accent}>
        ${this.showCloseIcon
          ? html`<button class="loomi-close" aria-label="Close" @click=${() => this.hide()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${X}</svg></button>`
          : nothing}
        ${path ? html`<svg class="loomi-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${path}</svg>` : nothing}
        ${this.title ? html`<div class="loomi-title ${path ? "has-ico" : ""}">${this.title}</div>` : nothing}
        <div class="loomi-body ${path || this.title ? "" : "plain"}"><slot></slot></div>
        ${showOk || showCancel
          ? html`<div class="loomi-footer ${this.stretchActionButtons ? "stretch" : this.alignButtons}">
              ${showCancel ? html`<button class="loomi-btn ghost" @click=${this.onCancel}>${this.cancelButtonLabel}</button>` : nothing}
              ${showOk ? html`<button class="loomi-btn primary" @click=${this.onOk}>${this.okButtonLabel}</button>` : nothing}
            </div>`
          : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-modal": LoomiModal;
  }
}
