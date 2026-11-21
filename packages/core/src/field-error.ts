import type { ReactiveController, ReactiveControllerHost } from "lit";

type ErrorHost = ReactiveControllerHost &
  HTMLElement & {
    error: string;
    renderRoot: HTMLElement | DocumentFragment;
    checkValidity?: () => boolean;
  };

const MESSAGE_ID = "loomi-error";
const FOCUSABLE =
  '#loomi-control, input:not([type="hidden"]), textarea, select, button, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/**
 * Shows an error supplied from outside a form control (a server-side rejection, a failed
 * async check) through the control's `error` property:
 *
 * - renders the message below the control as `part="error"`;
 * - marks the control's focusable element `aria-invalid` and points `aria-describedby`
 *   at the message;
 * - sets a `customError` validity, so the form won't submit while it stands;
 * - adds the `error` custom state, for `:host(:state(error))` styling;
 * - clears `error` when the user edits the value (the control fires `input`/`change`).
 *
 * ```ts
 * @property() error = "";
 * protected readonly errorController = new LoomiFieldErrorController(this, () => this.internals);
 * ```
 */
export class LoomiFieldErrorController implements ReactiveController {
  private message?: HTMLParagraphElement;
  private shown = "";

  constructor(
    private readonly host: ErrorHost,
    private readonly internals: () => ElementInternals,
  ) {
    host.addController(this);
  }

  hostConnected(): void {
    this.host.addEventListener("input", this.clear);
    this.host.addEventListener("change", this.clear);
  }

  hostDisconnected(): void {
    this.host.removeEventListener("input", this.clear);
    this.host.removeEventListener("change", this.clear);
  }

  private clear = (): void => {
    if (this.host.error) this.host.error = "";
  };

  hostUpdated(): void {
    const error = (this.host.error ?? "").trim();
    const internals = this.internals();
    const control = this.host.renderRoot.querySelector<HTMLElement>(FOCUSABLE);

    if (error) {
      // Runs after the control's own validity sync in willUpdate, so this wins while set.
      internals.setValidity({ customError: true }, error, control ?? undefined);
      this.setState(internals, true);
      this.renderMessage(error);
      if (control) {
        control.setAttribute("aria-invalid", "true");
        const ids = new Set((control.getAttribute("aria-describedby") ?? "").split(/\s+/));
        ids.add(MESSAGE_ID);
        control.setAttribute("aria-describedby", [...ids].filter(Boolean).join(" "));
      }
    } else if (this.shown) {
      this.message?.remove();
      this.message = undefined;
      this.setState(internals, false);
      if (control) {
        control.removeAttribute("aria-invalid");
        const ids = (control.getAttribute("aria-describedby") ?? "")
          .split(/\s+/)
          .filter((id) => id && id !== MESSAGE_ID);
        if (ids.length) control.setAttribute("aria-describedby", ids.join(" "));
        else control.removeAttribute("aria-describedby");
      }
      // Hand validity back to the control's own checks.
      internals.setValidity({});
      this.host.checkValidity?.();
    }
    this.shown = error;
  }

  private setState(internals: ElementInternals, on: boolean): void {
    try {
      if (on) internals.states?.add("error");
      else internals.states?.delete("error");
    } catch {
      // Older engines without CustomStateSet: the message and aria still apply.
    }
  }

  private renderMessage(error: string): void {
    if (!this.message) {
      this.message = document.createElement("p");
      this.message.id = MESSAGE_ID;
      this.message.className = "loomi-field-error";
      this.message.setAttribute("part", "error");
      // Inline so it reads correctly in controls whose stylesheet has no error rule.
      this.message.style.cssText =
        "margin:0.35rem 0 0;font-size:0.8rem;color:var(--loomi-error-500, var(--_loomi-error-500-default, #ef4444));";
    }
    this.message.textContent = error;
    // Lit only manages its own nodes, so a trailing sibling is left alone across renders.
    if (this.message.parentNode !== this.host.renderRoot) this.host.renderRoot.append(this.message);
  }
}
