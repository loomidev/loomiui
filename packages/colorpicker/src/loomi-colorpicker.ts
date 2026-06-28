import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, onClickOutside } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiColorpickerSize = "small" | "regular" | "medium" | "big";

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
  private cleanup?: () => void;

  override willUpdate(): void {
    this.internals.setFormValue(this.selectedValue);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  private get palette(): string[] {
    return this.colors ? this.colors.split(",").map((c) => c.trim()).filter(Boolean) : [];
  }

  private setValue(v: string): void {
    this.selectedValue = v;
    this.internals.setFormValue(v);
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value: v } }));
  }

  private toggle(): void {
    this.open = !this.open;
    if (this.open) this.cleanup = onClickOutside(this, () => (this.open = false));
    else this.cleanup?.();
  }

  override render(): TemplateResult {
    const palette = this.palette;
    const swatch = palette.length
      ? html`<button class="loomi-swatch size-${this.size}" style="background:${this.selectedValue}" aria-label=${loomiT("colorpicker.pickColor", {}, this.locale)} @click=${() => this.toggle()}></button>
          ${this.open
            ? html`<div class="loomi-panel" role="listbox">
                ${palette.map((c) => html`<button class="loomi-chip ${c.toLowerCase() === this.selectedValue.toLowerCase() ? "selected" : ""}" style="background:${c}" aria-label=${c} @click=${() => { this.setValue(c); this.open = false; }}></button>`)}
              </div>`
            : nothing}`
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
