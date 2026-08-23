import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  accentVars,
  isLoomiColor,
  type LoomiColor,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-radio>` — a themeable radio button. Give radios in a group the same
 * `name` and they become mutually exclusive (coordinated across the same root,
 * since native radio grouping doesn't cross shadow boundaries). Form-associated.
 *
 * @slot - Label content. Falls back to the `label` attribute.
 * @csspart dot - The radio dot.
 * @fires change - Fired when this radio becomes checked (composed).
 */
@customElement("loomi-radio")
export class LoomiRadio extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private initialChecked = false;

  @property({ reflect: true }) name = "";
  @property() value = "";
  @property() label = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() color: LoomiColor = "primary" as LoomiColor;

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialChecked = this.checked;
    super.connectedCallback();
  }

  formResetCallback(): void {
    this.checked = this.initialChecked;
  }

  override willUpdate(): void {
    this.internals.setFormValue(this.checked ? this.value : null);
  }

  private get accentColor(): LoomiColor {
    return isLoomiColor(this.color) ? this.color : ("primary" as LoomiColor);
  }

  private uncheckSiblings(): void {
    if (!this.name) return;
    const root = (this.getRootNode() as Document | ShadowRoot) ?? document;
    const radios = root.querySelectorAll<LoomiRadio>("loomi-radio");
    radios.forEach((r) => {
      if (r !== this && r.name === this.name) r.checked = false;
    });
  }

  private select(): void {
    if (this.disabled || this.checked) return;
    this.uncheckSiblings();
    this.checked = true;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  override render(): TemplateResult {
    const style = accentVars(this.accentColor);
    return html`
      <label class="loomi-radio" style=${style}>
        <input
          class="loomi-native"
          type="radio"
          name=${this.name || nothing}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${() => this.select()}
        />
        <span class="loomi-dot" part="dot"></span>
        ${
          this.label || this.hasChildNodes()
            ? html`<span class="loomi-label"><slot>${this.label}</slot></span>`
            : nothing
        }
      </label>
    `;
  }
}

/** Event map for `<loomi-radio>`. `change` is a plain `Event`; read `value`/`checked`
 * off the element itself. */
export interface LoomiRadioEventMap {
  change: Event;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-radio": LoomiRadio;
  }
}
