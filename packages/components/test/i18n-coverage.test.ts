import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import { defineLoomiTranslations } from "../../core/dist/index.js";
import "../dist/index.js";

/**
 * Components whose copy was previously hardcoded English. Each one now routes its own
 * labels through the translation table, so registering a locale changes them.
 *
 * The point of testing this centrally rather than per package is that the failure mode is
 * uniform and silent: a hardcoded string still renders, still passes every other test, and
 * simply ignores `locale`. Asserting on a registered override is the only thing that tells
 * the two apart.
 */
defineLoomiTranslations("qa" as never, {
  commandPalette: { label: "PALETTE", search: "SEARCH", commands: "COMMANDS" },
  dataGrid: { selectAll: "SELECT-ALL", loadingTitle: "LOADING-ROWS" },
  filterBuilder: { add: "ADD-FILTER", remove: "REMOVE-FILTER", empty: "NO-FILTERS" },
  video: { volume: "VOLUME" },
  chat: { sendMessage: "SEND" },
});

/**
 * Serialises an element's shadow tree including nested component shadow roots. Necessary
 * because a label handed to a child component ends up inside *its* root — <loomi-button>,
 * for instance, moves a host aria-label onto the real button it renders.
 */
function shadowText(root: Element): string {
  const parts: string[] = [];
  const walk = (node: Element): void => {
    if (node.shadowRoot) {
      parts.push(node.shadowRoot.innerHTML);
      for (const child of node.shadowRoot.querySelectorAll("*")) walk(child);
    }
  };
  walk(root);
  for (const child of root.querySelectorAll("*")) walk(child);
  return parts.join("\n");
}

describe("translatable component copy", () => {
  it("translates <loomi-command-palette> labels and placeholder", async () => {
    const el = await fixture(html`<loomi-command-palette locale="qa"></loomi-command-palette>`);
    (el as HTMLElement & { openPalette: () => void }).openPalette();
    await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await nextFrame();

    const markup = shadowText(el);
    expect(markup).to.contain("PALETTE");
    expect(markup).to.contain("SEARCH");
    expect(markup).to.contain("COMMANDS");
  });

  it("translates <loomi-command-palette> defaults but keeps consumer text as given", async () => {
    const translated = await fixture(
      html`<loomi-command-palette locale="qa"></loomi-command-palette>`,
    );
    expect(shadowText(translated)).to.contain("SEARCH");

    const custom = await fixture(
      html`<loomi-command-palette locale="qa" placeholder="Find a thing"></loomi-command-palette>`,
    );
    expect(shadowText(custom), "an explicit placeholder wins over the translation").to.contain(
      "Find a thing",
    );
  });

  it("translates <loomi-data-grid> chrome", async () => {
    const el = await fixture(html`<loomi-data-grid locale="qa" selectable></loomi-data-grid>`);
    const grid = el as HTMLElement & {
      columns: unknown;
      data: unknown;
      updateComplete: Promise<unknown>;
    };
    grid.columns = [{ key: "name", label: "Name" }];
    grid.data = [{ name: "Ama" }];
    await grid.updateComplete;
    expect(shadowText(el)).to.contain("SELECT-ALL");
  });

  it("translates <loomi-filter-builder> controls", async () => {
    const el = await fixture(html`<loomi-filter-builder locale="qa"></loomi-filter-builder>`);
    const markup = shadowText(el);
    expect(markup).to.contain("ADD-FILTER");
    expect(markup).to.contain("NO-FILTERS");
  });

  it("translates <loomi-video> controls", async () => {
    const el = await fixture(html`<loomi-video locale="qa" controls src="x.mp4"></loomi-video>`);
    await nextFrame();
    expect(shadowText(el)).to.contain("VOLUME");
  });

  it("translates <loomi-chat-window> controls", async () => {
    const el = await fixture(html`<loomi-chat-window locale="qa"></loomi-chat-window>`);
    await nextFrame();
    expect(shadowText(el)).to.contain("SEND");
  });
});
