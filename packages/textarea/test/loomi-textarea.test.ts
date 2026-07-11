import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTextarea } from "../dist/index.js";

describe("loomi-textarea", () => {
  it("reflects its value into the shadow textarea", async () => {
    const el = await fixture<LoomiTextarea>(html`<loomi-textarea label="Notes"></loomi-textarea>`);
    el.value = "hello";
    await el.updateComplete;
    const textarea = el.shadowRoot!.querySelector(".loomi-textarea") as HTMLTextAreaElement;
    expect(textarea.value).to.equal("hello");
  });
});
