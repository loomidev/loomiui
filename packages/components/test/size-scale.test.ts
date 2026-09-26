import { expect } from "@open-wc/testing";
import "../dist/index.js";
import { LOOMI_SIZES, type LoomiSizeSupport } from "../../core/dist/index.js";
import { CASES } from "./component-cases.js";

/**
 * Every component's `size` (and `*-size`) attribute draws from the one canonical scale in
 * `@loomidev/core` — tiny < small < regular < medium < big < huge < omg — so a name means
 * the same position everywhere. For every element the library defines this checks:
 *
 * - each size-like property is declared in the element's static `supportedSizes`,
 * - each declared list only uses canonical names, in canonical order, and includes `regular`,
 * - each size-like property defaults to `regular`,
 * - the element's own stylesheet styles no size name outside the scale (`.size-*`,
 *   `[size=*]`, `.blur-*`), which catches a stale name left behind in CSS.
 */

type SizedElementClass = CustomElementConstructor & {
  supportedSizes?: LoomiSizeSupport;
  elementProperties?: Map<PropertyKey, { type?: unknown; state?: boolean }>;
  elementStyles?: Array<{ cssText?: string } | CSSStyleSheet>;
};

/** Size-named properties that take a free-form CSS length or a count, not a scale name. */
const FREE_FORM_SIZE_PROPERTIES = new Set([
  "loomi-icon.size",
  "loomi-statistic.iconSize",
  "loomi-scroller.edgeSize",
  "loomi-resizable-panel.defaultSize",
  "loomi-filepicker.maxFileSize",
]);

/** Tailwind `size-*` utility keywords that can appear in a generated stylesheet. */
const TAILWIND_SIZE_KEYWORDS = new Set(["full", "fit", "min", "max", "auto", "px", "screen"]);

const canonical = LOOMI_SIZES as readonly string[];

function sizeProperties(tag: string, ctor: SizedElementClass): string[] {
  const names: string[] = [];
  for (const [key, options] of ctor.elementProperties ?? []) {
    const name = String(key);
    if (name !== "size" && !name.endsWith("Size")) continue;
    if (options.state || options.type === Number) continue;
    if (FREE_FORM_SIZE_PROPERTIES.has(`${tag}.${name}`)) continue;
    names.push(name);
  }
  return names;
}

function styledSizeNames(ctor: SizedElementClass): string[] {
  const css = (ctor.elementStyles ?? [])
    .map((style) =>
      style instanceof CSSStyleSheet
        ? Array.from(style.cssRules, (rule) => rule.cssText).join("\n")
        : (style.cssText ?? ""),
    )
    .join("\n");
  const found = new Set<string>();
  for (const match of css.matchAll(/\.size-([a-z]+)(?![\w\\-])/g)) {
    if (!TAILWIND_SIZE_KEYWORDS.has(match[1])) found.add(match[1]);
  }
  for (const match of css.matchAll(/\[size=["']?([a-z]+)["']?\]/g)) found.add(match[1]);
  for (const match of css.matchAll(/\.blur-([a-z]+)(?![\w\\-])/g)) {
    if (match[1] !== "none") found.add(match[1]);
  }
  return [...found];
}

describe("canonical size scale", () => {
  it("is ordered tiny < small < regular < medium < big < huge < omg", () => {
    expect(canonical).to.deep.equal(["tiny", "small", "regular", "medium", "big", "huge", "omg"]);
  });

  for (const [tag] of CASES as Array<[string, string | null]>) {
    const ctor = customElements.get(tag) as SizedElementClass | undefined;
    if (!ctor) continue;
    const properties = sizeProperties(tag, ctor);
    const styled = styledSizeNames(ctor);
    if (properties.length === 0 && styled.length === 0) continue;

    it(`${tag} only accepts names from the canonical scale`, () => {
      const supported = ctor.supportedSizes ?? {};
      const instance = document.createElement(tag) as unknown as Record<string, unknown>;

      for (const property of properties) {
        const names = supported[property];
        expect(names, `${tag}.${property} is missing from static supportedSizes`).to.be.an("array");
        for (const name of names) {
          expect(canonical, `${tag}.${property} accepts "${name}"`).to.include(name);
        }
        const positions = names.map((name) => canonical.indexOf(name));
        expect(positions, `${tag}.${property} lists sizes in scale order`).to.deep.equal(
          [...positions].sort((a, b) => a - b),
        );
        expect(names, `${tag}.${property} supports the default`).to.include("regular");
        expect(instance[property], `${tag}.${property} defaults to regular`).to.equal("regular");
      }

      for (const property of Object.keys(supported)) {
        expect(properties, `${tag}.supportedSizes.${property} is a size property`).to.include(
          property,
        );
      }

      for (const name of styled) {
        expect(canonical, `${tag}'s stylesheet styles size "${name}"`).to.include(name);
      }
    });
  }
});
