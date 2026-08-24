import { fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";
import { CASES } from "./component-cases.js";

/**
 * Library-wide accessibility sweep: every custom element the library defines is rendered
 * and checked with axe-core (via `chai-a11y-axe`, which `@open-wc/testing` registers).
 *
 * The markup for each component lives in `./component-cases.js`, shared with the visual
 * regression suite so both measure the same realistic usage. See that file for why the
 * fixtures matter.
 */

// axe runs with its default rule set, color-contrast included: the theme's text tokens
// are tuned so every tier clears WCAG AA against both the light and dark surface (see
// packages/theme/scripts/build-tokens.mjs). A contrast failure here means a token
// regressed, not that the rule needs muting.
const AXE_OPTIONS = {};

describe("accessibility sweep", () => {
  // Self-relocating components append themselves directly to <body>, outside the fixture
  // wrapper that fixtureCleanup() tears down, so they would otherwise accumulate across
  // cases. Fixture content itself lives inside a wrapper div, so a loomi-* element that
  // is a direct child of <body> is always such a leftover.
  afterEach(() => {
    for (const stray of Array.from(document.body.children)) {
      if (stray.tagName.toLowerCase().startsWith("loomi-")) stray.remove();
    }
  });

  for (const [tag, markup] of CASES) {
    it(tag, async () => {
      const el = await fixture(markup ?? `<${tag}></${tag}>`);
      await nextFrame();
      // Components that host overlays — loomi-notification, and the modal/drawer family —
      // move themselves to document.body on connect, which leaves the fixture handle
      // pointing outside the rendered tree and makes axe reject it. Find the relocated
      // element rather than falling back to scanning the whole document, which would
      // fold in leftovers from earlier cases and report them against this component.
      const target = el instanceof Element && el.isConnected ? el : document.querySelector(tag);
      expect(target, `no element rendered for ${tag}`).to.be.instanceOf(Element);
      await expect(target as Element).to.be.accessible(AXE_OPTIONS);
    });
  }
});
