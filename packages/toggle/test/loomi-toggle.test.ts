import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiToggle } from "../dist/index.js";

describe("loomi-toggle", () => {
  it("flips checked and fires change on click", async () => {
    const el = await fixture<LoomiToggle>(html`<loomi-toggle label="Notify"></loomi-toggle>`);
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    expect(el.checked).to.equal(false);

    setTimeout(() => native.click());
    await oneEvent(el, "change");
    expect(el.checked).to.equal(true);
  });

  it("does not toggle when disabled", async () => {
    const el = await fixture<LoomiToggle>(html`<loomi-toggle disabled></loomi-toggle>`);
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    native.click();
    await el.updateComplete;
    expect(el.checked).to.equal(false);
  });
});
