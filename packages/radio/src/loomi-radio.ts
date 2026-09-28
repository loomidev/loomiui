import { html, nothing, type PropertyValues, type TemplateResult, isServer } from "lit";
import { customElement, property } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
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
 * @fires input - Fired when the user checks this radio, after `checked` has updated (composed).
 * @fires change - Fired when the user checks this radio (composed).
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

  /**
   * Always `"radio"`, like the native control this replaces, so framework bindings that
   * branch on `type` (Vue, Alpine, …) bind `checked` rather than `value`. Read-only: writes
   * are ignored rather than thrown on, since some frameworks mirror a `type` attribute
   * onto the property.
   */
  get type(): "radio" {
    return "radio";
  }
  set type(_ignored: string) {
    // Read-only; see the getter.
  }

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialChecked = this.checked;
    super.connectedCallback();
  }

  formResetCallback(): void {
    this.checked = this.initialChecked;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // Like a native radio, checking one — by the user or by setting `checked` — unchecks
    // the rest of its group.
    if (changed.has("checked") && this.checked) this.uncheckSiblings();
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

  // The native `input` event is composed, so left alone it reaches listeners on the host
  // before `checked` has caught up. Stop it and re-fire from the host once it has.
  private onInput = (e: Event): void => {
    e.stopPropagation();
    if (this.disabled || this.checked) return;
    this.uncheckSiblings();
    this.checked = true;
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  private onChange = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  override render(): TemplateResult {
    const style = accentVars(this.accentColor);
    return html`
      <label class="loomi-radio" style=${style}>
        <input
          class="loomi-native"
          type="radio"
          name=${this.name || nothing}
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          @input=${this.onInput}
          @change=${this.onChange}
        />
        <span class="loomi-dot" part="dot"></span>
        ${
          // Assume slotted content exists on the server: rendering the slot keeps light-DOM
          // content visible in the server HTML, whereas omitting it would drop that content
          // until hydration.
          this.label || isServer || this.hasChildNodes()
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
  input: Event;
  change: Event;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-radio": LoomiRadio;
  }
}
