// Bundled deliberately: under pnpm's isolated layout a dev server serves the same Lit
// files under several URLs, and ESM identity is per URL — so `lit-element` gets evaluated
// twice, the hydrate hook patches one copy, and the components extend the other. Bundling
// collapses the graph to a single copy, which is what makes hydration testable at all.
//
// Order matters twice over. `lit-element` reads globalThis.litElementHydrateSupport once,
// at module evaluation, so hydrate-support must evaluate first; and the server-rendered
// nodes must be marked before the definitions upgrade their hosts. Hence the static import
// here and the dynamic one below.
import "@lit-labs/ssr-client/lit-element-hydrate-support.js";

const hostFor = (wrapper) => {
  // Overlay hosts (loomi-notification, the modal family) move themselves to <body> on
  // connect, so the wrapper empties out; find them by tag instead.
  const tag = wrapper.dataset.case;
  return wrapper.firstElementChild ?? document.querySelector(tag);
};

const before = new Map();
for (const wrapper of document.querySelectorAll("[data-case]")) {
  const tag = wrapper.dataset.case;
  const host = hostFor(wrapper);
  if (!host) {
    before.set(tag, null);
    continue;
  }
  if (!host.shadowRoot) {
    before.set(tag, { shadow: false, nodes: 0 });
    continue;
  }
  let count = 0;
  for (const node of host.shadowRoot.querySelectorAll("*")) node.__ssrMark = count++;
  before.set(tag, { shadow: true, nodes: count });
}

await import("../packages/components/dist/index.js");

const results = {};
for (const wrapper of document.querySelectorAll("[data-case]")) {
  const tag = wrapper.dataset.case;
  const info = before.get(tag);
  if (!info) {
    results[tag] = { missing: true };
    continue;
  }
  const host = hostFor(wrapper);
  if (!host) {
    results[tag] = { relocated: true };
    continue;
  }
  try {
    await customElements.whenDefined(tag);
    if (host.updateComplete) await host.updateComplete;
  } catch (error) {
    results[tag] = { error: String((error && error.message) || error) };
    continue;
  }
  const after = host.shadowRoot ? [...host.shadowRoot.querySelectorAll("*")] : [];
  results[tag] = {
    hadShadowRoot: info.shadow,
    nodes: info.nodes,
    adopted: after.filter((node) => node.__ssrMark !== undefined).length,
  };
}

window.__ssrResults = results;
window.__ssrDone = true;
