import type { LoomiModal, LoomiModalType } from "./loomi-modal.js";
import "./loomi-modal.js";

export interface LoomiConfirmOptions {
  /** Secondary text under the message. Set with `textContent`, never parsed as HTML. */
  body?: string;
  /** Icon and accent colour. Defaults to `warning`. */
  type?: LoomiModalType;
  /** OK button label. Defaults to the localised "Okay". */
  okLabel?: string;
  /** Cancel button label. Defaults to the localised "Cancel". */
  cancelLabel?: string;
  /** Dialog width. Defaults to `small`. */
  size?: LoomiModal["size"];
}

interface Pending {
  message: string;
  options: LoomiConfirmOptions;
  resolve: (ok: boolean) => void;
}

let modal: LoomiModal | undefined;
let defaultLabels = { ok: "", cancel: "" };
let active = false;
const queue: Pending[] = [];

function getModal(): LoomiModal {
  if (modal?.isConnected) return modal;
  modal = document.createElement("loomi-modal");
  defaultLabels = { ok: modal.okButtonLabel, cancel: modal.cancelButtonLabel };
  document.body.appendChild(modal);
  return modal;
}

/** Resolves once the modal has finished its exit animation and can be safely reconfigured. */
function settled(el: LoomiModal): Promise<void> {
  if (!el.hasAttribute("closing")) return Promise.resolve();
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (el.hasAttribute("closing")) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(el, { attributes: true, attributeFilter: ["closing"] });
  });
}

async function next(): Promise<void> {
  const item = queue.shift();
  if (!item) {
    active = false;
    return;
  }
  active = true;
  const el = getModal();
  await settled(el);

  const { message, options } = item;
  el.title = message;
  el.type = options.type ?? "warning";
  el.size = options.size ?? "small";
  el.okButtonLabel = options.okLabel ?? defaultLabels.ok;
  el.cancelButtonLabel = options.cancelLabel ?? defaultLabels.cancel;
  el.showCloseIcon = true;
  el.backdropCanClose = true;
  el.closeAfterAction = true;
  el.textContent = options.body ?? "";

  let accepted = false;
  const onOk = (): void => {
    accepted = true;
  };
  // `ok` fires before the `close` that follows it; every other dismissal (Cancel, Escape,
  // backdrop, close icon) only fires `close`, so "close without ok" is `false`.
  const onClose = (): void => {
    el.removeEventListener("ok", onOk);
    el.removeEventListener("close", onClose);
    item.resolve(accepted);
    void next();
  };
  el.addEventListener("ok", onOk);
  el.addEventListener("close", onClose);
  el.show();
}

/**
 * Promise-based counterpart to `window.confirm()`. Resolves `true` only when OK is clicked;
 * Cancel, Escape, a backdrop click and the close icon resolve `false`.
 *
 * One `<loomi-modal>` is reused. A call made while a dialog is open is queued and shown
 * after the current one is dismissed, in call order; no call is ever rejected.
 */
export function loomiConfirm(message: string, options: LoomiConfirmOptions = {}): Promise<boolean> {
  // No DOM (SSR): nothing can be confirmed, so treat it as declined.
  if (typeof document === "undefined") return Promise.resolve(false);
  return new Promise<boolean>((resolve) => {
    queue.push({ message, options, resolve });
    if (!active) void next();
  });
}

declare global {
  interface Window {
    loomiConfirm: typeof loomiConfirm;
  }
}
if (typeof window !== "undefined") {
  window.loomiConfirm = loomiConfirm;
}
