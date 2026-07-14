import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, onClickOutside } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiColorpickerSize = "small" | "regular" | "medium" | "big";

/** Must match the swatch panel's `grid-template-columns: repeat(4, ...)` in styles.css. */
const GRID_COLUMNS = 4;

/**
 * `<loomi-colorpicker>` — pick a color. Uses the native color input by default; pass a
 * comma-separated `colors` list to show a swatch palette instead. Form-associated.
 *
 * @fires change - `detail: { value }` when a color is chosen.
 */
@customElement("loomi-colorpicker")
export class LoomiColorpicker extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property({ attribute: "selected-value" }) selectedValue = "#000000";
  @property({ type: Boolean, attribute: "show-value" }) showValue = false;
  @property() colors = "";
  @property() locale = "";
  @property() size: LoomiColorpickerSize = "regular";

  @state() private open = false;
  /** Index of the keyboard-highlighted chip within `this.palette`, while open. */
  @state() private activeIndex = -1;
  private cleanup?: () => void;

  override willUpdate(): void {
    this.internals.setFormValue(this.selectedValue);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  private get palette(): string[] {
    return this.colors
      ? this.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];
  }

  private setValue(v: string): void {
    this.selectedValue = v;
    this.internals.setFormValue(v);
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, composed: true, detail: { value: v } }),
    );
  }

  private toggle(): void {
    if (this.open) this.close();
    else this.openPanel();
  }

  private openPanel(): void {
    if (this.open) return;
    this.open = true;
    const palette = this.palette;
    const selectedIndex = palette.findIndex(
      (c) => c.toLowerCase() === this.selectedValue.toLowerCase(),
    );
    this.activeIndex = selectedIndex >= 0 ? selectedIndex : palette.length ? 0 : -1;
    this.cleanup = onClickOutside(this, () => this.close());
  }

  private close(): void {
    if (!this.open) return;
    this.open = false;
    this.activeIndex = -1;
    this.cleanup?.();
    this.cleanup = undefined;
  }

  /**
   * Keeps real DOM focus on the swatch trigger button and drives the panel virtually via
   * `aria-activedescendant` — the same pattern `@loomidev/select`'s listbox uses, so no
   * explicit refocus is needed after Escape/Enter close the panel.
   */
  private onTriggerKeydown = (e: KeyboardEvent): void => {
    const palette = this.palette;
    if (!palette.length) return;
    if (e.key === "Escape") {
      if (this.open) {
        e.preventDefault();
        this.close();
      }
      return;
    }
    if (!this.open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this.openPanel();
      }
      return;
    }
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, palette.length - 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + GRID_COLUMNS, palette.length - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - GRID_COLUMNS, 0);
        break;
      case "Home":
        e.preventDefault();
        this.activeIndex -= this.activeIndex % GRID_COLUMNS;
        break;
      case "End":
        e.preventDefault();
        this.activeIndex = Math.min(
          this.activeIndex - (this.activeIndex % GRID_COLUMNS) + GRID_COLUMNS - 1,
          palette.length - 1,
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (this.activeIndex >= 0 && palette[this.activeIndex]) {
          this.setValue(palette[this.activeIndex]);
          this.close();
        }
        break;
    }
  };

  override render(): TemplateResult {
    const palette = this.palette;
    const activeId =
      this.open && this.activeIndex >= 0 && palette[this.activeIndex]
        ? `loomi-color-${this.activeIndex}`
        : nothing;
    const swatch = palette.length
      ? html`<button
            class="loomi-swatch size-${this.size}"
            style="background:${this.selectedValue}"
            aria-label=${loomiT("colorpicker.pickColor", {}, this.locale)}
            aria-haspopup="listbox"
            aria-expanded=${this.open ? "true" : "false"}
            aria-activedescendant=${activeId}
            @click=${() => this.toggle()}
            @keydown=${this.onTriggerKeydown}
          ></button>
          ${
            this.open
              ? html`<div class="loomi-panel" role="listbox">
                ${palette.map(
                  (c, i) => html`<button
                    id="loomi-color-${i}"
                    class="loomi-chip ${c.toLowerCase() === this.selectedValue.toLowerCase() ? "selected" : ""} ${i === this.activeIndex ? "active" : ""}"
                    style="background:${c}"
                    role="option"
                    aria-selected=${c.toLowerCase() === this.selectedValue.toLowerCase() ? "true" : "false"}
                    aria-label=${c}
                    @mouseenter=${() => (this.activeIndex = i)}
                    @click=${() => {
                      this.setValue(c);
                      this.close();
                    }}
                  ></button>`,
                )}
              </div>`
              : nothing
          }`
      : html`<input class="loomi-native size-${this.size}" type="color" name=${this.name || nothing} .value=${this.selectedValue} @input=${(e: Event) => this.setValue((e.target as HTMLInputElement).value)} />`;

    return html`<div class="loomi-cp">
      ${swatch}
      ${this.showValue ? html`<span class="loomi-value">${this.selectedValue}</span>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-colorpicker": LoomiColorpicker;
  }
}
