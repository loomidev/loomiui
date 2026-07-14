import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiRadio } from "../dist/index.js";

describe("loomi-radio", () => {
  it("checks and fires change on click", async () => {
    const el = await fixture<LoomiRadio>(
      html`<loomi-radio name="plan" value="pro" label="Pro"></loomi-radio>`,
    );
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    expect(el.checked).to.equal(false);

    setTimeout(() => native.click());
    await oneEvent(el, "change");
    expect(el.checked).to.equal(true);
  });
});
