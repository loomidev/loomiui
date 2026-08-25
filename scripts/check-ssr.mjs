// Renders every custom element the library defines through @lit-labs/ssr and asserts it
// produces Declarative Shadow DOM markup without throwing.
//
// This is what lets LoomiUI be used from a server-rendered stack — Astro, Rails, Laravel,
// Django, plain static HTML — where the page must contain real markup before any
// JavaScript runs. It is deliberately a Node check rather than part of the browser suite:
// the whole point is that it runs with no DOM present.
//
// The failure mode it guards against is a component reading the DOM during render().
// There is no light DOM, no layout and no host element on the server, so `this.children`,
// `this.querySelector`, `getBoundingClientRect` and `this.style` are all unavailable
// there. Guard such reads with lit's `isServer` (see packages/select/src/loomi-select.ts
// for the collection case and packages/checkbox for the slot case).
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { html, unsafeStatic } from "lit/static-html.js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");

const tags = [];
for (const name of readdirSync(packagesDir)) {
  const manifestPath = path.join(packagesDir, name, "custom-elements.json");
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.customElement && declaration.tagName) tags.push(declaration.tagName);
    }
  }
}
tags.sort();

await import(path.join(packagesDir, "components", "dist", "index.js"));

const failures = [];
for (const tag of tags) {
  const tagName = unsafeStatic(tag);
  try {
    const markup = collectResultSync(render(html`<${tagName}></${tagName}>`));
    if (!markup.includes("shadowrootmode=")) {
      failures.push([tag, "rendered no declarative shadow root"]);
    }
  } catch (error) {
    failures.push([tag, (error?.message || String(error)).trim().split("\n")[0]]);
  }
}

if (failures.length > 0) {
  console.error(`${failures.length} of ${tags.length} components failed to server-render:`);
  for (const [tag, reason] of failures) console.error(`  ${tag}: ${reason}`);
  console.error("\nGuard DOM access during render() with lit's `isServer`.");
  process.exit(1);
}

console.log(`All ${tags.length} components server-render to declarative shadow DOM.`);
