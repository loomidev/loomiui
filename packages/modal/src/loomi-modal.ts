import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  loomiT,
  accentVars,
  lockBodyScroll,
  unlockBodyScroll,
  deepActiveElement,
  trapTabFocus,
  FOCUSABLE_SELECTOR,
  OverlayReparent,
  type LoomiColor,
} from "@loomidev/core";
import "@loomidev/button/loomi-button.js";
import "@loomidev/icon/loomi-icon.js";
import type { LoomiIconSource } from "@loomidev/icon";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiModalType = "" | "info" | "error" | "warning" | "success";
export type LoomiModalSize = "tiny" | "small" | "medium" | "large" | "xl" | "omg";

const TYPE: Record<string, { color: LoomiColor; icon: string }> = {
  info: { color: "primary" as LoomiColor, icon: "information-circle" },
  error: { color: "error" as LoomiColor, icon: "exclamation-circle" },
  warning: { color: "warning" as LoomiColor, icon: "exclamation-triangle" },
  success: { color: "success" as LoomiColor, icon: "check-circle" },
};
const DEFAULT_OK_LABEL = "Okay";
const DEFAULT_CANCEL_LABEL = "Cancel";

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

const registry = new Map<string, LoomiModal>();

/** Open a modal by its `name`. */
export function showLoomiModal(name: string): void {
  registry.get(name)?.show();
}
/** Close a modal by its `name`. */
export function hideLoomiModal(name: string): void {
  registry.get(name)?.hide();
}

// Exposed on `window` so plain `onclick="showLoomiModal('name')"` markup works with no
// build step or module-scoped import, matching every other attribute-driven usage in
// this library.
declare global {
  interface Window {
    showLoomiModal: typeof showLoomiModal;
    hideLoomiModal: typeof hideLoomiModal;
  }
}
if (typeof window !== "undefined") {
  window.showLoomiModal = showLoomiModal;
  window.hideLoomiModal = hideLoomiModal;
}

/**
 * `<loomi-modal>` — an overlay dialog. Open/close via `name` with `showLoomiModal()` /
 * `hideLoomiModal()`, or the instance `show()` / `hide()` methods.
 *
 * @slot - The modal body.
 * @fires ok - Primary button clicked. @fires cancel - Secondary button clicked. @fires close - Dismissed.
 */
