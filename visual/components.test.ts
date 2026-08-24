import { fixture, nextFrame } from "@open-wc/testing";
import { visualDiff } from "@web/test-runner-visual-regression";
import "../packages/components/dist/index.js";
import { CASES } from "../packages/components/test/component-cases.js";

/**
 * Visual regression over every component, in both themes.
 *
 * This is the suite that guards *appearance* — the palette, the spacing scale, the
 * component chrome. Nothing else in the repo does: a change to a theme token alters how
 * ~35 components render and the unit tests, the axe sweep and the SSR check would all
 * still pass.
 *
 * Markup comes from `component-cases.js`, shared with the accessibility sweep, so both
 * suites measure the same realistic usage rather than drifting apart.
 */

/** Components that host an overlay relocate themselves to <body> on connect. */
const RELOCATES = new Set(["loomi-notification", "loomi-modal", "loomi-drawer", "loomi-lightbox"]);

function frame(): HTMLElement {
  const host = document.createElement("div");
  // A fixed width and an opaque background keep the capture stable: without them the
  // screenshot is the size of the component and composites over whatever came before.
  host.style.cssText =
    "width: 640px; padding: 24px; background: var(--loomi-surface, #fff); font-family: sans-serif;";
  return host;
}

async function settle(): Promise<void> {
  await nextFrame();
  await nextFrame();
  if (document.fonts?.ready) await document.fonts.ready;
}

/**
 * Light and dark cover the palette; the RTL pass covers direction. RTL is captured in one
 * theme only — mirroring is a layout concern and does not interact with the palette, so a
 * second RTL theme would double the baselines without adding information.
 */
const VARIANTS = [
  { name: "light", dark: false, dir: "ltr" },
  { name: "dark", dark: true, dir: "ltr" },
  { name: "rtl", dark: false, dir: "rtl" },
] as const;

for (const variant of VARIANTS) {
  describe(`visual — ${variant.name}`, () => {
    before(() => {
      document.documentElement.classList.toggle("dark", variant.dark);
      document.documentElement.setAttribute("dir", variant.dir);
      document.body.style.background = variant.dark ? "#1e2939" : "#ffffff";
    });

    after(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("dir");
      document.body.style.background = "";
    });

    afterEach(() => {
      for (const stray of Array.from(document.body.children)) {
        if (stray.tagName.toLowerCase().startsWith("loomi-")) stray.remove();
      }
    });

    for (const [tag, markup] of CASES) {
      // Overlay hosts render nothing in place until opened; capturing them here would
      // photograph an empty box and report a false pass.
      if (RELOCATES.has(tag)) continue;

      it(tag, async () => {
        const host = frame();
        host.innerHTML = markup ?? `<${tag}></${tag}>`;
        const el = await fixture(host);
        await settle();
        await visualDiff(el, `${variant.name}/${tag}`);
      });
    }
  });
}
