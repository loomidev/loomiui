import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiNumber } from "../dist/index.js";

describe("loomi-number", () => {
  it("reflects its value into the shadow input", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number value="5"></loomi-number>`);
    const input = el.shadowRoot!.querySelector(".loomi-input") as HTMLInputElement;
    expect(input.value).to.equal("5");
  });
});
