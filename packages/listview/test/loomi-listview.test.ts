import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-listview.js";
import type { LoomiListview } from "../dist/index.js";

describe("loomi-listview", () => {
  it("uses list semantics for rows", async () => {
    const el = await fixture<LoomiListview>(
      html`<loomi-listview><loomi-listview-item>One</loomi-listview-item></loomi-listview>`,
    );

    expect(el.shadowRoot!.querySelector(".loomi-listview")!.getAttribute("role")).to.equal("list");
    expect(el.querySelector("loomi-listview-item")!.shadowRoot!.querySelector(".loomi-li")!.getAttribute("role")).to.equal(
      "listitem",
    );
  });
});
