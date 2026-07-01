import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiCopyToClipboardStatus = "idle" | "copied" | "error";

const FEEDBACK_MS = 1600;

/**
 * `<loomi-copy-to-clipboard>` — wraps text/content and appends a copy button.
 *
 * @slot - Text or one element whose text content should be copied.
 * @fires copied - `detail: { value }` after text is copied.
 * @fires copy-error - `detail: { value, error }` when clipboard write fails.
 */
@customElement("loomi-copy-to-clipboard")
export class LoomiCopyToClipboard extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Explicit clipboard value. When blank, the component copies slotted text content. */
  @property() value = "";

  /** Accessible label for the icon button. */
  @property({ attribute: "copy-label" }) copyLabel = "Copy to clipboard";

  /** Message shown briefly after a successful copy. */
  @property({ attribute: "copied-label" }) copiedLabel = "Copied";

  /** Disable the copy button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private status: LoomiCopyToClipboardStatus = "idle";

  @query("slot") private defaultSlot!: HTMLSlotElement;

  private feedbackTimer = 0;

  override disconnectedCallback(): void {
    window.clearTimeout(this.feedbackTimer);
    super.disconnectedCallback();
  }

  private get clipboardValue(): string {
    if (this.value) return this.value;
    const assignedNodes = this.defaultSlot?.assignedNodes({ flatten: true }) ?? [];
    return assignedNodes
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
  }

  private get isCopied(): boolean {
    return this.status === "copied";
  }

  private setTemporaryStatus(status: LoomiCopyToClipboardStatus): void {
    window.clearTimeout(this.feedbackTimer);
    this.status = status;
    if (status === "idle") return;

    this.feedbackTimer = window.setTimeout(() => {
      this.status = "idle";
    }, FEEDBACK_MS);
  }

  private async writeToClipboard(value: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.inset = "0 auto auto 0";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();

    try {
      if (!document.execCommand("copy")) {
        throw new Error("Copy command was not accepted.");
      }
    } finally {
      textarea.remove();
    }
  }

  private async copy(): Promise<void> {
    if (this.disabled) return;

    const value = this.clipboardValue;
    if (!value) return;

    try {
      await this.writeToClipboard(value);
      this.setTemporaryStatus("copied");
      this.dispatchEvent(new CustomEvent("copied", {
        detail: { value },
        bubbles: true,
        composed: true,
      }));
    } catch (error) {
      this.setTemporaryStatus("error");
      this.dispatchEvent(new CustomEvent("copy-error", {
        detail: { value, error },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private renderIcon(): TemplateResult | typeof nothing {
    const iconName = this.isCopied ? "check" : "clipboard";
    const path = getLoomiIcon(iconName);
    if (!path) return nothing;

    return html`<svg
      class="loomi-copy-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      ${path}
    </svg>`;
  }

  override render(): TemplateResult {
    return html`
      <span class="loomi-copy-content"><slot></slot></span>
      <button
        class="loomi-copy-button ${this.status}"
        type="button"
        aria-label=${this.isCopied ? this.copiedLabel : this.copyLabel}
        ?disabled=${this.disabled}
        @click=${this.copy}
      >
        ${this.renderIcon()}
      </button>
      <span class="loomi-copy-feedback ${this.status}" aria-live="polite">
        ${this.isCopied ? this.copiedLabel : ""}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-copy-to-clipboard": LoomiCopyToClipboard;
  }
}
