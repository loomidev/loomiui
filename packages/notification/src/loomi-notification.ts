import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiNotificationType = "success" | "info" | "warning" | "error";
export type LoomiNotificationPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

export interface LoomiNotifyOptions {
  title?: string;
  message: string;
  type?: LoomiNotificationType;
  dismissIn?: number;
  name?: string;
}

interface Toast extends LoomiNotifyOptions {
  id: number;
  type: LoomiNotificationType;
}

const TYPE: Record<LoomiNotificationType, { color: LoomiColor; icon: string }> = {
  success: { color: "green" as LoomiColor, icon: "check-circle" },
  info: { color: "blue" as LoomiColor, icon: "information-circle" },
  warning: { color: "orange" as LoomiColor, icon: "exclamation-triangle" },
  error: { color: "red" as LoomiColor, icon: "exclamation-circle" },
};

let uid = 0;

/**
 * `<loomi-notification>` — a container for stacked, auto-dismissing toasts. Trigger via
 * the `notify()` method or the global `showLoomiNotification()` helper.
 */
@customElement("loomi-notification")
export class LoomiNotification extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() position: LoomiNotificationPosition = "top-right";
  @property() locale = "";
  @state() private toasts: Toast[] = [];
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  override connectedCallback(): void {
    super.connectedCallback();
    this.moveToDocumentBody();
  }

  private moveToDocumentBody(): void {
    const body = this.ownerDocument?.body;
    if (body && this.parentElement !== body) {
      body.appendChild(this);
    }
  }

  /** Show a notification. Re-renders an existing one when `name` matches. */
  notify(opts: LoomiNotifyOptions): void {
    const type = opts.type ?? "success";
    const dismissIn = opts.dismissIn ?? 15;
    let toast: Toast;
    if (opts.name) {
      const existing = this.toasts.find((t) => t.name === opts.name);
      if (existing) {
        Object.assign(existing, opts, { type });
        this.toasts = [...this.toasts];
        this.arm(existing.id, dismissIn);
        return;
      }
    }
    toast = { ...opts, id: ++uid, type };
    this.toasts = [...this.toasts, toast];
    this.arm(toast.id, dismissIn);
  }

  private arm(id: number, dismissIn: number): void {
    clearTimeout(this.timers.get(id));
    if (dismissIn > 0) this.timers.set(id, setTimeout(() => this.dismiss(id), dismissIn * 1000));
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  private onDismiss(event: Event, id: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.dismiss(id);
  }

  override render(): TemplateResult {
    return html`<div class="loomi-stack pos-${this.position}">
      ${this.toasts.map((t) => {
        const meta = TYPE[t.type];
        return html`<div class="loomi-toast" role="status" style=${accentVars(meta.color)}>
          <loomi-icon class="loomi-ico" name=${meta.icon} stroke-width="1.6"></loomi-icon>
          <div class="loomi-content">
            ${t.title ? html`<div class="loomi-title">${t.title}</div>` : nothing}
            <div class="loomi-message">${t.message}</div>
          </div>
          <button type="button" class="loomi-close" aria-label=${loomiT("common.dismiss", {}, this.locale)} @click=${(event: Event) => this.onDismiss(event, t.id)}>
            <loomi-icon name="x-mark" stroke-width="2"></loomi-icon>
          </button>
        </div>`;
      })}
    </div>`;
  }
}

/**
 * Show a notification from anywhere. Uses the first `<loomi-notification>` on the page,
 * creating one (top-right) if none exists.
 */
export function showLoomiNotification(
  title: string,
  message: string,
  type: LoomiNotificationType = "success",
  dismissIn = 15,
  name?: string,
): void {
  let host = document.querySelector("loomi-notification") as LoomiNotification | null;
  if (!host) {
    host = document.createElement("loomi-notification") as LoomiNotification;
    document.body.appendChild(host);
  }
  host.notify({ title, message, type, dismissIn, name });
}

// Exposed on `window` so plain `onclick="showLoomiNotification(...)"` markup works with
// no build step or module-scoped import, matching every other attribute-driven usage in
// this library.
declare global {
  interface HTMLElementTagNameMap {
    "loomi-notification": LoomiNotification;
  }
  interface Window {
    showLoomiNotification: typeof showLoomiNotification;
  }
}
window.showLoomiNotification = showLoomiNotification;
