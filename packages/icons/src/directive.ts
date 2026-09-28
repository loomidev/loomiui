import { isServer, nothing, type SVGTemplateResult } from "lit";
import { AsyncDirective, directive } from "lit/async-directive.js";
import { getLoomiIcon, loadLoomiIcon, type LoomiIconVariant } from "./heroicons.js";

class LoomiIconDirective extends AsyncDirective {
  private request = "";

  render(name: string, variant: LoomiIconVariant = "outline"): SVGTemplateResult | typeof nothing {
    const ready = getLoomiIcon(name, variant);
    const request = `${variant}/${name}`;
    this.request = request;
    // Server rendering is one synchronous pass, so an icon that isn't ready can't be filled
    // in later there; the client loads it after hydrating.
    if (ready || isServer) return ready ?? nothing;

    void loadLoomiIcon(name, variant).then((icon) => {
      // Superseded by a newer name, or the part was torn down while loading.
      if (this.request !== request || !this.isConnected) return;
      this.setValue(icon ?? nothing);
    });
    return nothing;
  }

  protected override reconnected(): void {
    // A load that settled while disconnected was dropped; the next render re-resolves it.
    this.request = "";
  }
}

/**
 * Renders a Heroicon's inner SVG inside an `<svg>` element, loading that one icon on
 * first use: `` svg`<svg viewBox="0 0 24 24">${loomiIcon("bell")}</svg>` ``.
 *
 * Renders synchronously when the icon is already registered, provided or loaded;
 * otherwise it renders nothing and fills in once the icon's module arrives. Check
 * {@link hasLoomiIcon} first when an unknown name should fall back to something else.
 */
export const loomiIcon = directive(LoomiIconDirective);
