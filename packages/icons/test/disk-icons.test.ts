import { expect } from "@open-wc/testing";
import {
  hasLoomiDiskIcon,
  loadLoomiDiskIcon,
  registerLoomiDiskIcon,
  setLoomiIconBasePath,
  getLoomiIconBasePath,
  getLoomiDiskIconUrl,
} from "../dist/index.js";

/** The markup a directive carries, so a test can assert on real path data. */
function markupOf(result: unknown): string {
  return String((result as { values?: unknown[] })?.values?.[0] ?? "");
}

describe("disk icons", () => {
  afterEach(() => setLoomiIconBasePath(undefined));

  it("loads an icon from its generated module with no base path set", async () => {
    const markup = markupOf(await loadLoomiDiskIcon("iconsax", "home", "outline"));

    expect(markup).to.contain("<path");
    expect(markup).to.contain("currentColor");
  });

  it("resolves every shipped source/type through the module path", async () => {
    for (const [source, type, name] of [
      ["iconsax", "outline", "home"],
      ["iconsax", "solid", "home"],
      ["iconsax", "twotone", "home"],
      ["untitledui", "outline", "home-01"],
    ] as const) {
      const markup = markupOf(await loadLoomiDiskIcon(source, name, type));
      expect(markup, `${source}/${type}`).to.contain("<path");
    }
  });

  it("reports unknown names without loading anything", async () => {
    expect(hasLoomiDiskIcon("iconsax", "definitely-not-an-icon")).to.be.false;
    expect(hasLoomiDiskIcon("iconsax", "home")).to.be.true;
    expect(await loadLoomiDiskIcon("iconsax", "definitely-not-an-icon")).to.be.undefined;
  });

  it("falls back to outline for a type a source does not ship", async () => {
    expect(hasLoomiDiskIcon("untitledui", "activity", "twotone")).to.be.true;
    expect(getLoomiDiskIconUrl("untitledui", "activity", "twotone")).to.contain(
      "untitledui/outline/activity.svg",
    );
  });

  it("prefers a statically registered icon over any load", async () => {
    registerLoomiDiskIcon("iconsax", "home", "<path d='M0 0h1v1H0z'/>", "outline");

    expect(markupOf(await loadLoomiDiskIcon("iconsax", "home", "outline"))).to.equal(
      "<path d='M0 0h1v1H0z'/>",
    );
  });

  it("fetches from a base path when one is set", async () => {
    setLoomiIconBasePath("/packages/icons/dist/svg");
    expect(getLoomiIconBasePath()).to.match(/\/packages\/icons\/dist\/svg\/$/);

    const markup = markupOf(await loadLoomiDiskIcon("iconsax", "wallet", "outline"));
    expect(markup).to.contain("<path");
  });

  it("resolves to undefined — never throws — when a base path 404s", async () => {
    setLoomiIconBasePath("/nowhere-at-all");

    expect(await loadLoomiDiskIcon("iconsax", "camera", "outline")).to.be.undefined;
  });

  it("returns to module loading when the base path is cleared", async () => {
    setLoomiIconBasePath("/nowhere-at-all");
    setLoomiIconBasePath(undefined);

    expect(getLoomiIconBasePath()).to.be.undefined;
    expect(markupOf(await loadLoomiDiskIcon("iconsax", "lock", "outline"))).to.contain("<path");
  });
});
