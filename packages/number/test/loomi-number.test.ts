import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiNumber } from "../dist/index.js";

describe("loomi-number", () => {
  it("reflects its value into the shadow input", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number value="5"></loomi-number>`);
    const input = el.shadowRoot!.querySelector(".loomi-input") as HTMLInputElement;
    expect(input.value).to.equal("5");
  });

  it("submits its value through a native form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><loomi-number name="qty" value="3"></loomi-number></form>
    `);
    const el = form.querySelector("loomi-number") as LoomiNumber;
    await el.updateComplete;
    expect(new FormData(form).get("qty")).to.equal("3");
  });

  it("passes min, max and step through to the native input", async () => {
    const el = await fixture<LoomiNumber>(
      html`<loomi-number min="2" max="8" step="2"></loomi-number>`,
    );
    const input = el.shadowRoot!.querySelector(".loomi-input") as HTMLInputElement;
    expect(input.min).to.equal("2");
    expect(input.max).to.equal("8");
    expect(input.step).to.equal("2");
  });

  it("writes user input back to its value property", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number></loomi-number>`);
    const input = el.shadowRoot!.querySelector(".loomi-input") as HTMLInputElement;
    input.value = "42";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).to.equal("42");
  });

  it("disables the native input when disabled", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number disabled></loomi-number>`);
    const input = el.shadowRoot!.querySelector(".loomi-input") as HTMLInputElement;
    expect(input.disabled).to.be.true;
  });
});
