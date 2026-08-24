import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/loomi-listview.js";
import type { LoomiListview } from "../dist/index.js";

describe("loomi-listview", () => {
  it("uses list semantics for rows", async () => {
    const el = await fixture<LoomiListview>(
      html`<loomi-listview><loomi-listview-item>One</loomi-listview-item></loomi-listview>`,
    );

    expect(el.shadowRoot!.querySelector(".loomi-listview")!.getAttribute("role")).to.equal("list");
    expect(
      el
        .querySelector("loomi-listview-item")!
        .shadowRoot!.querySelector(".loomi-li")!
        .getAttribute("role"),
    ).to.equal("listitem");
  });

  it("gives every row a listitem role inside the list", async () => {
    const el = await fixture<LoomiListview>(html`
      <loomi-listview>
        <loomi-listview-item>One</loomi-listview-item>
        <loomi-listview-item>Two</loomi-listview-item>
      </loomi-listview>
    `);
    await nextFrame();
    const rows = Array.from(el.querySelectorAll("loomi-listview-item"));
    expect(rows).to.have.lengthOf(2);
    for (const row of rows) {
      expect(row.shadowRoot!.querySelector('[role="listitem"]')).to.exist;
    }
  });

  it("reflects compact so it can be styled from the light DOM", async () => {
    const el = await fixture<LoomiListview>(
      html`<loomi-listview compact><loomi-listview-item>One</loomi-listview-item></loomi-listview>`,
    );
    expect(el.hasAttribute("compact")).to.be.true;
  });

  it("reflects as-flex on a row", async () => {
    const el = await fixture<LoomiListview>(html`
      <loomi-listview><loomi-listview-item as-flex>One</loomi-listview-item></loomi-listview>
    `);
    const row = el.querySelector("loomi-listview-item")!;
    await nextFrame();
    expect(row.hasAttribute("as-flex")).to.be.true;
  });
});
