import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars } from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;

/**
 * `<loomi-tag>` — a themeable label/badge. Faint or dark shade, optional outline,
 * rounded, tiny, and a close button.
 *
 * @slot - Tag content (falls back to the `label` attribute).
 * @fires close - Fired when the close button is clicked (the tag removes itself unless prevented).
 * @fires loomi-tag-click - Internal event bubbled to `<loomi-tags>` for selection handling.
 */
@customElement("loomi-tag")
export class LoomiTag extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() locale = "";
  /** Any loomi color plus `info` (maps to blue). */
  @property() color = "primary";
  @property() shade: "faint" | "dark" | "light" = "faint";
  @property({ type: Boolean, attribute: "can-close" }) canClose = false;
  @property({ type: Boolean }) outline = false;
  @property({ type: Boolean }) rounded = false;
  @property({ type: Boolean }) tiny = false;
  @property({ type: Boolean }) uppercasing = false;
  /** Value submitted when inside `<loomi-tags>`. */
  @property() value = "";
  /** Set by the parent `<loomi-tags>` when selected. */
  @property({ type: Boolean, reflect: true }) selected = false;
  /** Set by the parent `<loomi-tags>` to show pointer cursor and hover. */
  @property({ type: Boolean, reflect: true }) selectable = false;
  /** Heroicons icon name to display. */
  @property() icon = "";
  /** `prefix` (default) or `suffix`. */
  @property({ attribute: "icon-position" }) iconPosition: "prefix" | "suffix" = "prefix";

  private get resolvedColor(): string {
    return this.color === "info" ? "primary" : this.color;
  }

  private onClose = (e: Event): void => {
    e.stopPropagation();
    const ev = new CustomEvent("close", { bubbles: true, composed: true, cancelable: true });
    const proceed = this.dispatchEvent(ev);
    if (proceed) this.remove();
  };

  private onTagClick = (): void => {
    if (!this.value) return;
    this.dispatchEvent(
      new CustomEvent("loomi-tag-click", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  };

  override render(): TemplateResult {
    const cls = [
      "loomi-tag",
      this.outline ? "outline" : "",
      this.shade,
      this.rounded ? "rounded" : "",
      this.tiny ? "tiny" : "",
      this.uppercasing ? "uppercasing" : "",
      this.selected ? "selected" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const iconEl = this.icon
      ? html`<loomi-icon class="loomi-tag-icon" name=${this.icon}></loomi-icon>`
      : nothing;

    return html`<span class=${cls} style=${accentVars(this.resolvedColor)} @click=${this.value ? this.onTagClick : nothing}>
      ${this.icon && this.iconPosition === "prefix" ? iconEl : nothing}
      <slot>${this.label}</slot>
      ${this.icon && this.iconPosition === "suffix" ? iconEl : nothing}
      ${
        this.canClose
          ? html`<button type="button" class="loomi-close" aria-label=${loomiT("common.remove", {}, this.locale)} @click=${this.onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${X}</svg>
          </button>`
          : nothing
      }
    </span>`;
  }
}

/**
 * `<loomi-tags>` — a flex container for `<loomi-tag>` elements, optionally functioning
 * as a selectable checkbox-style group. Set `name` to enable selection; each child tag
 * with a `value` becomes togglable. Selected values are submitted comma-joined under `name`.
 *
 * @slot - `<loomi-tag>` children.
 * @fires change - `detail: { values: string[] }` when selection changes.
 */
@customElement("loomi-tags")
export class LoomiTags extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property({ type: Number }) max = 0;
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property({ type: Boolean }) required = false;
  /** Color propagated to child tags that have no explicit `color`. */
  @property() color = "";

  private _selected: string[] = [];
  private _initialized = false;

  private get tags(): LoomiTag[] {
    return Array.from(this.querySelectorAll<LoomiTag>("loomi-tag"));
  }

  override willUpdate(): void {
    if (!this._initialized) {
      this._selected = this.selectedValue
        ? this.selectedValue
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
      this._initialized = true;
    }
    if (this.name) {
      this.internals.setFormValue(this._selected.join(","));
    }
  }

  private sync(): void {
    for (const tag of this.tags) {
      if (this.color && !tag.getAttribute("color")) {
        tag.color = this.color;
      }
      tag.selected = this.name ? this._selected.includes(tag.value) : false;
      tag.selectable = !!this.name && !!tag.value;
    }
  }

  override firstUpdated(): void {
    this.sync();
  }

  private onTagClick = (e: Event): void => {
    if (!this.name) return;
    const value = (e as CustomEvent<{ value: string }>).detail.value;
    const has = this._selected.includes(value);
    if (has) {
      this._selected = this._selected.filter((v) => v !== value);
    } else if (this.max > 0 && this._selected.length >= this.max) {
      return;
    } else {
      this._selected = [...this._selected, value];
    }
    this.internals.setFormValue(this._selected.join(","));
    this.sync();
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: { values: [...this._selected] },
      }),
    );
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-group", "");
  }

  override render(): TemplateResult {
    return html`<slot
      @slotchange=${() => this.sync()}
      @loomi-tag-click=${this.onTagClick}
    ></slot>`;
  }
}

export interface LoomiTagClickDetail {
  value: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tag": LoomiTag;
    "loomi-tags": LoomiTags;
  }

  interface HTMLElementEventMap {
    "loomi-tag-click": CustomEvent<LoomiTagClickDetail>;
  }
}