@customElement("loomi-modal")
export class LoomiModal extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property() title = "";
  @property() type: LoomiModalType = "";
  @property() icon = "";
  @property({ attribute: "icon-source" }) iconSource: LoomiIconSource = "heroicons";
  @property() size: LoomiModalSize = "medium";
  @property() locale = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: "ok-button-label" }) okButtonLabel = DEFAULT_OK_LABEL;
  @property({ attribute: "cancel-button-label" }) cancelButtonLabel = DEFAULT_CANCEL_LABEL;
  @property({ type: Boolean, attribute: "show-action-buttons", converter: booleanAttribute })
  showActionButtons = true;
  @property({ type: Boolean, attribute: "show-close-icon", converter: booleanAttribute })
  showCloseIcon = false;
  @property({ type: Boolean, attribute: "backdrop-can-close", converter: booleanAttribute })
  backdropCanClose = true;
  @property({ type: Boolean, attribute: "close-after-action", converter: booleanAttribute })
  closeAfterAction = true;
  @property({ type: Boolean, attribute: "prevent-scroll", converter: booleanAttribute })
  preventScroll = true;
  @property({ type: Boolean, attribute: "stretch-action-buttons", converter: booleanAttribute })
  stretchActionButtons = false;
  @property({ attribute: "align-buttons" }) alignButtons: "left" | "center" | "right" = "right";
  @property({ attribute: "blur-size" }) blurSize:
    "none" | "small" | "medium" | "large" | "xl" | "omg" = "medium";

  /** The element focused before `show()` was called, restored when the modal closes. */
  private previouslyFocused: HTMLElement | null = null;
  private hasScrollLock = false;
  private reparent = new OverlayReparent(this);

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.name) registry.set(this.name, this);
    document.addEventListener("keydown", this.onKey);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.name) registry.delete(this.name);
    document.removeEventListener("keydown", this.onKey);
    if (!this.reparent.isMovingInDom) this.releaseScrollLock();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (changedProperties.has("open") || changedProperties.has("preventScroll")) {
      this.syncScrollLock();
    }
  }

  show(): void {
    this.previouslyFocused = deepActiveElement() as HTMLElement | null;
    this.reparent.moveToBody();
    this.open = true;
    this.syncScrollLock();
    this.dispatchEvent(new Event("open", { bubbles: true, composed: true }));
    // Move focus into the dialog once it has rendered — first focusable element if
    // there is one (e.g. a footer button), else the dialog container itself.
    this.updateComplete
      .then(() => this.waitForActionButtons())
      .then(() => {
        const focusable = this.getFocusable();
        (focusable[0] ?? this.shadowRoot?.querySelector<HTMLElement>(".loomi-dialog"))?.focus();
      });
  }
  hide(): void {
    this.open = false;
    this.releaseScrollLock();
    this.dispatchEvent(new Event("close", { bubbles: true, composed: true }));
    this.reparent.restore();
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }

  private syncScrollLock(): void {
    if (this.open && this.preventScroll) {
      if (!this.hasScrollLock) {
        lockBodyScroll();
        this.hasScrollLock = true;
      }
    } else {
      this.releaseScrollLock();
    }
  }

  private releaseScrollLock(): void {
    if (!this.hasScrollLock) return;
    unlockBodyScroll();
    this.hasScrollLock = false;
  }

  /** Focusable elements in template order: close button, slotted body, footer buttons. */
  private getFocusable(): HTMLElement[] {
    const before = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(".loomi-close") ?? []);
    const light = Array.from(this.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const after = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>(".loomi-footer loomi-button") ?? [],
    )
      .map((button) => button.shadowRoot?.querySelector<HTMLElement>('[part="button"]') ?? null)
      .filter((button): button is HTMLElement => !!button);
    return [...before, ...light, ...after];
  }

  private async waitForActionButtons(): Promise<void> {
    const buttons = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>(
        ".loomi-footer loomi-button",
      ) ?? [],
    );
    await Promise.all(buttons.map((button) => button.updateComplete ?? Promise.resolve()));
  }

  private onKey = (e: KeyboardEvent): void => {
    if (!this.open) return;
    if (e.key === "Escape") {
      if (this.backdropCanClose) this.hide();
      return;
    }
    if (e.key !== "Tab") return;
    trapTabFocus(e, this.getFocusable());
  };

  private onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget && this.backdropCanClose) this.hide();
  };

  private onOk = (): void => {
    this.dispatchEvent(new Event("ok", { bubbles: true, composed: true }));
    if (this.closeAfterAction) this.hide();
  };
  private onCancel = (): void => {
    this.dispatchEvent(new Event("cancel", { bubbles: true, composed: true }));
    if (this.closeAfterAction) this.hide();
  };

  override render(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    const t = this.type ? TYPE[this.type] : undefined;
    const iconName = this.icon || t?.icon || "";
    const actionColor = t?.color ?? ("primary" as LoomiColor);
    const accent = accentVars(actionColor);
    const okLabel =
      this.okButtonLabel === DEFAULT_OK_LABEL
        ? loomiT("modal.ok", {}, this.locale)
        : this.okButtonLabel;
    const cancelLabel =
      this.cancelButtonLabel === DEFAULT_CANCEL_LABEL
        ? loomiT("modal.cancel", {}, this.locale)
        : this.cancelButtonLabel;
    const showOk = this.showActionButtons && this.okButtonLabel;
    const showCancel = this.showActionButtons && this.cancelButtonLabel;
    const dialogClasses = [
      "loomi-dialog",
      `size-${this.size}`,
      iconName ? "has-icon" : "is-default",
      this.showCloseIcon ? "has-close" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`<div class="loomi-backdrop blur-${this.blurSize}" @click=${this.onBackdrop}>
      <div
        class=${dialogClasses}
        role="dialog"
        aria-modal="true"
        aria-label=${this.title || loomiT("modal.dialog", {}, this.locale)}
        tabindex="-1"
        style=${accent}
      >
        ${
          this.showCloseIcon
            ? html`<button class="loomi-close" aria-label=${loomiT("common.close", {}, this.locale)} @click=${() => this.hide()}>
              <loomi-icon name="x-mark" size="1.15rem" stroke-width="2"></loomi-icon>
            </button>`
            : nothing
        }
        <div class="loomi-content">
          ${
            iconName
              ? html`<div class="loomi-icon-wrap">
                <loomi-icon class="loomi-ico" name=${iconName} source=${this.iconSource} size="1.5rem"></loomi-icon>
              </div>`
              : nothing
          }
          <div class="loomi-main">
            ${this.title ? html`<div class="loomi-title">${this.title}</div>` : nothing}
            <div class="loomi-body"><slot></slot></div>
          </div>
        </div>
        ${
          showOk || showCancel
            ? html`<div class="loomi-footer ${this.stretchActionButtons ? "stretch" : this.alignButtons}">
              ${
                showCancel
                  ? html`<loomi-button
                    class="loomi-action"
                    type="secondary"
                    size="small"
                    ?block=${this.stretchActionButtons}
                    @click=${this.onCancel}
                    >${cancelLabel}</loomi-button
                  >`
                  : nothing
              }
              ${
                showOk
                  ? html`<loomi-button
                    class="loomi-action"
                    size="small"
                    color=${actionColor}
                    ?block=${this.stretchActionButtons}
                    @click=${this.onOk}
                    >${okLabel}</loomi-button
                  >`
                  : nothing
              }
            </div>`
            : nothing
        }
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-modal": LoomiModal;
  }
}
